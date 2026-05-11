import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'eme_data';

const initialEntries = [
  {
    id: 'e1',
    date: '2026-05-08',
    indicator: 'Number of Reported Cases of Child Abuse',
    addedBy: 'Velile Sean',
    role: 'Social Info Officer',
    location: 'Prieska Siya-Themba',
    status: 'captured',
    genderMale: 1,
    genderFemale: 2,
    age0_18: 1,
    age19_35: 1,
    age36_59: 1,
    age60plus: 0,
    services: { 'Mediation service': 1, 'Marriage counselling': 0, 'Marriage enrichment': 1, 'Marriage preparation': 0 },
    comments: [],
  },
  {
    id: 'e2',
    date: '2026-05-05',
    indicator: 'Children with valid foster care orders',
    addedBy: 'Therosmea',
    role: 'Social Info Officer',
    location: 'Prieska Siya-Themba',
    status: 'pending',
    genderMale: 0,
    genderFemale: 8,
    age0_18: 8,
    age19_35: 0,
    age36_59: 0,
    age60plus: 0,
    services: {},
    comments: [],
  },
  {
    id: 'e3',
    date: '2026-05-02',
    indicator: 'Family Preservation Mediation',
    addedBy: 'Velile Sean',
    role: 'Social Info Officer',
    location: 'Prieska Siya-Themba',
    status: 'captured',
    genderMale: 19,
    genderFemale: 28,
    age0_18: 5,
    age19_35: 22,
    age36_59: 15,
    age60plus: 5,
    services: { 'Mediation service': 20, 'Marriage counselling': 12, 'Marriage enrichment': 5, 'Marriage preparation': 8 },
    comments: [
      {
        id: 'c1',
        text: 'Confirmed figures with the field team.',
        author: 'Velile Sean',
        role: 'Social Info Officer',
        date: '2026-05-03',
      },
    ],
  },
  {
    id: 'e4',
    date: '2026-04-30',
    indicator: 'Parenting programme participants',
    addedBy: 'Velile Sean',
    role: 'Social Info Officer',
    location: 'Prieska Siya-Themba',
    status: 'inprogress',
    genderMale: 1,
    genderFemale: 1,
    age0_18: 0,
    age19_35: 2,
    age36_59: 0,
    age60plus: 0,
    services: {},
    comments: [],
  },
  {
    id: 'e5',
    date: '2026-05-10',
    indicator: 'HIV/AIDS Care & Services',
    addedBy: 'Dineo Molefe',
    role: 'Social Info Officer',
    location: 'Kuruman Service Point',
    status: 'captured',
    genderMale: 12,
    genderFemale: 15,
    age0_18: 3,
    age19_35: 9,
    age36_59: 10,
    age60plus: 5,
    services: { 'Mediation service': 5, 'Marriage counselling': 7 },
    comments: [],
  },
  {
    id: 'e6',
    date: '2026-04-28',
    indicator: 'Family members in Family Preservation Services',
    addedBy: 'Bongani Nkosi',
    role: 'Social Info Officer',
    location: 'De Aar Service Point',
    status: 'captured',
    genderMale: 22,
    genderFemale: 30,
    age0_18: 8,
    age19_35: 18,
    age36_59: 20,
    age60plus: 6,
    services: { 'Marriage enrichment': 10, 'Marriage preparation': 5 },
    comments: [],
  },
];

const DataContext = createContext();

export function DataProvider({ children }) {
  const [entries, setEntries] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { return JSON.parse(stored); } catch { return initialEntries; }
    }
    return initialEntries;
  });

  const [role, setRole] = useState('officer'); // 'officer' | 'supervisor'

  // Loading state – simulates initial data fetch
  const [loading, setLoading] = useState(true);

  // Simulate data fetching delay (800ms)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter state for search / filters
  const [filter, setFilter] = useState({
    indicator: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });

  // Clear all filters — memoized to keep the reference stable
  const clearFilter = useCallback(
    () => setFilter({ indicator: '', status: '', dateFrom: '', dateTo: '' }),
    []
  );

  // Current user info — in a real app this comes from auth
  const currentUser = {
    name: 'Velile Sean',
    initials: 'VS',
    role: role === 'officer' ? 'Social Info Officer' : 'Supervisor',
    location: 'Prieska Siya-Themba',
    servicePoint: 'Prieska Siya-Themba Service Point',
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  // Role‑based filtering
  const roleFiltered =
    role === 'officer'
      ? entries.filter((e) => e.location === currentUser.location)
      : entries;

  // Apply additional search filters on top of role filter
  const filteredEntries = roleFiltered.filter((entry) => {
    if (filter.indicator && entry.indicator !== filter.indicator) return false;
    if (filter.status && entry.status !== filter.status) return false;
    if (filter.dateFrom && entry.date < filter.dateFrom) return false;
    if (filter.dateTo && entry.date > filter.dateTo) return false;
    return true;
  });

  const visibleEntries = filteredEntries;

  const addEntry = (entry) => {
    const newEntry = { ...entry, id: crypto.randomUUID(), comments: entry.comments || [] };
    setEntries((prev) => [newEntry, ...prev]);
    return newEntry;
  };

  const updateEntry = (id, updates) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const addComment = (entryId, comment) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? {
              ...e,
              comments: [
                ...(e.comments || []),
                {
                  id: crypto.randomUUID(),
                  text: comment.text,
                  author: comment.author,
                  role: comment.role,
                  date: new Date().toISOString().split('T')[0],
                },
              ],
            }
          : e
      )
    );
  };

  return (
    <DataContext.Provider
      value={{
        entries: visibleEntries,
        allEntries: entries,
        role,
        setRole,
        currentUser,
        filter,
        setFilter,
        clearFilter,
        loading,                // ← exposed
        addEntry,
        updateEntry,
        addComment,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);