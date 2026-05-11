import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'eme_data';

// Initial demo entries (some from other service points)
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
    indicator: 'Children with valid foster care orders (Apr 2026)',
    addedBy: 'Therosmea',
    role: 'Social Info Officer',
    location: 'Prieska Siya-Themba',
    status: 'pending',
    genderMale: 0,
    genderFemale: 0,
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
    indicator: 'Family Preservation Mediation Apr 2026',
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
    comments: [],
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
  // Extra entries for other locations (visible to supervisor)
  {
    id: 'e5',
    date: '2026-05-10',
    indicator: 'HIV/AIDS Care & Services — Mar 2026',
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
      try {
        return JSON.parse(stored);
      } catch {
        return initialEntries;
      }
    }
    return initialEntries;
  });

  const [role, setRole] = useState('officer'); // 'officer' or 'supervisor'

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  // Filter entries by role
  const visibleEntries = role === 'officer'
    ? entries.filter(e => e.location === 'Prieska Siya-Themba')
    : entries; // supervisor sees all

  const addEntry = (entry) => {
    const newEntry = { ...entry, id: crypto.randomUUID() };
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
        allEntries: entries, // for reference if needed
        role,
        setRole,
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