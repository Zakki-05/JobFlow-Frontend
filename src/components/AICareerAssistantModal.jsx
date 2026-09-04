import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, RefreshCw, ChevronRight, HelpCircle } from 'lucide-react';
import { sendAICareerAssistantMessage } from '../services/api';

const QUICK_PROMPTS = [
  "How can I prepare for technical interviews?",
  "What skills am I missing for senior backend roles?",
  "Improve my software engineering resume summary.",
  "What projects should I build to boost my ATS score?"
];

const AICareerAssistantModal = ({ isOpen, onClose, jobContext = null }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: jobContext 
        ? `Hello! I am your JobFlow AI Assistant. I see you're looking at **${jobContext.title}** at **${jobContext.company}**. How can I help you prepare or tailor your application?`
        : "Hello! I am **JobFlow AI Assistant**. Ask me anything about resume optimization, technical interview prep, or career strategies!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend = null) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg = { sender: 'user', text: query };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await sendAICareerAssistantMessage(
        updatedMessages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', content: m.text })),
        jobContext
      );
      setMessages(prev => [
        ...prev,
        { sender: 'assistant', text: response.data?.reply || "I'm ready to assist with your job search!" }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'assistant', text: "Sorry, I had trouble reaching the AI service. Please check your backend connection." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg h-full glass-panel border-l border-slate-800 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                JobFlow AI Career Assistant
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Live AI
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Contextual interview prep & resume coaching</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/10'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800/80 shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>JobFlow AI is analyzing and generating suggestions...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-6 py-2 border-t border-slate-800/60 bg-slate-950/40">
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-2 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" /> Quick Assistant Prompts
          </p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-950/80 text-slate-300 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-colors text-left truncate max-w-xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI Career Assistant..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:opacity-90 disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AICareerAssistantModal;
