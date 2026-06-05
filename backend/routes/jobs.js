const express = require('express');
const Job = require('../models/Job');
const { authMiddleware, companyMiddleware } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs
// @access  Public
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'name company companyRegistration profilePicture');
        res.status(200).json({ success: true, count: jobs.length, jobs });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
});

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'name company companyRegistration profilePicture');
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        res.status(200).json({ success: true, job });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
});

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private (Company Only)
router.post('/', authMiddleware, companyMiddleware, async (req, res) => {
    try {
        // Add the user ID to the job payload
        req.body.postedBy = req.user._id;

        const newJob = new Job(req.body);
        const savedJob = await newJob.save();

        res.status(201).json({ success: true, message: 'Job created successfully', job: savedJob });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private (Company Only)
router.put('/:id', authMiddleware, companyMiddleware, async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Make sure the company trying to update the job actually owns it
        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, message: 'Job updated successfully', job });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private (Company Only)
router.delete('/:id', authMiddleware, companyMiddleware, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Make sure the company trying to delete the job actually owns it
        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
        }

        await job.deleteOne();

        res.status(200).json({ success: true, message: 'Job deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
});

module.exports = router;
