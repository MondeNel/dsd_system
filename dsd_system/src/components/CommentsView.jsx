import { useState } from 'react';
import { useData } from '../context/DataContext';
import { MessageSquare, Send } from 'lucide-react';

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
      {/* Entry list */}
      <div className="col-span-1 glass-card rounded-2xl p-4">
        <h4 className="mb-3 text-sm font-semibold text-slate-800">All entries</h4>
        {entries.length === 0 && (
          <p className="text-xs text-slate-400">No entries yet.</p>
        )}
        <ul className="space-y-1">
          {entries.map((e) => (
            <li
              key={e.id}
              onClick={() => setSelectedEntry(e)}
              className={`cursor-pointer rounded-xl px-3 py-2 text-xs leading-tight transition-all ${
                selectedEntry?.id === e.id
                  ? 'bg-indigo-50/70 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:bg-white/50'
              }`}
            >
              <span className="block font-medium">{e.indicator}</span>
              <span className="text-slate-400">
                {e.date}
                {e.comments?.length > 0 && (
                  <span className="ml-1.5 inline-flex items-center gap-1 text-indigo-500">
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
      <div className="col-span-2 glass-card rounded-2xl p-5">
        {selectedEntry ? (
          <div className="flex h-full flex-col">
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-800">
                {selectedEntry.indicator}
              </h4>
              <p className="text-xs text-slate-400">
                {selectedEntry.location} · {selectedEntry.date}
              </p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {(selectedEntry.comments || []).length === 0 && (
                <p className="text-sm text-slate-400">
                  No comments yet. Be the first to add one.
                </p>
              )}
              {(selectedEntry.comments || []).map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-white/20 bg-white/40 p-3"
                >
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800">
                      {c.author}
                    </span>
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-600">
                      {c.role}
                    </span>
                    <span className="ml-auto text-[11px] text-slate-400">
                      {c.date}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{c.text}</p>
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
                className="flex-1 rounded-xl border border-slate-200 bg-white/60 backdrop-blur px-3 py-2 text-sm placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-400/20"
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Send size={14} />
                Post
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center text-sm text-slate-400">
            Select an entry on the left to view or add comments.
          </div>
        )}
      </div>
    </div>
  );
}