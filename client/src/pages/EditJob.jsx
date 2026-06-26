import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getJobs, updateJob } from '../services/api';
import JobForm from '../components/JobForm';

export default function EditJob() {
    const [initialData, setInitialData] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch all jobs, find the one matching the URL id
    useEffect(() => {
        getJobs().then((res) => {
            const job = res.data.find((j) => j._id === id);
            if (job) {
                // Format date to YYYY-MM-DD so the date input field works correctly
                setInitialData({ ...job, appliedDate: job.appliedDate.split('T')[0] });
            }
        });
    }, [id]);

    async function handleSubmit(formData) {
        await updateJob(id, formData);
        navigate('/');
    }

    if (!initialData) return <p className="text-center text-gray-400 mt-12">Loading...</p>;

    return (
        <div className="max-w-lg mx-auto px-4 py-8">
            <a href="/" className="text-sm text-blue-500 hover:underline">← Back</a>
            <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-6">Edit Job</h1>
            <JobForm initialData={initialData} onSubmit={handleSubmit} />
        </div>
    );
}
