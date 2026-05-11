import { useState } from 'react';
import { useData } from '../context/DataContext';
import { MessageSquare } from 'lucide-react';

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
    // Update local selected entry reference so new comment shows immediately
    setSelectedEntry((prev) => ({
      ...prev,
      comments: [
        ...(prev.comments || []),
        {
          id: Date.now().toString(),
          text: newComment,
          author: 'Velile Sean',
          role: 'Social Info Officer',
          date: new Date().toISOString().split('T')[0],
        },
      ],
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Entry list — ALL entries, not just ones with comments */}
      <div className="col-span-1 rounded-lg border bg-white p-4">
        <h4 className="mb-3 text-sm font-medium text-gray-800">All entries</h4>
        {entries.length === 0 && (
          <p className="text-xs text-gray-400">No entries yet.</p>
        )}
        <ul className="space-y-1">
          {entries.map((e) => (
            <li
              key={e.id}
              onClick={() => setSelectedEntry(e)}
              className={`cursor-pointer rounded px-2 py-2 text-xs leading-tight transition-colors ${
                selectedEntry?.id === e.id
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="block font-medium">{e.indicator}</span>
              <span className="text-gray-400">
                {e.date}
                {e.comments?.length > 0 && (
                  <span className="ml-1.5 inline-flex items-center gap-0.5 text-emerald-600">
                    <MessageSquare size={10} />
                    {e.comments.length}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Comments panel */}
      <div className="col-span-2 rounded-lg border bg-white p-4">
        {selectedEntry ? (
          <div className="flex h-full flex-col">
            <h4 className="mb-1 text-sm font-medium text-gray-800">
              {selectedEntry.indicator}
            </h4>
            <p className="mb-4 text-xs text-gray-400">{selectedEntry.location} · {selectedEntry.date}</p>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {(selectedEntry.comments || []).length === 0 && (
                <p className="text-sm text-gray-400">No comments yet. Be the first to add one.</p>
              )}
              {(selectedEntry.comments || []).map((c) => (
                <div key={c.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">{c.author}</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">
                      {c.role}
                    </span>
                    <span className="ml-auto text-[11px] text-gray-400">{c.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{c.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a comment… (Enter to post)"
                className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-200"
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="rounded bg-emerald-700 px-3 py-1.5 text-sm text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Post
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center text-sm text-gray-400">
            Select an entry on the left to view or add comments.
          </div>
        )}
      </div>
    </div>
  );
}