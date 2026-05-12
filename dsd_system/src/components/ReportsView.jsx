import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Download } from 'lucide-react';

export default function ReportsView() {
  const { entries } = useData();

  // ---------- Aggregations (unchanged logic) ----------
  const indicatorSummary = useMemo(() => {
    const map = {};
    entries.forEach((e) => {
      if (!map[e.indicator]) {
        map[e.indicator] = { total: 0, captured: 0, pending: 0, inprogress: 0 };
      }
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
      if (!months[month]) {
        months[month] = { month, total: 0, male: 0, female: 0, count: 0 };
      }
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

  // ---------- CSV Export (unchanged) ----------
  const exportCSV = () => {
    const headers = [
      'Indicator', 'Date', 'Status', 'Service Point',
      'Male', 'Female', '0-18', '19-35', '36-59', '60+',
    ].join(',');

    const rows = entries.map((e) =>
      [
        `"${e.indicator}"`, e.date, e.status, `"${e.location}"`,
        e.genderMale || 0, e.genderFemale || 0,
        e.age0_18 || 0, e.age19_35 || 0, e.age36_59 || 0, e.age60plus || 0,
      ].join(',')
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-200 uppercase tracking-wider">Reports</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Aggregated data from {entries.length} entries
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_0_18px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Indicator Summary Table */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
          <div className="h-5 w-0.5 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Indicator‑wise Summary
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/40 text-[10px] font-semibold uppercase text-slate-400 tracking-wide">
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
                <tr
                  key={row.indicator}
                  className="border-t border-slate-800 hover:bg-slate-800/20 transition"
                >
                  <td className="px-5 py-2.5 text-sm font-medium text-slate-200">{row.indicator}</td>
                  <td className="px-5 py-2.5 text-center text-sm font-bold text-emerald-400">{row.total}</td>
                  <td className="px-5 py-2.5 text-center">
                    <span className="inline-block rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                      {row.captured}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-center">
                    <span className="inline-block rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-medium text-amber-400">
                      {row.pending}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-center">
                    <span className="inline-block rounded-full bg-sky-500/15 px-2.5 py-0.5 text-[11px] font-medium text-sky-400">
                      {row.inprogress}
                    </span>
                  </td>
                </tr>
              ))}
              {indicatorSummary.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-xs text-slate-600 italic">
                    No entries to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Trend Table */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
          <div className="h-5 w-0.5 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Monthly Trend</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/40 text-[10px] font-semibold uppercase text-slate-400 tracking-wide">
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
                <tr
                  key={row.month}
                  className="border-t border-slate-800 hover:bg-slate-800/20 transition"
                >
                  <td className="px-5 py-2.5 text-sm font-mono text-slate-200">{row.month}</td>
                  <td className="px-5 py-2.5 text-center text-sm font-bold text-indigo-400">{row.count}</td>
                  <td className="px-5 py-2.5 text-center text-sm font-medium text-slate-200">{row.total}</td>
                  <td className="px-5 py-2.5 text-center text-sm text-slate-400">{row.male}</td>
                  <td className="px-5 py-2.5 text-center text-sm text-slate-400">{row.female}</td>
                </tr>
              ))}
              {monthlyTrend.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-xs text-slate-600 italic">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Age Group Totals */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-0.5 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Age Group Totals (All Entries)
          </h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ['0–18 yrs', ageTotals.age0_18],
            ['19–35 yrs', ageTotals.age19_35],
            ['36–59 yrs', ageTotals.age36_59],
            ['60+ yrs', ageTotals.age60plus],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl bg-slate-800/50 border border-slate-700/30 p-4 text-center"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {label}
              </p>
              <p className="mt-2 text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}