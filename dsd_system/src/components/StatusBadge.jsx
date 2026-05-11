import { STATUS_CONFIG } from '../constants';

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    className: 'bg-gray-100 text-gray-600',
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}