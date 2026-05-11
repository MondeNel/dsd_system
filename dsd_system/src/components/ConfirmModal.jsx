import { AlertCircle } from 'lucide-react';

export default function ConfirmModal({ isOpen, onConfirm, onCancel, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onCancel}></div>

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start gap-3">
          <AlertCircle size={20} className="mt-0.5 text-amber-500" />
          <div>
            <h3 className="text-sm font-medium text-gray-800">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}