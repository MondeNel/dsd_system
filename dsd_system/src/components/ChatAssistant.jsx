import { useState, useRef } from 'react';
import {
  MessageCircle,
  X,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
  FileText,
  Loader,
} from 'lucide-react';
import { INDICATORS, SERVICE_OPTIONS } from '../constants';
import StepperInput from './StepperInput';

const STEPS = [
  'Start',
  'Indicator',
  'Gender',
  'Age groups',
  'Services',
  'Month',
  'Review',
];

export default function ChatAssistant({ onFillForm, onOpenForm }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState(null); // null | 'manual' | 'upload'
  const [step, setStep] = useState(0);     // 0 = choose mode, 1‑6 for manual
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Form state (manual & pre‑filled)
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
    setFile(null);
    setProcessing(false);
    setIndicator('');
    setMale(0);
    setFemale(0);
    setAges({ age0_18: 0, age19_35: 0, age36_59: 0, age60plus: 0 });
    setServices(Object.fromEntries(SERVICE_OPTIONS.map((s) => [s, 0])));
    setReportingMonth('April 2026');
  };

  const handleOpen = () => { reset(); setIsOpen(true); };
  const handleClose = () => { setIsOpen(false); reset(); };

  // ---------- File handling ----------
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) processFile(selected);
  };

  const processFile = async (selectedFile) => {
    setFile(selectedFile);
    setProcessing(true);
    // Simulate OCR / PDF parsing delay
    await new Promise((r) => setTimeout(r, 2000));
    // Generate mock extracted data
    const mockData = generateMockData(selectedFile.name);
    setIndicator(mockData.indicator);
    setMale(mockData.male);
    setFemale(mockData.female);
    setAges(mockData.ages);
    setServices(mockData.services);
    setReportingMonth(mockData.reportingMonth);
    setProcessing(false);
    setMode('upload');
    setStep(6); // go straight to review
  };

  // Generate realistic demo data based on file name (for visual effect)
  const generateMockData = (fileName) => {
    const indicators = [...INDICATORS];
    const randomInd = indicators[Math.floor(Math.random() * indicators.length)];
    const m = 10 + Math.floor(Math.random() * 20);
    const f = 10 + Math.floor(Math.random() * 20);
    const total = m + f;
    const a1 = Math.round(total * 0.15);
    const a2 = Math.round(total * 0.45);
    const a3 = Math.round(total * 0.30);
    const a4 = total - a1 - a2 - a3;
    const svcs = {};
    SERVICE_OPTIONS.forEach((s) => {
      svcs[s] = Math.random() > 0.5 ? 1 + Math.floor(Math.random() * 3) : 0;
    });
    return {
      indicator: randomInd,
      male: m,
      female: f,
      ages: { age0_18: a1, age19_35: a2, age36_59: a3, age60plus: a4 },
      services: svcs,
      reportingMonth: 'April 2026',
    };
  };

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
              {step === 0 && !mode && (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-slate-700">How would you like to create this entry?</p>
                  <button
                    onClick={() => { setMode('manual'); setStep(1); }}
                    className="w-full flex items-center gap-3 rounded-xl border border-slate-200 bg-white/60 backdrop-blur px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white transition"
                  >
                    <FileText size={18} className="text-indigo-500" />
                    Fill manually
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center gap-3 rounded-xl border border-slate-200 bg-white/60 backdrop-blur px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white transition"
                  >
                    <Upload size={18} className="text-indigo-500" />
                    Upload a file (PDF or image)
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {/* Processing state */}
                  {processing && (
                    <div className="rounded-xl bg-indigo-50 p-4 text-center">
                      <Loader size={24} className="animate-spin mx-auto text-indigo-500 mb-2" />
                      <p className="text-sm text-indigo-700 font-medium">
                        Analysing {file?.name}…
                      </p>
                      <p className="text-xs text-indigo-400 mt-1">
                        Extracting indicator, numbers, and services
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Manual wizard steps (step 1‑5) */}
              {mode === 'manual' && step === 1 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">Which indicator are you reporting on?</p>
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

              {mode === 'manual' && step === 2 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">How many males and females?</p>
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
                </div>
              )}

              {mode === 'manual' && step === 3 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">Age breakdown (total must be {totalParticipants})</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ['0-18 yrs', 'age0_18'],
                      ['19-35 yrs', 'age19_35'],
                      ['36-59 yrs', 'age36_59'],
                      ['60+ yrs', 'age60plus'],
                    ].map(([label, key]) => (
                      <div key={key} className="flex items-center justify-between bg-white/50 rounded-xl px-3 py-2">
                        <span className="text-xs text-slate-600">{label}</span>
                        <StepperInput
                          value={ages[key]}
                          onChange={(val) => setAges((prev) => ({ ...prev, [key]: val }))}
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

              {mode === 'manual' && step === 4 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">Which services were provided?</p>
                  <div className="space-y-2">
                    {SERVICE_OPTIONS.map((svc) => {
                      const selected = services[svc] > 0;
                      return (
                        <div
                          key={svc}
                          className={`flex items-center justify-between rounded-xl border px-3 py-2 ${
                            selected ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-white/50'
                          }`}
                        >
                          <button
                            onClick={() => handleServiceToggle(svc)}
                            className={`text-xs font-medium ${selected ? 'text-indigo-700' : 'text-slate-600'}`}
                          >
                            {svc}
                          </button>
                          {selected && (
                            <StepperInput
                              value={services[svc]}
                              onChange={(val) => setServices((prev) => ({ ...prev, [svc]: val }))}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {mode === 'manual' && step === 5 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">Reporting month</p>
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
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

              {/* Review step (manual step 6 OR upload result) */}
              {(mode === 'manual' && step === 6) || (mode === 'upload' && step === 6 && !processing) ? (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">Review extracted data</p>
                  {file && (
                    <p className="text-xs text-slate-400 mb-3">
                      From file: {file.name}
                    </p>
                  )}
                  <dl className="text-xs space-y-1.5">
                    <div className="flex"><dt className="w-1/3 text-slate-500">Indicator:</dt><dd className="text-slate-800 font-medium">{indicator}</dd></div>
                    <div className="flex"><dt className="w-1/3 text-slate-500">Males:</dt><dd>{male}</dd></div>
                    <div className="flex"><dt className="w-1/3 text-slate-500">Females:</dt><dd>{female}</dd></div>
                    <div className="flex"><dt className="w-1/3 text-slate-500">Ages:</dt><dd>{`${ages.age0_18} | ${ages.age19_35} | ${ages.age36_59} | ${ages.age60plus}`}</dd></div>
                    <div className="flex"><dt className="w-1/3 text-slate-500">Services:</dt><dd>
                      {Object.entries(services).filter(([,v]) => v>0).map(([k,v]) => `${k} (${v})`).join(', ') || 'None'}
                    </dd></div>
                    <div className="flex"><dt className="w-1/3 text-slate-500">Month:</dt><dd>{reportingMonth}</dd></div>
                  </dl>
                  <button
                    onClick={handleFillForm}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700 transition-all"
                  >
                    <Sparkles size={14} /> Fill form with this data
                  </button>
                </div>
              ) : null}
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