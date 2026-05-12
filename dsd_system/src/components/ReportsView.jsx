import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Download } from 'lucide-react';

export default function ReportsView() {
  const { entries } = useData();

  const indicatorSummary = useMemo(() => {
    const map = {};
    entries.forEach((e) => {
      if (!map[e.indicator]) map[e.indicator] = { total: 0, captured: 0, pending: 0, inprogress: 0 };
      map[e.indicator].total += 1;
      if (e.status === 'captured') map[e.indicator].captured += 1;
      else if (e.status === 'pending') map[e.indicator].pending += 1;
      else if (e.status === 'inprogress') map[e.indicator].inprogress += 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1].total - a[1].total)
      .map(([indicator, stats]) => ({ indicator, ...stats }));
  }, [entries]);

  const monthlyTrend = useMemo(() => {
    const months = {};
    entries.forEach((e) => {
      const month = e.date.substring(0, 7);
      if (!months[month]) months[month] = { month, total: 0, male: 0, female: 0, count: 0 };
      months[month].count += 1;
      months[month].male += e.genderMale || 0;
      months[month].female += e.genderFemale || 0;
      months[month].total += (e.genderMale || 0) + (e.genderFemale || 0);
    });
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  }, [entries]);

  const ageTotals = useMemo(() => {
    const totals = { age0_18: 0, age19_35: 0, age36_59: 0, age60plus: 0 };
    entries.forEach((e) => {
      totals.age0_18 += e.age0_18 || 0;
      totals.age19_35 += e.age19_35 || 0;
      totals.age36_59 += e.age36_59 || 0;
      totals.age60plus += e.age60plus || 0;
    });
    return totals;
  }, [entries]);

  const exportCSV = () => {
    const headers = ['Indicator', 'Date', 'Status', 'Service Point', 'Male', 'Female', '0-18', '19-35', '36-59', '60+'].join(',');
    const rows = entries.map((e) =>
      [`"${e.indicator}"`, e.date, e.status, `"${e.location}"`, e.genderMale || 0, e.genderFemale || 0, e.age0_18 || 0, e.age19_35 || 0, e.age36_59 || 0, e.age60plus || 0].join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eme_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Reports</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Aggregated data from {entries.length} entries</p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="px-5 py-4 border-b border-white/20 dark:border-slate-700/30">
          <h4 className="text-sm font-medium text-slate-800 dark:text-slate-100">Indicator‑wise Summary</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/30 dark:bg-slate-800/30 text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-5 py-2.5 text-left">Indicator</th>
                <th className="px-5 py-2.5 text-center">Total Forms</th>
                <th className="px-5 py-2.5 text-center">Captured</th>
                <th className="px-5 py-2.5 text-center">Pending</th>
                <th className="px-5 py-2.5 text-center">In Progress</th>
              </tr>
            </thead>
            <tbody>
              {indicatorSummary.map((row) => (
                <tr key={row.indicator} className="border-t border-white/20 dark:border-slate-700/30 hover:bg-white/40 dark:hover:bg-slate-700/40">
                  <td className="px-5 py-2.5 text-sm text-slate-800 dark:text-slate-100">{row.indicator}</td>
                  <td className="px-5 py-2.5 text-center text-sm font-medium text-slate-700 dark:text-slate-200">{row.total}</td>
                  <td className="px-5 py-2.5 text-center">
                    <span className="inline-block rounded-full bg-lime-100 dark:bg-lime-900/40 px-2 py-0.5 text-[11px] font-medium text-lime-800 dark:text-lime-300">{row.captured}</span>
                  </td>
                  <td className="px-5 py-2.5 text-center">
                    <span className="inline-block rounded-full bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:text-amber-300">{row.pending}</span>
                  </td>
                  <td className="px-5 py-2.5 text-center">
                    <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 text-[11px] font-medium text-blue-800 dark:text-blue-300">{row.inprogress}</span>
                  </td>
                </tr>
              ))}
              {indicatorSummary.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-sm text-slate-400 dark:text-slate-500">No entries to display.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="px-5 py-4 border-b border-white/20 dark:border-slate-700/30">
          <h4 className="text-sm font-medium text-slate-800 dark:text-slate-100">Monthly Trend</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/30 dark:bg-slate-800/30 text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-5 py-2.5 text-left">Month</th>
                <th className="px-5 py-2.5 text-center">Total Forms</th>
                <th className="px-5 py-2.5 text-center">Total Participants</th>
                <th className="px-5 py-2.5 text-center">Male</th>
                <th className="px-5 py-2.5 text-center">Female</th>
              </tr>
            </thead>
            <tbody>
              {monthlyTrend.map((row) => (
                <tr key={row.month} className="border-t border-white/20 dark:border-slate-700/30 hover:bg-white/40 dark:hover:bg-slate-700/40">
                  <td className="px-5 py-2.5 text-sm text-slate-800 dark:text-slate-100">{row.month}</td>
                  <td className="px-5 py-2.5 text-center text-sm text-slate-700 dark:text-slate-200">{row.count}</td>
                  <td className="px-5 py-2.5 text-center text-sm font-medium text-slate-700 dark:text-slate-200">{row.total}</td>
                  <td className="px-5 py-2.5 text-center text-sm text-slate-700 dark:text-slate-200">{row.male}</td>
                  <td className="px-5 py-2.5 text-center text-sm text-slate-700 dark:text-slate-200">{row.female}</td>
                </tr>
              ))}
              {monthlyTrend.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-sm text-slate-400 dark:text-slate-500">No data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <h4 className="mb-4 text-sm font-medium text-slate-800 dark:text-slate-100">Age Group Totals (All Entries)</h4>
        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            ['0–18 yrs', ageTotals.age0_18],
            ['19–35 yrs', ageTotals.age19_35],
            ['36–59 yrs', ageTotals.age36_59],
            ['60+ yrs', ageTotals.age60plus],
          ].map(([label, value]) => (
            <div key={label} className="rounded border border-slate-200 dark:border-slate-700 bg-white/40 dark:bg-slate-800/40 p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
              <p className="mt-1 text-2xl font-medium text-slate-800 dark:text-slate-100">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}