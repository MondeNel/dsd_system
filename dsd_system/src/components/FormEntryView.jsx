import { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  Building,
  Users,
  PieChart,
  ListChecks,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

const SERVICE_OPTIONS = [
  'Mediation service',
  'Marriage counselling',
  'Marriage enrichment',
  'Marriage preparation',
];

export default function FormEntryView({ entry, onBack }) {
  const { addEntry, updateEntry } = useData();
  const isEditing = !!entry;

  const [step, setStep] = useState(isEditing ? 2 : 1);
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
        male: entry.genderMale || 0,
        female: entry.genderFemale || 0,
        age0_18: entry.age0_18 || 0,
        age19_35: entry.age19_35 || 0,
        age36_59: entry.age36_59 || 0,
        age60plus: entry.age60plus || 0,
        services: { ...defaultForm.services, ...(entry.services || {}) },
        status: entry.status,
        date: entry.date,
      };
    }
    return defaultForm;
  });

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const toggleService = (name) => {
    const current = form.services[name] || 0;
    update('services', { ...form.services, [name]: current > 0 ? 0 : 0 });
  };

  const totalParticipants = parseInt(form.male, 10) + parseInt(form.female, 10);
  const ageTotal =
    parseInt(form.age0_18, 10) +
    parseInt(form.age19_35, 10) +
    parseInt(form.age36_59, 10) +
    parseInt(form.age60plus, 10);
  const ageMismatch = ageTotal !== totalParticipants;

  const handleSubmit = () => {
    const finalData = {
      date: form.date,
      indicator: form.indicator,
      addedBy: form.addedBy,
      role: form.role,
      location: form.servicePoint,
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
    if (isEditing) {
      updateEntry(entry.id, finalData);
    } else {
      addEntry(finalData);
    }
    onBack();
  };

  const saveProgress = () => {
    const draft = {
      ...form,
      status: 'inprogress',
      genderMale: parseInt(form.male, 10),
      genderFemale: parseInt(form.female, 10),
      age0_18: parseInt(form.age0_18, 10),
      age19_35: parseInt(form.age19_35, 10),
      age36_59: parseInt(form.age36_59, 10),
      age60plus: parseInt(form.age60plus, 10),
    };
    if (isEditing) {
      updateEntry(entry.id, draft);
    } else {
      addEntry(draft);
    }
  };

  const progressWidth = step === 1 ? '33%' : step === 2 ? '66%' : '100%';

  return (
    <div className="mx-auto max-w-3xl">
      <p className="mb-2 text-xs text-gray-500">
        Step {step} of 3 —{' '}
        {step === 1
          ? 'Service details'
          : step === 2
          ? 'Participant breakdown'
          : 'Review & submit'}
      </p>
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-emerald-600 transition-all duration-300"
          style={{ width: progressWidth }}
        ></div>
      </div>

      {step === 1 && (
        <div className="rounded-lg border bg-white p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-800">
            <Building size={16} className="text-emerald-700" /> Service details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="text-xs font-medium text-gray-600">
              Service point
              <select
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500"
                value={form.servicePoint}
                onChange={(e) => update('servicePoint', e.target.value)}
              >
                <option>Prieska Siya-Themba Service Point</option>
              </select>
            </label>
            <label className="text-xs font-medium text-gray-600">
              Reporting month
              <select
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                value={form.reportingMonth}
                onChange={(e) => update('reportingMonth', e.target.value)}
              >
                <option>April 2026</option>
              </select>
            </label>
            <label className="col-span-2 text-xs font-medium text-gray-600">
              Indicator
              <select
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                value={form.indicator}
                onChange={(e) => update('indicator', e.target.value)}
              >
                <option value="">Select indicator...</option>
                <option>Family members in Family Preservation Services</option>
                <option>Children with valid foster care orders</option>
                <option>Number of Reported Cases of Child Abuse</option>
                <option>Parenting programme participants</option>
              </select>
            </label>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 rounded bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800"
            >
              Next
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <>
          <div className="mb-4 rounded-lg border bg-white p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-800">
              <Users size={16} className="text-emerald-700" /> Gender breakdown
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="text-xs font-medium text-gray-600">
                Number of males
                <input
                  type="number"
                  min="0"
                  value={form.male}
                  onChange={(e) => update('male', e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs font-medium text-gray-600">
                Number of females
                <input
                  type="number"
                  min="0"
                  value={form.female}
                  onChange={(e) => update('female', e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                />
              </label>
            </div>
          </div>

          <div className="mb-4 rounded-lg border bg-white p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-800">
              <PieChart size={16} className="text-emerald-700" /> Age groups
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                ['0 – 18 yrs', 'age0_18'],
                ['19 – 35 yrs', 'age19_35'],
                ['36 – 59 yrs', 'age36_59'],
                ['60+ yrs', 'age60plus'],
              ].map(([label, key]) => (
                <div key={key} className="rounded border bg-gray-50 p-3 text-center">
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
            {ageMismatch && (
              <p className="mt-3 text-xs text-red-500">
                Total age groups ({ageTotal}) must equal total males+females (
                {totalParticipants}).
              </p>
            )}
          </div>

          <div className="mb-6 rounded-lg border bg-white p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-800">
              <ListChecks size={16} className="text-emerald-700" /> Services rendered
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {SERVICE_OPTIONS.map((svc) => {
                const selected = (form.services[svc] || 0) > 0;
                return (
                  <div
                    key={svc}
                    onClick={() => toggleService(svc)}
                    className={`flex cursor-pointer items-center justify-between rounded border px-3 py-2 ${
                      selected
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        selected
                          ? 'font-medium text-emerald-700'
                          : 'text-gray-700'
                      }`}
                    >
                      {svc}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={form.services[svc] || 0}
                      onChange={(e) =>
                        update('services', {
                          ...form.services,
                          [svc]: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-12 rounded border border-gray-300 px-1 py-0.5 text-center text-sm"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                saveProgress();
                setStep(1);
              }}
              className="inline-flex items-center gap-1.5 rounded border px-4 py-2 text-sm hover:bg-gray-50"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <p className="text-xs text-gray-400">All changes saved automatically</p>
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1.5 rounded bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800"
            >
              Next: Review & submit <ArrowRight size={14} />
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <div className="rounded-lg border bg-white p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-800">Review your entry</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex">
              <dt className="w-1/3 text-gray-500">Service Point:</dt>
              <dd>{form.servicePoint}</dd>
            </div>
            <div className="flex">
              <dt className="w-1/3 text-gray-500">Month:</dt>
              <dd>{form.reportingMonth}</dd>
            </div>
            <div className="flex">
              <dt className="w-1/3 text-gray-500">Indicator:</dt>
              <dd>{form.indicator}</dd>
            </div>
            <div className="flex">
              <dt className="w-1/3 text-gray-500">Males:</dt>
              <dd>{form.male}</dd>
            </div>
            <div className="flex">
              <dt className="w-1/3 text-gray-500">Females:</dt>
              <dd>{form.female}</dd>
            </div>
            <div className="flex">
              <dt className="w-1/3 text-gray-500">Age groups:</dt>
              <dd>
                {form.age0_18} | {form.age19_35} | {form.age36_59} | {form.age60plus}
              </dd>
            </div>
            <div className="flex">
              <dt className="w-1/3 text-gray-500">Services:</dt>
              <dd>
                {Object.entries(form.services)
                  .filter(([_, v]) => v > 0)
                  .map(([k, v]) => `${k} (${v})`)
                  .join(', ') || 'None'}
              </dd>
            </div>
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