import { useNavigate } from 'react-router';
import { createJob } from '../services/api';
import JobForm from '../components/JobForm';

export default function AddJob() {
    const navigate = useNavigate();

    async function handleSubmit(formData) {
        await createJob(formData);
        navigate('/');
    }

    return (
        <div className="max-w-lg mx-auto px-4 py-8">
            <a href="/" className="text-sm text-blue-500 hover:underline">← Back</a>
            <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-6">Add Job</h1>
            <JobForm onSubmit={handleSubmit} />
        </div>
    );
}
