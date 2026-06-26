import { useNavigate } from 'react-router';
import StatusBadge from './StatusBadge';

export default function JobCard({ job, onDelete }) {
  const navigate = useNavigate();

  const formattedDate = new Date(job.appliedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{job.company}</h2>
          <p className="text-sm text-gray-500">{job.role}</p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <p className="text-xs text-gray-400">Applied: {formattedDate}</p>

      {job.notes && <p className="text-sm text-gray-600">{job.notes}</p>}

      {job.jobUrl && (
        <a
          href={job.jobUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-blue-500 hover:underline"
        >
          View Posting
        </a>
      )}

      <div className="flex gap-2 mt-2">
        <button
          onClick={() => navigate(`/edit/${job._id}`)}
          className="flex-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 rounded-lg"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(job._id)}
          className="flex-1 text-sm bg-red-100 hover:bg-red-200 text-red-600 py-1 rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
