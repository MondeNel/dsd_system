import { useData } from '../context/DataContext';
import CommentsView from './CommentsView';

export default function CommentsScreen() {
  const { entries } = useData();
  return (
    <div>
      <h3 className="mb-4 text-sm font-medium text-gray-800">All Comments</h3>
      <CommentsView entries={entries} />
    </div>
  );
}