import Job from '../models/Job.js';

// GET /api/jobs
export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// POST /api/jobs
export const createJob = async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json(job);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


// PUT /api/jobs/:id
export const updateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job)
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// DELETE /api/jobs/:id
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json({ message: 'Job deleted!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}