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
} from 'lucide-react';
import { INDICATORS, SERVICE_OPTIONS } from '../constants';
import StepperInput from './StepperInput';

export default function ChatAssistant({ onFillForm, onOpenForm }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState(null); // null | 'manual'
  const [step, setStep] = useState(0);     // 0 = choose mode, 1‑6 for manual
  const [uploadMessage, setUploadMessage] = useState(false);

  // Form state (manual)
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

  // ---------- Manual wizard helpers ----------
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
    onFillForm({
      indicator,
      male,
      female,
      ...ages,
      services,
      reportingMonth,
    });
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={handleClose}></div>

          <div className="relative z-10 w-full max-w-md glass-card rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/20 bg-white/40 backdrop-blur">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-800">Form Assistant</h3>
              </div>
              <button onClick={handleClose} className="p-1 rounded-lg hover:bg-white/50 text-slate-400">
                <X size={18} />
              </button>
            </div>

            {/* Progress dots (only for manual) */}
            {mode === 'manual' && step > 0 && step < 6 && (
              <div className="flex justify-center gap-1.5 px-5 py-3 bg-white/20">
                {['Indicator', 'Gender', 'Age', 'Services', 'Month'].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i + 1 <= step ? 'bg-indigo-500 w-6' : 'bg-slate-300 w-4'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Step content */}
            <div className="px-5 py-4 max-h-[65vh] overflow-y-auto">
              {/* ── Start screen: choose mode ── */}
              {step === 0 && !mode && (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-slate-700">
                    How would you like to create this entry?
                  </p>

                  <button
                    onClick={() => { setMode('manual'); setStep(1); }}
                    className="w-full flex items-center gap-3 rounded-xl border border-slate-200 bg-white/60 backdrop-blur px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white transition"
                  >
                    <FileText size={18} className="text-indigo-500" />
                    Fill manually
                  </button>

                  <button
                    onClick={() => setUploadMessage(true)}
                    className="w-full flex items-center gap-3 rounded-xl border border-slate-200 bg-white/60 backdrop-blur px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white transition"
                  >
                    <Upload size={18} className="text-indigo-500" />
                    Upload a file (PDF or image)
                  </button>

                  {/* ML coming soon notice */}
                  {uploadMessage && (
                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-center">
                      <Sparkles size={20} className="text-amber-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-amber-800">
                        ML‑powered document reading coming soon
                      </p>
                      <p className="text-xs text-amber-600 mt-1">
                        A future update will automatically extract data from your
                        PDFs and handwritten notes — saving you even more time.
                      </p>
                      <button
                        onClick={() => setUploadMessage(false)}
                        className="mt-3 text-xs text-amber-700 underline hover:text-amber-900"
                      >
                        Continue with manual entry
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── Manual wizard: step 1 – Indicator ── */}
              {mode === 'manual' && step === 1 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    Which indicator are you reporting on?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {INDICATORS.map((ind) => (
                      <button
                        key={ind}
                        onClick={() => setIndicator(ind)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                          indicator === ind
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white/60 text-slate-700 border border-slate-200 hover:bg-white'
                        }`}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Manual wizard: step 2 – Gender ── */}
              {mode === 'manual' && step === 2 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    How many males and females?
                  </p>
                  <div className="flex gap-6 justify-center">
                    <div className="text-center">
                      <p className="text-xs text-slate-500 mb-2">Males</p>
                      <StepperInput value={male} onChange={setMale} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 mb-2">Females</p>
                      <StepperInput value={female} onChange={setFemale} />
                    </div>
                  </div>
                  {totalParticipants > 0 && (
                    <p className="mt-3 text-xs text-slate-500 text-center">
                      Total: {totalParticipants}
                    </p>
                  )}
                </div>
              )}

              {/* ── Manual wizard: step 3 – Age groups ── */}
              {mode === 'manual' && step === 3 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    Age breakdown (total must be {totalParticipants})
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ['0-18 yrs', 'age0_18'],
                      ['19-35 yrs', 'age19_35'],
                      ['36-59 yrs', 'age36_59'],
                      ['60+ yrs', 'age60plus'],
                    ].map(([label, key]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between bg-white/50 rounded-xl px-3 py-2"
                      >
                        <span className="text-xs text-slate-600">{label}</span>
                        <StepperInput
                          value={ages[key]}
                          onChange={(val) =>
                            setAges((prev) => ({ ...prev, [key]: val }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-slate-500 text-center">
                    Age total: {ageTotal} / {totalParticipants}
                    {ageTotal === totalParticipants && totalParticipants > 0 && (
                      <span className="ml-1 text-emerald-500 inline-flex items-center gap-1">
                        <Check size={12} /> Match
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* ── Manual wizard: step 4 – Services ── */}
              {mode === 'manual' && step === 4 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    Which services were provided?
                  </p>
                  <div className="space-y-2">
                    {SERVICE_OPTIONS.map((svc) => {
                      const selected = services[svc] > 0;
                      return (
                        <div
                          key={svc}
                          className={`flex items-center justify-between rounded-xl border px-3 py-2 ${
                            selected
                              ? 'border-indigo-300 bg-indigo-50'
                              : 'border-slate-200 bg-white/50'
                          }`}
                        >
                          <button
                            onClick={() => handleServiceToggle(svc)}
                            className={`text-xs font-medium ${
                              selected ? 'text-indigo-700' : 'text-slate-600'
                            }`}
                          >
                            {svc}
                          </button>
                          {selected && (
                            <StepperInput
                              value={services[svc]}
                              onChange={(val) =>
                                setServices((prev) => ({ ...prev, [svc]: val }))
                              }
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Manual wizard: step 5 – Month ── */}
              {mode === 'manual' && step === 5 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    Reporting month
                  </p>
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                    value={reportingMonth}
                    onChange={(e) => setReportingMonth(e.target.value)}
                  >
                    {[
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December',
                    ].map((m) => (
                      <option key={m}>{m} 2026</option>
                    ))}
                  </select>
                </div>
              )}

              {/* ── Step 6 – Review (manual only) ── */}
              {mode === 'manual' && step === 6 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    Review your entry
                  </p>
                  <dl className="text-xs space-y-1.5">
                    <div className="flex">
                      <dt className="w-1/3 text-slate-500">Indicator:</dt>
                      <dd className="text-slate-800 font-medium">{indicator}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-1/3 text-slate-500">Males:</dt>
                      <dd>{male}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-1/3 text-slate-500">Females:</dt>
                      <dd>{female}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-1/3 text-slate-500">Ages:</dt>
                      <dd>{`${ages.age0_18} | ${ages.age19_35} | ${ages.age36_59} | ${ages.age60plus}`}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-1/3 text-slate-500">Services:</dt>
                      <dd>
                        {Object.entries(services)
                          .filter(([, v]) => v > 0)
                          .map(([k, v]) => `${k} (${v})`)
                          .join(', ') || 'None'}
                      </dd>
                    </div>
                    <div className="flex">
                      <dt className="w-1/3 text-slate-500">Month:</dt>
                      <dd>{reportingMonth}</dd>
                    </div>
                  </dl>
                  <button
                    onClick={handleFillForm}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700 transition-all"
                  >
                    <Sparkles size={14} /> Fill form with this data
                  </button>
                </div>
              )}
            </div>

            {/* Navigation (only for manual steps 1‑5) */}
            {mode === 'manual' && step > 0 && step < 6 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-white/20 bg-white/30">
                <button
                  onClick={handleBack}
                  disabled={step === 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white/60 px-3 py-1.5 text-xs font-medium text-slate-600 disabled:opacity-30"
                >
                  <ChevronLeft size={14} /> Back
                </button>
                <span className="text-xs text-slate-400">
                  Step {step} of 5
                </span>
                <button
                  onClick={handleNext}
                  disabled={!canGoNext()}
                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white disabled:opacity-40 hover:bg-indigo-700"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}