import { useState, useRef, useEffect } from 'react';
import {
  MessageCircle, X, Send, Bot, User, Sparkles, ChevronDown,
  Paperclip, FileText, Image as ImageIcon
} from 'lucide-react';
import { INDICATORS, SERVICE_OPTIONS } from '../constants';

const SYSTEM_PROMPT = `You are an EME (Electronic Monitoring & Evaluation) assistant for South Africa's Department of Social Development. Your job is to help social workers fill in monthly data capture forms through conversation.

When a user describes their data in natural language, extract and return a JSON object with these fields (only include fields mentioned):
{
  "indicator": one of ${JSON.stringify(INDICATORS)},
  "reportingMonth": e.g. "April 2026",
  "servicePoint": service point name if mentioned,
  "male": number,
  "female": number,
  "age0_18": number of people aged 0-18,
  "age19_35": number of people aged 19-35,
  "age36_59": number of people aged 36-59,
  "age60plus": number of people aged 60+,
  "services": object where keys are from ${JSON.stringify(SERVICE_OPTIONS)} and values are counts
}

IMPORTANT RULES:
1. Always respond with a friendly conversational message first.
2. At the end of your response, if you extracted any form data, append a JSON block wrapped in <FORM_DATA> and </FORM_DATA> tags.
3. If the total of male+female doesn't match the age group totals, flag this politely.
4. If information is ambiguous or missing, ask a specific follow-up question.
5. Be warm, helpful, and speak plainly — these are busy field workers.
6. Keep responses concise — 2-3 sentences max before the data block.

Example response:
"Got it! I've pulled out the details from what you said. Please review and confirm below.
<FORM_DATA>{"indicator":"Family Preservation Mediation","male":5,"female":8,"age19_35":7,"age36_59":6}</FORM_DATA>"`;

export default function ChatAssistant({ onFillForm, onOpenForm }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      text: "Hi! I'm your EME assistant. Tell me about your data in plain language — like \"I captured 12 family preservation sessions this month, 5 males and 7 females\" — and I'll fill in the form for you.\n\nYou can also upload a handwritten note or PDF, and I'll turn it into real data points to save you time.",
      formData: null,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [file, setFile] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [open, messages]);

  // ---------- file handling ----------
  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]; // strip data:*;base64, prefix
      setFile({
        name: selected.name,
        type: selected.type,
        base64,
        preview: selected.type.startsWith('image/') ? URL.createObjectURL(selected) : null,
      });
    };
    if (selected.type === 'application/pdf') {
      reader.readAsArrayBuffer();
      reader.onloadend = () => {
        const bytes = new Uint8Array(reader.result);
        let binary = '';
        bytes.forEach((b) => (binary += String.fromCharCode(b)));
        const b64 = btoa(binary);
        setFile({
          name: selected.name,
          type: selected.type,
          base64: b64,
          preview: null,
        });
      };
    } else {
      reader.readAsDataURL(selected);
    }
  };

  const clearFile = () => setFile(null);

  // ---------- send message ----------
  const sendMessage = async () => {
    const text = input.trim();
    if ((!text && !file) || loading) return;
    setInput('');

    // build user message content
    const userContent = [];
    if (text) userContent.push({ type: 'text', text });
    if (file) {
      if (file.type.startsWith('image/')) {
        userContent.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: file.type,
            data: file.base64,
          },
        });
      } else if (file.type === 'application/pdf') {
        userContent.push({
          type: 'document',
          source: {
            type: 'base64',
            media_type: 'application/pdf',
            data: file.base64,
          },
        });
      }
    }

    // create user message (display a preview)
    const displayText = text || (file ? `[Uploaded: ${file.name}]` : '');
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: displayText,
      formData: null,
      file: file ? { name: file.name, type: file.type, preview: file.preview } : null,
    };

    const history = [...messages, userMsg];
    setMessages(history);
    setFile(null);
    setLoading(true);

    try {
      const apiMessages = history
        .filter((m) => m.role !== 'system')
        .map((m) => {
          if (m === userMsg) {
            return { role: 'user', content: userContent };
          }
          return { role: m.role, content: m.text };
        });

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });

      const data = await res.json();
      const raw = data.content?.[0]?.text || "Sorry, I couldn't process that. Please try again.";

      const match = raw.match(/<FORM_DATA>([\s\S]*?)<\/FORM_DATA>/);
      let parsed = null;
      let displayText = raw.replace(/<FORM_DATA>[\s\S]*?<\/FORM_DATA>/, '').trim();

      if (match) {
        try {
          parsed = JSON.parse(match[1].trim());
          setExtractedData(parsed);
        } catch {
          // JSON parse failed
        }
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', text: displayText, formData: parsed },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          text: 'Something went wrong connecting to the assistant. Please try again.',
          formData: null,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFillForm = () => {
    if (extractedData) {
      onFillForm(extractedData);
      onOpenForm();
      setOpen(false);
      setExtractedData(null);
      setMessages([
        {
          id: '1',
          role: 'assistant',
          text: "Hi! I'm your EME assistant. Tell me about your data in plain language — like \"I captured 12 family preservation sessions this month, 5 males and 7 females\" — and I'll fill in the form for you.\n\nYou can also upload a handwritten note or PDF, and I'll turn it into real data points to save you time.",
          formData: null,
        },
      ]);
    }
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`fixed bottom-6 right-6 z-50 flex h-13 w-13 items-center justify-center rounded-full shadow-lg transition-all duration-200 ${
          open ? 'bg-gray-700 hover:bg-gray-800' : 'bg-emerald-700 hover:bg-emerald-800'
        }`}
        style={{ height: 52, width: 52 }}
        title="AI Assistant"
      >
        {open ? <X size={20} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 flex w-[360px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-gray-100 bg-emerald-700 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600">
              <Sparkles size={15} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">EME Assistant</p>
              <p className="text-[11px] text-emerald-200">Autofills forms from natural language</p>
            </div>
            <button onClick={() => setOpen(false)}>
              <ChevronDown size={18} className="text-emerald-200 hover:text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex max-h-80 flex-col gap-3 overflow-y-auto p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] ${
                    msg.role === 'user'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {msg.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                </div>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
                  <div
                    className={`rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.file && (
                    <div className="max-w-[200px] rounded-lg border border-gray-200 bg-white p-2">
                      {msg.file.type.startsWith('image/') && msg.file.preview ? (
                        <img
                          src={msg.file.preview}
                          alt="uploaded"
                          className="w-full h-auto rounded"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          {msg.file.type === 'application/pdf' ? (
                            <FileText size={16} className="text-red-500" />
                          ) : (
                            <ImageIcon size={16} className="text-blue-500" />
                          )}
                          <span className="truncate">{msg.file.name}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {msg.formData && (
                    <div className="w-full rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-emerald-700">
                        Extracted data
                      </p>
                      <dl className="space-y-1">
                        {Object.entries(msg.formData).map(([key, val]) => {
                          if (key === 'services') {
                            const active = Object.entries(val).filter(([, v]) => v > 0);
                            if (!active.length) return null;
                            return (
                              <div key={key} className="flex justify-between text-xs">
                                <dt className="text-gray-500">Services</dt>
                                <dd className="text-right text-gray-800">
                                  {active.map(([k, v]) => `${k} (${v})`).join(', ')}
                                </dd>
                              </div>
                            );
                          }
                          const labels = {
                            indicator: 'Indicator',
                            reportingMonth: 'Month',
                            servicePoint: 'Service point',
                            male: 'Males',
                            female: 'Females',
                            age0_18: 'Age 0–18',
                            age19_35: 'Age 19–35',
                            age36_59: 'Age 36–59',
                            age60plus: 'Age 60+',
                          };
                          return (
                            <div key={key} className="flex justify-between gap-2 text-xs">
                              <dt className="text-gray-500">{labels[key] || key}</dt>
                              <dd className="text-right font-medium text-gray-800">
                                {String(val)}
                              </dd>
                            </div>
                          );
                        })}
                      </dl>
                      <button
                        onClick={handleFillForm}
                        className="mt-3 w-full rounded-md bg-emerald-700 py-1.5 text-xs font-medium text-white hover:bg-emerald-800"
                      >
                        Fill form with this data →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <Bot size={13} className="text-gray-600" />
                </div>
                <div className="flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-2">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input & file attachment */}
          <div className="border-t border-gray-100 p-3">
            {file && (
              <div className="mb-2 flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs">
                {file.type.startsWith('image/') ? (
                  <ImageIcon size={14} className="text-blue-500" />
                ) : (
                  <FileText size={14} className="text-red-500" />
                )}
                <span className="flex-1 truncate text-gray-700">{file.name}</span>
                <button onClick={clearFile} className="text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center self-end rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                title="Attach file"
              >
                <Paperclip size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. 'I captured 8 family preservation sessions, 3 male 5 female...'"
                rows={2}
                className="flex-1 resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-200"
              />
              <button
                onClick={sendMessage}
                disabled={(!input.trim() && !file) || loading}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center self-end rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-gray-400">Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      )}
    </>
  );
}