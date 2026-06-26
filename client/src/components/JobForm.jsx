import { useState } from 'react';

const defaultData = {
  company: '',
  role: '',
  jobUrl: '',
  status: 'Applied',
  appliedDate: new Date().toISOString().split('T')[0], // today as default
  notes: '',
};

export default function JobForm({ initialData = defaultData, onSubmit }) {
  const [form, setForm] = useState(initialData);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-sm text-gray-600">Company *</label>
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Role *</label>
        <input
          name="role"
          value={form.role}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Job URL</label>
        <input
          name="jobUrl"
          value={form.jobUrl}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
        >
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-gray-600">Applied Date</label>
        <input
          type="date"
          name="appliedDate"
          value={form.appliedDate}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium"
      >
        Save
      </button>
    </form>
  );
}
