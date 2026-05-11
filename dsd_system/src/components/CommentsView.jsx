import { useState } from 'react';
import { useData } from '../context/DataContext';

export default function CommentsView({ entries }) {
  const { addComment } = useData();
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedEntry) return;
    addComment(selectedEntry.id, {
      text: newComment,
      author: 'Velile Sean',
      role: 'Social Info Officer',
    });
    setNewComment('');
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1 rounded-lg border bg-white p-4">
        <h4 className="mb-3 text-sm font-medium text-gray-800">Linked entries</h4>
        <ul className="space-y-1">
          {entries
            .filter(e => e.comments && e.comments.length > 0)
            .map(e => (
              <li
                key={e.id}
                onClick={() => setSelectedEntry(e)}
                className={`cursor-pointer rounded px-2 py-1.5 text-sm ${
                  selectedEntry?.id === e.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {e.indicator}
              </li>
            ))}
        </ul>
      </div>
      <div className="col-span-2 rounded-lg border bg-white p-4">
        {selectedEntry ? (
          <>
            <h4 className="mb-4 text-sm font-medium text-gray-800">
              Comments for: {selectedEntry.indicator}
            </h4>
            <div className="mb-4 space-y-3">
              {(selectedEntry.comments || []).map(c => (
                <div key={c.id} className="rounded border p-3">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="text-sm font-medium">{c.author}</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">{c.role}</span>
                    <span className="text-[11px] text-gray-400">{c.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{c.text}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
              />
              <button onClick={handleAddComment} className="rounded bg-emerald-700 px-3 py-1.5 text-sm text-white hover:bg-emerald-800">
                Post
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-400">Select an entry from the left to view comments.</p>
        )}
      </div>
    </div>
  );
}