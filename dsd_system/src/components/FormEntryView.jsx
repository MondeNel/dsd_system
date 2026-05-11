import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { INDICATORS, SERVICE_OPTIONS } from '../constants';
import {
  Building,
  Users,
  PieChart,
  ListChecks,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const STEP_LABELS = ['Service details', 'Participant breakdown', 'Review & submit'];

export default function FormEntryView({ entry, onBack, onDirty, prefillData }) {
  const { addEntry, updateEntry } = useData();
  const isEditing = !!entry;

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState(() => {
    const defaultForm = {
      servicePoint: 'Prieska Siya-Themba Service Point',
      reportingMonth: 'April 2026',
      indicator: '',
      male: 0,
      female: 0,
      age0_18: 0,
      age19_35: 0,
      age36_59: 0,
      age60plus: 0,
      services: Object.fromEntries(SERVICE_OPTIONS.map((s) => [s, 0])),
      status: 'inprogress',
      date: new Date().toISOString().split('T')[0],
      addedBy: 'Velile Sean',
      role: 'Social Info Officer',
      location: 'Prieska Siya-Themba',
    };
    if (entry) {
      return {
        ...defaultForm,
        servicePoint: entry.location,
        reportingMonth: entry.reportingMonth || 'April 2026',
        indicator: entry.indicator,
        male: entry.genderMale ?? 0,
        female: entry.genderFemale ?? 0,
        age0_18: entry.age0_18 ?? 0,
        age19_35: entry.age19_35 ?? 0,
        age36_59: entry.age36_59 ?? 0,
        age60plus: entry.age60plus ?? 0,
        services: { ...defaultForm.services, ...(entry.services || {}) },
        status: entry.status,
        date: entry.date,
      };
    }
    return defaultForm;
  });

  // Notify parent when form becomes dirty
  const update = (field, value) => {
    onDirty?.();
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // FIX: toggle service — was always setting to 0
  const toggleService = (name) => {
    onDirty?.();
    const current = form.services[name] || 0;
    update('services', {
      ...form.services,
      [name]: current > 0 ? 0 : 1,
    });
  };

  const totalParticipants =
    parseInt(form.male, 10) + parseInt(form.female, 10);
  const ageTotal =
    parseInt(form.age0_18, 10) +
    parseInt(form.age19_35, 10) +
    parseInt(form.age36_59, 10) +
    parseInt(form.age60plus, 10);

  const validateStep1 = () => {
    const errs = {};
    if (!form.indicator.trim()) errs.indicator = 'Please select an indicator';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (parseInt(form.male, 10) < 0) errs.male = 'Cannot be negative';
    if (parseInt(form.female, 10) < 0) errs.female = 'Cannot be negative';
    if (totalParticipants === 0) {
      errs.male = 'At least one participant required';
    }
    if (ageTotal !== totalParticipants) {
      errs.ageTotal = `Age groups total (${ageTotal}) must equal males + females (${totalParticipants})`;
    }
    const serviceCount = Object.values(form.services).filter((v) => v > 0).length;
    if (serviceCount === 0) {
      errs.services = 'Select at least one service and set a quantity';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const saveDraft = () => {
    const draft = {
      indicator: form.indicator,
      date: form.date,
      addedBy: form.addedBy,
      role: form.role,
      location: form.servicePoint,
      reportingMonth: form.reportingMonth,
      status: 'inprogress',
      genderMale: parseInt(form.male, 10),
      genderFemale: parseInt(form.female, 10),
      age0_18: parseInt(form.age0_18, 10),
      age19_35: parseInt(form.age19_35, 10),
      age36_59: parseInt(form.age36_59, 10),
      age60plus: parseInt(form.age60plus, 10),
      services: { ...form.services },
      comments: entry?.comments || [],
    };
    if (isEditing) updateEntry(entry.id, draft);
    else addEntry(draft);
  };

  const handleSubmit = () => {
    if (!validateStep2()) return;
    const finalData = {
      indicator: form.indicator,
      date: form.date,
      addedBy: form.addedBy,
      role: form.role,
      location: form.servicePoint,
      reportingMonth: form.reportingMonth,
      status: 'captured',
      genderMale: parseInt(form.male, 10),
      genderFemale: parseInt(form.female, 10),
      age0_18: parseInt(form.age0_18, 10),
      age19_35: parseInt(form.age19_35, 10),
      age36_59: parseInt(form.age36_59, 10),
      age60plus: parseInt(form.age60plus, 10),
      services: { ...form.services },
      comments: entry?.comments || [],
    };
    if (isEditing) updateEntry(entry.id, finalData);
    else addEntry(finalData);
    setSubmitted(true);
  };

  const progressWidth = `${(step / 3) * 100}%`;
  

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle size={28} className="text-emerald-700" />
        </div>
        <h3 className="mb-1 text-base font-medium text-gray-800">Form submitted</h3>
        <p className="mb-6 text-sm text-gray-500">
          Your entry has been captured successfully.
        </p>
        <button
          onClick={onBack}
          className="rounded-md bg-emerald-700 px-5 py-2 text-sm text-white hover:bg-emerald-800"
        >
          Back to Form Capture
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Step {step} of 3 — {STEP_LABELS[step - 1]}
          </p>
          <p className="text-xs text-gray-400">All changes saved automatically</p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-300"
            style={{ width: progressWidth }}
          />
        </div>
        {/* Step indicators */}
        <div className="mt-2 flex justify-between">
          {STEP_LABELS.map((label, i) => (
            <span
              key={label}
              className={`text-[11px] ${
                i + 1 === step
                  ? 'font-medium text-emerald-700'
                  : i + 1 < step
                  ? 'text-gray-400'
                  : 'text-gray-300'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Step 1: Service details ── */}
      {step === 1 && (
        <div className="rounded-lg border bg-white p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-800">
            <Building size={16} className="text-emerald-700" />
            Service details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="text-xs font-medium text-gray-600">
              Service point
              <select
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                value={form.servicePoint}
                onChange={(e) => update('servicePoint', e.target.value)}
              >
                <option>Prieska Siya-Themba Service Point</option>
              </select>
            </label>
            <label className="text-xs font-medium text-gray-600">
              Reporting month
              <select
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                value={form.reportingMonth}
                onChange={(e) => update('reportingMonth', e.target.value)}
              >
                {['January','February','March','April','May','June',
                  'July','August','September','October','November','December'].map((m) => (
                  <option key={m}>{m} 2026</option>
                ))}
              </select>
            </label>
            <label className="col-span-2 text-xs font-medium text-gray-600">
              Indicator
              <select
                className={`mt-1 w-full rounded border px-3 py-2 text-sm focus:outline-none ${
                  errors.indicator
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-300 focus:border-emerald-500'
                }`}
                value={form.indicator}
                onChange={(e) => update('indicator', e.target.value)}
              >
                <option value="">Select indicator...</option>
                {INDICATORS.map((ind) => (
                  <option key={ind}>{ind}</option>
                ))}
              </select>
              {errors.indicator && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle size={12} />
                  {errors.indicator}
                </p>
              )}
            </label>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => { if (validateStep1()) setStep(2); }}
              className="inline-flex items-center gap-1.5 rounded bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800"
            >
              Next <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Participant breakdown ── */}
      {step === 2 && (
        <>
          {/* Gender */}
          <div className="mb-4 rounded-lg border bg-white p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-800">
              <Users size={16} className="text-emerald-700" />
              Gender breakdown
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Number of males', 'male'],
                ['Number of females', 'female'],
              ].map(([label, key]) => (
                <label key={key} className="text-xs font-medium text-gray-600">
                  {label}
                  <input
                    type="number"
                    min="0"
                    value={form[key]}
                    onChange={(e) => update(key, e.target.value)}
                    className={`mt-1 w-full rounded border px-3 py-2 text-sm focus:outline-none ${
                      errors[key]
                        ? 'border-red-400 focus:border-red-400'
                        : 'border-gray-300 focus:border-emerald-500'
                    }`}
                  />
                  {errors[key] && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle size={12} /> {errors[key]}
                    </p>
                  )}
                </label>
              ))}
            </div>
            {totalParticipants > 0 && (
              <p className="mt-3 text-xs text-gray-400">
                Total participants: <span className="font-medium text-gray-600">{totalParticipants}</span>
              </p>
            )}
          </div>

          {/* Age groups */}
          <div className="mb-4 rounded-lg border bg-white p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-800">
              <PieChart size={16} className="text-emerald-700" />
              Age groups
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                ['0 – 18 yrs', 'age0_18'],
                ['19 – 35 yrs', 'age19_35'],
                ['36 – 59 yrs', 'age36_59'],
                ['60+ yrs', 'age60plus'],
              ].map(([label, key]) => (
                <div
                  key={key}
                  className={`rounded border p-3 text-center ${
                    errors.ageTotal ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <p className="mb-1 text-[11px] text-gray-500">{label}</p>
                  <input
                    type="number"
                    min="0"
                    value={form[key]}
                    onChange={(e) => update(key, e.target.value)}
                    className="w-full bg-transparent text-center text-lg font-medium text-gray-800 outline-none"
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[11px] text-gray-400">
                Age total: <span className={`font-medium ${ageTotal === totalParticipants ? 'text-emerald-600' : 'text-red-500'}`}>{ageTotal}</span>
                {' / '}expected: <span className="font-medium text-gray-600">{totalParticipants}</span>
              </p>
              {ageTotal === totalParticipants && totalParticipants > 0 && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-600">
                  <CheckCircle size={11} /> Totals match
                </span>
              )}
            </div>
            {errors.ageTotal && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle size={12} /> {errors.ageTotal}
              </p>
            )}
          </div>

          {/* Services */}
          <div className="mb-6 rounded-lg border bg-white p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-800">
              <ListChecks size={16} className="text-emerald-700" />
              Services rendered
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {SERVICE_OPTIONS.map((svc) => {
                const count = form.services[svc] || 0;
                const selected = count > 0;
                return (
                  <div
                    key={svc}
                    onClick={() => toggleService(svc)}
                    className={`flex cursor-pointer items-center justify-between rounded border px-3 py-2.5 transition-colors ${
                      selected
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        selected ? 'font-medium text-emerald-700' : 'text-gray-700'
                      }`}
                    >
                      {svc}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={count}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        onDirty?.();
                        update('services', {
                          ...form.services,
                          [svc]: parseInt(e.target.value, 10) || 0,
                        });
                      }}
                      className="w-12 rounded border border-gray-300 px-1 py-0.5 text-center text-sm focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                );
              })}
            </div>
            {errors.services && (
              <p className="mt-3 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle size={12} /> {errors.services}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => { saveDraft(); setStep(1); }}
              className="inline-flex items-center gap-1.5 rounded border px-4 py-2 text-sm hover:bg-gray-50"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              onClick={() => { if (validateStep2()) setStep(3); }}
              className="inline-flex items-center gap-1.5 rounded bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800"
            >
              Next: Review & submit <ArrowRight size={14} />
            </button>
          </div>
        </>
      )}

      {/* ── Step 3: Review ── */}
      {step === 3 && (
        <div className="rounded-lg border bg-white p-5">
          <h3 className="mb-5 text-sm font-medium text-gray-800">Review your entry</h3>
          <dl className="divide-y divide-gray-100 text-sm">
            {[
              ['Service point', form.servicePoint],
              ['Reporting month', form.reportingMonth],
              ['Indicator', form.indicator],
              ['Males', form.male],
              ['Females', form.female],
              ['Age 0–18', form.age0_18],
              ['Age 19–35', form.age19_35],
              ['Age 36–59', form.age36_59],
              ['Age 60+', form.age60plus],
              [
                'Services',
                Object.entries(form.services)
                  .filter(([, v]) => v > 0)
                  .map(([k, v]) => `${k} (${v})`)
                  .join(', ') || 'None selected',
              ],
            ].map(([label, value]) => (
              <div key={label} className="flex py-2.5">
                <dt className="w-1/3 text-gray-500">{label}</dt>
                <dd className="flex-1 text-gray-800">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 rounded border px-4 py-2 text-sm hover:bg-gray-50"
            >
              <ArrowLeft size={14} /> Edit
            </button>
            <button
              onClick={handleSubmit}
              className="rounded bg-emerald-700 px-6 py-2 text-sm text-white hover:bg-emerald-800"
            >
              Submit form
            </button>
          </div>
        </div>
      )}
    </div>
  );
}