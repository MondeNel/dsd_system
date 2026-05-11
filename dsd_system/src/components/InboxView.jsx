import { useData } from '../context/DataContext';

export default function InboxView() {
  const { entries } = useData();
  const submitted = entries.filter(e => e.status === 'captured');

  return (
    <div>
      <h3 className="mb-4 text-sm font-medium text-gray-800">Form inbox</h3>
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full">
          <thead className="bg-gray-50 text-[11px] font-medium uppercase text-gray-500">
            <tr>
              <th className="px-4 py-2.5 text-left">Form</th>
              <th className="px-4 py-2.5 text-left">Location</th>
              <th className="px-4 py-2.5 text-left">Submitted</th>
              <th className="px-4 py-2.5 text-left">Status</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {submitted.map(e => (
              <tr key={e.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2.5 text-sm">{e.indicator}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{e.location}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{e.date}</td>
                <td><span className="inline-block rounded-full bg-lime-100 px-2.5 py-0.5 text-[11px] font-medium text-lime-800">Complete</span></td>
                <td className="px-4 py-2.5"><button className="rounded border px-2 py-1 text-xs hover:bg-gray-100">View</button></td>
              </tr>
            ))}
            {submitted.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-400">No submitted forms yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}