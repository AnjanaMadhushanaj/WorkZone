const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

/**
 * Helper: map a Mongoose job doc to a plain object the frontend expects
 */
const mapJob = (job) => ({
  id: job._id.toString(),
  title: job.title,
  company: job.company,
  location: job.location,
  rate: job.rate,
  amount: job.amount,
  type: job.type,
  tags: job.tags,
  logoColor: job.logoColor,
  description: job.description,
  postedBy: job.postedBy,
});

/**
 * @route   GET /api/jobs
 * @desc    Get all active jobs, or search by keyword & location
 * @access  Public
 * @query   q        - search keyword (matches title, company, tags, description)
 *          location - location filter
 *          type     - job type filter (Part-Time | Full-Time | Freelance | Contract)
 */
router.get('/', async (req, res) => {
  try {
    const { q, location, type } = req.query;

    const query = { isActive: true };

    // Keyword search across title, company, tags, description
    if (q && q.trim()) {
      const keyword = q.trim();
      query.$or = [
        { title:       { $regex: keyword, $options: 'i' } },
        { company:     { $regex: keyword, $options: 'i' } },
        { tags:        { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Location filter
    if (location && location.trim()) {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    // Job type filter
    if (type && type.trim()) {
      query.type = type.trim();
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs: jobs.map(mapJob),
    });
  } catch (error) {
    console.error('Get Jobs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
    });
  }
});

/**
 * @route   GET /api/jobs/:id
 * @desc    Get a single job by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.status(200).json({ success: true, job: mapJob(job) });
  } catch (error) {
    console.error('Get Job Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch job' });
  }
});

/**
 * @route   POST /api/jobs
 * @desc    Create a new job posting (company)
 * @access  Public (can add auth middleware later)
 */
router.post('/', async (req, res) => {
  try {
    const { title, company, location, rate, amount, type, tags, logoColor, description, postedBy } = req.body;

    if (!title || !company || !location || !rate || !type) {
      return res.status(400).json({
        success: false,
        message: 'title, company, location, rate, and type are required',
      });
    }

    const job = await Job.create({
      title,
      company,
      location,
      rate,
      amount: amount || 0,
      type,
      tags: tags || [],
      logoColor: logoColor || 'bg-blue-500',
      description: description || '',
      postedBy: postedBy || '',
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job: mapJob(job),
    });
  } catch (error) {
    console.error('Create Job Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create job' });
  }
});

module.exports = router;
