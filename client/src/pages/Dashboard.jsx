import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getJobs, deleteJob } from '../services/api';
import JobCard from '../components/JobCard';
import StatsCard from '../components/StatsCard';

const STATUSES = ['All', 'Applied', 'Interview', 'Offer', 'Rejected'];

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  // Fetch all jobs on mount
  useEffect(() => {
    getJobs().then((res) => setJobs(res.data));
  }, []);

  // Confirm then delete, remove from state without re-fetching
  async function handleDelete(id) {
    if (!window.confirm('Delete this job?')) return;
    await deleteJob(id);
    setJobs(jobs.filter((j) => j._id !== id));
  }

  const filtered = filter === 'All' ? jobs : jobs.filter((j) => j.status === filter);
  const count = (status) => jobs.filter((j) => j.status === status).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">AppFlow</h1>
        <button
          onClick={() => navigate('/add')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add Job
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <StatsCard label="Total" count={jobs.length} />
        <StatsCard label="Applied" count={count('Applied')} />
        <StatsCard label="Interview" count={count('Interview')} />
        <StatsCard label="Offer" count={count('Offer')} />
        <StatsCard label="Rejected" count={count('Rejected')} />
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-sm font-medium border ${
              filter === s
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Job list */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 mt-12">No jobs found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((job) => (
            <JobCard key={job._id} job={job} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
