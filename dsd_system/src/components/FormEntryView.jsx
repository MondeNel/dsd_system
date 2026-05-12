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
  X,
} from 'lucide-react';
import StepperInput from './StepperInput';

const STEP_LABELS = ['Service details', 'Participant breakdown', 'Review & submit'];

export default function FormEntryView({ entry, onBack, onDirty, prefillData, startStep }) {
  const { addEntry, updateEntry } = useData();
  const isEditing = !!entry;

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const [step, setStep] = useState(() => {
    if (startStep) return startStep;
    if (entry) return 2;
    return 1;
  });

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

  useEffect(() => {
    if (prefillData && !isEditing) {
      setForm((prev) => ({
        ...prev,
        indicator: prefillData.indicator || prev.indicator,
        male: prefillData.male ?? prev.male,
        female: prefillData.female ?? prev.female,
        age0_18: prefillData.age0_18 ?? prev.age0_18,
        age19_35: prefillData.age19_35 ?? prev.age19_35,
        age36_59: prefillData.age36_59 ?? prev.age36_59,
        age60plus: prefillData.age60plus ?? prev.age60plus,
        services: { ...prev.services, ...(prefillData.services || {}) },
        reportingMonth: prefillData.reportingMonth || prev.reportingMonth,
      }));
    }
  }, [prefillData, isEditing]);

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

  const toggleService = (name) => {
    onDirty?.();
    const current = form.services[name] || 0;
    update('services', { ...form.services, [name]: current > 0 ? 0 : 1 });
  };

  const totalParticipants = parseInt(form.male, 10) + parseInt(form.female, 10);
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
    if (totalParticipants === 0) errs.male = 'At least one participant required';
    if (ageTotal !== totalParticipants) {
      errs.ageTotal = `Age groups total (${ageTotal}) must equal males + females (${totalParticipants})`;
    }
    const serviceCount = Object.values(form.services).filter((v) => v > 0).length;
    if (serviceCount === 0) errs.services = 'Select at least one service and set a quantity';
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
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
          <CheckCircle size={34} className="text-white" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-100">Form submitted</h3>
        <p className="mb-8 text-sm text-slate-400">Your entry has been captured successfully.</p>
        <button
          onClick={onBack}
          className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_0_18px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all"
        >
          Back to Form Capture
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Close button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={onBack}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition"
          title="Close form"
        >
          <X size={18} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-4 sm:p-5 mb-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Step {step} of 3 — {STEP_LABELS[step - 1]}
          </p>
          <p className="text-xs text-slate-600">All changes saved automatically</p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700/50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-500"
            style={{ width: progressWidth }}
          />
        </div>
        <div className="mt-3 flex justify-between">
          {STEP_LABELS.map((label, i) => (
            <span
              key={label}
              className={`text-[11px] font-medium uppercase tracking-wider transition-colors ${
                i + 1 === step
                  ? 'text-emerald-400'
                  : i + 1 < step
                  ? 'text-slate-500'
                  : 'text-slate-700'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Step 1: Service details */}
      {step === 1 && (
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-4 sm:p-6">
          <h3 className="mb-5 flex items-center gap-2 text-sm font-bold text-slate-200 uppercase tracking-wider">
            <div className="rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 p-1.5 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              <Building size={16} className="text-white" />
            </div>
            Service details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Service point
              <select
                className="mt-1 w-full rounded-xl border border-slate-700/50 bg-slate-800/70 px-3 py-2.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={form.servicePoint}
                onChange={(e) => update('servicePoint', e.target.value)}
              >
                <option>Prieska Siya-Themba Service Point</option>
              </select>
            </label>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Reporting month
              <select
                className="mt-1 w-full rounded-xl border border-slate-700/50 bg-slate-800/70 px-3 py-2.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={form.reportingMonth}
                onChange={(e) => update('reportingMonth', e.target.value)}
              >
                {['January','February','March','April','May','June',
                  'July','August','September','October','November','December'].map((m) => (
                  <option key={m}>{m} 2026</option>
                ))}
              </select>
            </label>
            <label className="col-span-1 sm:col-span-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Indicator
              <select
                className={`mt-1 w-full rounded-xl border bg-slate-800/70 px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 ${
                  errors.indicator
                    ? 'border-red-500/50 focus:border-red-400 focus:ring-red-500/20'
                    : 'border-slate-700/50 focus:border-emerald-500 focus:ring-emerald-500/20'
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
                <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                  <AlertCircle size={12} /> {errors.indicator}
                </p>
              )}
            </label>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => { if (validateStep1()) setStep(2); }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_0_18px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all"
            >
              Next <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Participant breakdown */}
      {step === 2 && (
        <>
          {/* Gender */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-4 sm:p-6 mb-4">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-200 uppercase tracking-wider">
              <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 p-1.5 shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                <Users size={16} className="text-white" />
              </div>
              Gender breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                ['Number of males', 'male'],
                ['Number of females', 'female'],
              ].map(([label, key]) => (
                <label key={key} className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {label}
                  <div className="mt-1">
                    <StepperInput
                      value={parseInt(form[key], 10) || 0}
                      onChange={(newVal) => update(key, newVal)}
                    />
                  </div>
                  {errors[key] && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                      <AlertCircle size={12} /> {errors[key]}
                    </p>
                  )}
                </label>
              ))}
            </div>
            {totalParticipants > 0 && (
              <p className="mt-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Total participants: <span className="text-slate-200 font-bold">{totalParticipants}</span>
              </p>
            )}
          </div>

          {/* Age groups */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-4 sm:p-6 mb-4">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-200 uppercase tracking-wider">
              <div className="rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 p-1.5 shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                <PieChart size={16} className="text-white" />
              </div>
              Age groups
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {[
                ['0 – 18 yrs', 'age0_18'],
                ['19 – 35 yrs', 'age19_35'],
                ['36 – 59 yrs', 'age36_59'],
                ['60+ yrs', 'age60plus'],
              ].map(([label, key]) => (
                <div key={key} className="bg-slate-800/50 rounded-xl border border-slate-700/30 p-3 text-center">
                  <p className="mb-2 text-[11px] font-medium text-slate-400">{label}</p>
                  <StepperInput
                    value={parseInt(form[key], 10) || 0}
                    onChange={(newVal) => update(key, newVal)}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Age total:{' '}
                <span className={`font-bold ${ageTotal === totalParticipants ? 'text-emerald-400' : 'text-red-400'}`}>
                  {ageTotal}
                </span>{' '}
                / expected: <span className="font-bold text-slate-300">{totalParticipants}</span>
              </p>
              {ageTotal === totalParticipants && totalParticipants > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <CheckCircle size={12} /> Totals match
                </span>
              )}
            </div>
            {errors.ageTotal && (
              <p className="mt-2 flex items-center gap-1 text-xs text-red-400">
                <AlertCircle size={12} /> {errors.ageTotal}
              </p>
            )}
          </div>

          {/* Services */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-4 sm:p-6 mb-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-200 uppercase tracking-wider">
              <div className="rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 p-1.5 shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                <ListChecks size={16} className="text-white" />
              </div>
              Services rendered
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {SERVICE_OPTIONS.map((svc) => {
                const count = form.services[svc] || 0;
                const selected = count > 0;
                return (
                  <div
                    key={svc}
                    onClick={() => toggleService(svc)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                      selected
                        ? 'border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                        : 'border-slate-700/30 bg-slate-800/40 hover:border-slate-600/50 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className={`text-sm font-semibold uppercase tracking-wider ${selected ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {svc}
                    </span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <StepperInput
                        value={count}
                        onChange={(newVal) => {
                          onDirty?.();
                          update('services', { ...form.services, [svc]: newVal });
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.services && (
              <p className="mt-3 flex items-center gap-1 text-xs text-red-400">
                <AlertCircle size={12} /> {errors.services}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => { saveDraft(); setStep(1); }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/40 bg-slate-800/50 px-4 py-2.5 text-sm font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 hover:border-slate-600/50 transition"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              onClick={() => { if (validateStep2()) setStep(3); }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_0_18px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all"
            >
              Next: Review & submit <ArrowRight size={14} />
            </button>
          </div>
        </>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-4 sm:p-6">
          <h3 className="mb-5 text-sm font-bold text-slate-200 uppercase tracking-wider">Review your entry</h3>
          <dl className="divide-y divide-slate-800/50 text-sm">
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
              <div key={label} className="flex py-3">
                <dt className="w-1/3 font-semibold uppercase tracking-wider text-slate-500 text-xs">{label}</dt>
                <dd className="flex-1 font-medium text-slate-200">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/40 bg-slate-800/50 px-4 py-2.5 text-sm font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 hover:border-slate-600/50 transition"
            >
              <ArrowLeft size={14} /> Edit
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_0_18px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all"
            >
              Submit form
            </button>
          </div>
        </div>
      )}
    </div>
  );
}