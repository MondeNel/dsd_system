import { useState } from 'react';
import {
  MessageCircle,
  X,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
  FileText,
  ClipboardList,
} from 'lucide-react';
import { INDICATORS, SERVICE_OPTIONS } from '../constants';
import StepperInput from './StepperInput';

export default function ChatAssistant({ onFillForm, onOpenForm }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [step, setStep] = useState(0);
  const [uploadMessage, setUploadMessage] = useState(false);

  const [indicator, setIndicator] = useState('');
  const [male, setMale] = useState(0);
  const [female, setFemale] = useState(0);
  const [ages, setAges] = useState({ age0_18: 0, age19_35: 0, age36_59: 0, age60plus: 0 });
  const [services, setServices] = useState(
    Object.fromEntries(SERVICE_OPTIONS.map((s) => [s, 0]))
  );
  const [reportingMonth, setReportingMonth] = useState('April 2026');

  // Reset everything
  const reset = () => {
    setMode(null);
    setStep(0);
    setUploadMessage(false);
    setIndicator('');
    setMale(0);
    setFemale(0);
    setAges({ age0_18: 0, age19_35: 0, age36_59: 0, age60plus: 0 });
    setServices(Object.fromEntries(SERVICE_OPTIONS.map((s) => [s, 0])));
    setReportingMonth('April 2026');
  };

  const handleOpen = () => { reset(); setIsOpen(true); };
  const handleClose = () => { setIsOpen(false); reset(); };

  const totalParticipants = male + female;
  const ageTotal = Object.values(ages).reduce((a, b) => a + b, 0);

  const handleNext = () => {
    if (step === 1 && !indicator) return;
    if (step === 2 && totalParticipants === 0) return;
    if (step === 3 && ageTotal !== totalParticipants) return;
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleFillForm = () => {
    onFillForm({ indicator, male, female, ...ages, services, reportingMonth });
    onOpenForm();
    handleClose();
  };

  const handleServiceToggle = (name) => {
    setServices((prev) => ({ ...prev, [name]: prev[name] > 0 ? 0 : 1 }));
  };

  const canGoNext = () => {
    if (step === 1) return !!indicator;
    if (step === 2) return totalParticipants > 0;
    if (step === 3) return ageTotal === totalParticipants;
    return true;
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-105 transition-all"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          {/* Darker backdrop with blur */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>

          {/* Solid modal, flex column to keep footer visible */}
          <div className="relative z-10 w-full max-w-xl sm:max-w-2xl mx-auto rounded-2xl shadow-2xl overflow-hidden
            bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
            max-h-[90vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <Sparkles size={20} className="text-indigo-600" />
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Form Assistant</h3>
              </div>
              <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
                <X size={20} />
              </button>
            </div>

            {/* Progress dots – always show all 5 with labels */}
            {mode === 'manual' && step > 0 && step < 6 && (
              <div className="flex justify-center gap-2 px-6 py-3 bg-slate-50 dark:bg-slate-900/50">
                {['Indicator', 'Gender', 'Age', 'Services', 'Month'].map((label, i) => (
                  <div
                    key={label}
                    className={`h-2 rounded-full transition-all ${
                      i + 1 <= step
                        ? 'bg-indigo-500 w-8'
                        : 'bg-slate-300 dark:bg-slate-600 w-5'
                    }`}
                    title={label}
                  />
                ))}
              </div>
            )}

            {/* Flexible content area */}
            <div className="flex-1 px-6 py-5 overflow-y-auto space-y-5">
              {/* ── Start screen ── */}
              {step === 0 && !mode && (
                <div className="space-y-5">
                  <p className="text-base font-medium text-slate-700 dark:text-slate-200">How would you like to create this entry?</p>
                  <button
                    onClick={() => { setMode('manual'); setStep(1); }}
                    className="w-full flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-5 py-4 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition"
                  >
                    <FileText size={20} className="text-indigo-500" /> Fill manually
                  </button>
                  <button
                    onClick={() => setUploadMessage(true)}
                    className="w-full flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-5 py-4 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition"
                  >
                    <Upload size={20} className="text-indigo-500" /> Upload a file (PDF or image)
                  </button>
                  {uploadMessage && (
                    <div className="rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 p-5 text-center">
                      <Sparkles size={22} className="text-amber-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200">ML‑powered document reading coming soon</p>
                      <p className="text-xs text-amber-600 dark:text-amber-300 mt-2">
                        A future update will automatically extract data from your PDFs and handwritten notes — saving you even more time.
                      </p>
                      <button
                        onClick={() => setUploadMessage(false)}
                        className="mt-3 text-xs text-amber-700 dark:text-amber-400 underline hover:text-amber-900 dark:hover:text-amber-300"
                      >
                        Continue with manual entry
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 1 – Indicator */}
              {mode === 'manual' && step === 1 && (
                <div>
                  <p className="text-base font-medium text-slate-700 dark:text-slate-200 mb-4">Which indicator are you reporting on?</p>
                  <div className="flex flex-wrap gap-3">
                    {INDICATORS.map((ind) => (
                      <button
                        key={ind}
                        onClick={() => setIndicator(ind)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition ${
                          indicator === ind ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                        }`}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 – Gender */}
              {mode === 'manual' && step === 2 && (
                <div>
                  <p className="text-base font-medium text-slate-700 dark:text-slate-200 mb-4">How many males and females?</p>
                  <div className="flex gap-8 justify-center flex-wrap">
                    <div className="text-center">
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Males</p>
                      <StepperInput value={male} onChange={setMale} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Females</p>
                      <StepperInput value={female} onChange={setFemale} />
                    </div>
                  </div>
                  {totalParticipants > 0 && (
                    <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 text-center">Total: {totalParticipants}</p>
                  )}
                </div>
              )}

              {/* Step 3 – Age groups */}
              {mode === 'manual' && step === 3 && (
                <div>
                  <p className="text-base font-medium text-slate-700 dark:text-slate-200 mb-4">Age breakdown (total must be {totalParticipants})</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      ['0-18 yrs', 'age0_18'],
                      ['19-35 yrs', 'age19_35'],
                      ['36-59 yrs', 'age36_59'],
                      ['60+ yrs', 'age60plus'],
                    ].map(([label, key]) => (
                      <div key={key} className="flex items-center justify-between bg-white dark:bg-slate-700 rounded-xl px-4 py-3">
                        <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
                        <StepperInput value={ages[key]} onChange={(val) => setAges((prev) => ({ ...prev, [key]: val }))} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-slate-500 dark:text-slate-400 text-center">
                    Age total: {ageTotal} / {totalParticipants}
                    {ageTotal === totalParticipants && totalParticipants > 0 && (
                      <span className="ml-2 text-emerald-500 dark:text-emerald-400 inline-flex items-center gap-1"><Check size={14} /> Match</span>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4 – Services */}
              {/* Step 4 – Services */}
{mode === 'manual' && step === 4 && (
  <div>
    <p className="text-base font-medium text-slate-700 dark:text-slate-200 mb-4">
      Which services were provided?
    </p>
    <div className="space-y-3">
      {SERVICE_OPTIONS.map((svc) => {
        const selected = services[svc] > 0;
        return (
          <div
            key={svc}
            onClick={() => handleServiceToggle(svc)}
            className={`flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer transition ${
              selected
                ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600'
            }`}
          >
            <span
              className={`text-sm font-medium ${
                selected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {svc}
            </span>
            {selected && (
              <div onClick={(e) => e.stopPropagation()}>
                <StepperInput
                  value={services[svc]}
                  onChange={(val) =>
                    setServices((prev) => ({ ...prev, [svc]: val }))
                  }
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}

              {/* Step 5 – Month */}
              {mode === 'manual' && step === 5 && (
                <div>
                  <p className="text-base font-medium text-slate-700 dark:text-slate-200 mb-4">Reporting month</p>
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                    value={reportingMonth}
                    onChange={(e) => setReportingMonth(e.target.value)}
                  >
                    {['January','February','March','April','May','June',
                      'July','August','September','October','November','December'].map((m) => (
                      <option key={m}>{m} 2026</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Step 6 – Detailed Review */}
              {mode === 'manual' && step === 6 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <ClipboardList size={20} />
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Complete Entry Report</h3>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Here is a summary of all the information you have entered. Please review carefully before filling the form.
                  </p>

                  <div className="rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur p-5 divide-y divide-slate-200/50 dark:divide-slate-700/50 space-y-4">
                    <div>
                      <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Indicator</span>
                      <p className="text-base font-medium text-slate-800 dark:text-slate-100">{indicator}</p>
                    </div>

                    <div className="pt-4">
                      <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Participants</span>
                      <div className="flex gap-8 mt-2">
                        <div>
                          <span className="text-sm text-slate-500 dark:text-slate-400">Males</span>
                          <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{male}</p>
                        </div>
                        <div>
                          <span className="text-sm text-slate-500 dark:text-slate-400">Females</span>
                          <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{female}</p>
                        </div>
                        <div>
                          <span className="text-sm text-slate-500 dark:text-slate-400">Total</span>
                          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{totalParticipants}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Age Distribution</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                        {[
                          ['0-18 yrs', ages.age0_18],
                          ['19-35 yrs', ages.age19_35],
                          ['36-59 yrs', ages.age36_59],
                          ['60+ yrs', ages.age60plus],
                        ].map(([label, val]) => (
                          <div key={label} className="text-center">
                            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                            <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{val}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Services Provided</span>
                      {Object.entries(services).filter(([, v]) => v > 0).length > 0 ? (
                        <ul className="mt-2 space-y-1">
                          {Object.entries(services)
                            .filter(([, v]) => v > 0)
                            .map(([name, count]) => (
                              <li key={name} className="flex justify-between text-sm">
                                <span className="text-slate-700 dark:text-slate-300">{name}</span>
                                <span className="font-medium text-slate-800 dark:text-slate-100">{count}</span>
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-slate-400 dark:text-slate-500">No services selected</p>
                      )}
                    </div>

                    <div className="pt-4 flex justify-between">
                      <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Reporting Period</span>
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{reportingMonth}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleFillForm}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-base font-medium text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700 transition-all"
                  >
                    <Sparkles size={18} /> Fill form with this data
                  </button>
                </div>
              )}
            </div>

            {/* Navigation footer – stays visible thanks to flex column */}
            {mode === 'manual' && step > 0 && step < 6 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <button onClick={handleBack} disabled={step === 1}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-200 disabled:opacity-30">
                  <ChevronLeft size={16} /> Back
                </button>
                <span className="text-sm text-slate-400 dark:text-slate-500">Step {step} of 5</span>
                <button onClick={handleNext} disabled={!canGoNext()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-40 hover:bg-indigo-700">
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}