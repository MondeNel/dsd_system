import { useState } from 'react';
import { MessageCircle, Send, X, Sparkles } from 'lucide-react';
import { parseRequest } from '../utils/chatParser';
import { INDICATORS } from '../constants';

export default function ChatAssistant({ onFillForm, onOpenForm }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    const parsed = parseRequest(input);
    const botMsg = {
      sender: 'bot',
      text: generateResponseText(parsed),
      parsed,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
  };

  const handleFillForm = (parsed) => {
    onFillForm(parsed);
    onOpenForm();
    setIsOpen(false);
    setMessages([]);
  };

  const generateResponseText = (parsed) => {
    if (!parsed.indicator) {
      return `I didn't detect a known indicator. Please try again with one of: ${INDICATORS.join(', ')}.`;
    }
    return `I found:
• Indicator: ${parsed.indicator}
• Males: ${parsed.male}
• Females: ${parsed.female}
• Age groups: 0-18: ${parsed.age0_18}, 19-35: ${parsed.age19_35}, 36-59: ${parsed.age36_59}, 60+: ${parsed.age60plus}
• Reporting month: ${parsed.reportingMonth}
${
  Object.entries(parsed.services).some(([, v]) => v > 0)
    ? `• Services: ${Object.entries(parsed.services).filter(([, v]) => v > 0).map(([k, v]) => `${k} (${v})`).join(', ')}`
    : ''
}`.trim();
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-105 transition-all"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-h-[500px] glass-card rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/20 bg-white/40 backdrop-blur">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-600" />
              <h3 className="text-sm font-semibold text-slate-800">Form Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/50 text-slate-400"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[300px]">
            {messages.length === 0 && (
              <p className="text-xs text-slate-400 text-center pt-6">
                Describe the entry you want to create.<br />
                e.g., "5 males, 3 females for Family Preservation Mediation"
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.sender === 'user' && (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-xl bg-indigo-600 text-white px-3 py-2 text-sm">
                      {msg.text}
                    </div>
                  </div>
                )}
                {msg.sender === 'bot' && (
                  <div className="flex flex-col items-start">
                    <div className="max-w-[85%] rounded-xl bg-white/80 text-slate-800 px-3 py-2 text-sm whitespace-pre-line">
                      {msg.text}
                    </div>
                    {msg.parsed?.indicator && (
                      <button
                        onClick={() => handleFillForm(msg.parsed)}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-white bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                      >
                        <Sparkles size={12} /> Fill form with this
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-white/20 p-3 bg-white/30 backdrop-blur flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder='e.g., "4 males, 3 females, Family Preservation..."'
              className="flex-1 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="rounded-xl bg-indigo-600 text-white p-2 hover:bg-indigo-700 disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}