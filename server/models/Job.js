import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
    {
        company: { type: String, required: true },
        role: { type: String, required: true },
        jobUrl: { type: String },
        status: {
            type: String,
            enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
            default: 'Applied'
        },
        appliedDate: { type: Date, default: Date.now },
        notes: { type: String },
    },
    { timestamps: true }
)

const Job = mongoose.model('Job', jobSchema);

export default Job;