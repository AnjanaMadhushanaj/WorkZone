const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a job title'],
        trim: true,
    },
    companyName: {
        type: String,
        required: [true, 'Please provide a company name'],
    },
    location: {
        type: String,
        required: [true, 'Please provide a location'],
    },
    rate: {
        type: String,
        required: [true, 'Please provide the pay rate (e.g., LKR 1,500/hr)'],
    },
    amount: {
        type: Number,
        required: [true, 'Please provide the numeric total amount or rate'],
    },
    type: {
        type: String,
        enum: ['Part-Time', 'Full-Time', 'Contract', 'Freelance'],
        default: 'Part-Time',
    },
    tags: {
        type: [String], // Array of strings like ['Design', 'UI/UX']
        default: [],
    },
    logoColor: {
        type: String,
        default: 'bg-blue-500', // Matches your frontend Tailwind classes
    },
    description: {
        type: String,
        required: [true, 'Please provide a job description'],
    },
    postedBy: {
        // Links this job to the Company user who posted it
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['Open', 'Closed', 'Filled'],
        default: 'Open',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Job', jobSchema);
