import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'eme_data';

// Initial demo entries
const initialEntries = [
  {
    id: 'e1',
    date: '2026-05-08',
    indicator: 'Number of Reported Cases of Child Abuse',
    addedBy: 'Velile Sean',
    role: 'Social Info Officer',
    location: 'Prieska Siya-Themba',
    status: 'captured', // captured | pending | inprogress
    genderMale: 1,
    genderFemale: 2,
    age0_18: 1,
    age19_35: 1,
    age36_59: 1,
    age60plus: 0,
    services: { mediation: 1, counselling: 0, enrichment: 1, preparation: 0 },
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
    services: { mediation: 20, counselling: 12, enrichment: 5, preparation: 8 },
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

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
      value={{ entries, addEntry, updateEntry, addComment }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);