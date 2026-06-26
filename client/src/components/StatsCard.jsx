export default function StatsCard({ label, count }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
      <span className="text-3xl font-bold text-gray-800">{count}</span>
      <span className="text-sm text-gray-500 mt-1">{label}</span>
    </div>
  );
}
