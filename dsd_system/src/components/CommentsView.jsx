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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Entry list */}
      <div className="col-span-1 glass-card rounded-2xl p-5 max-h-80 lg:max-h-none overflow-y-auto">
        <h4 className="mb-4 text-base font-semibold text-slate-800 dark:text-slate-100">All entries</h4>
        {entries.length === 0 && (
          <p className="text-sm text-slate-400 dark:text-slate-500">No entries yet.</p>
        )}
        <ul className="space-y-2">
          {entries.map((e) => (
            <li
              key={e.id}
              onClick={() => setSelectedEntry(e)}
              className={`cursor-pointer rounded-xl px-4 py-3 text-sm leading-tight transition-all ${
                selectedEntry?.id === e.id
                  ? 'bg-indigo-50/70 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span className="block font-medium">{e.indicator}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {e.date}
                {e.comments?.length > 0 && (
                  <span className="ml-2 inline-flex items-center gap-1 text-indigo-500 dark:text-indigo-400">
                    <MessageSquare size={12} />
                    {e.comments.length}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Comments panel */}
      <div className="col-span-1 lg:col-span-2 glass-card rounded-2xl p-5">
        {selectedEntry ? (
          <div className="flex h-full flex-col">
            <div className="mb-5">
              <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                {selectedEntry.indicator}
              </h4>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                {selectedEntry.location} · {selectedEntry.date}
              </p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto max-h-72 lg:max-h-none">
              {(selectedEntry.comments || []).length === 0 && (
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  No comments yet. Be the first to add one.
                </p>
              )}
              {(selectedEntry.comments || []).map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-white/20 dark:border-slate-700/30 bg-white/40 dark:bg-slate-800/40 p-4"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {c.author}
                    </span>
                    <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-300">
                      {c.role}
                    </span>
                    <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">
                      {c.date}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{c.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a comment… (Enter to post)"
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-600 bg-white/60 dark:bg-slate-800/60 backdrop-blur px-4 py-2.5 text-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-slate-200 focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-400/20"
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Send size={14} />
                Post
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center text-sm text-slate-400 dark:text-slate-500">
            Select an entry on the left to view or add comments.
          </div>
        )}
      </div>
    </div>
  );
}