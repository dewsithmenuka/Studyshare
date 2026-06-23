import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

export default function AiAnalyzer({ auth }) {
    const { theme } = useTheme();
    const dark = theme === 'dark';
    const [resources, setResources] = useState([]);
    const [selectedResource, setSelectedResource] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('summary');
    const [activeSection, setActiveSection] = useState('analyzer');
    const [inputMode, setInputMode] = useState('library');
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef(null);

    const [docChatMessages, setDocChatMessages] = useState([]);
    const [docChatInput, setDocChatInput] = useState('');
    const [docChatLoading, setDocChatLoading] = useState(false);
    const docChatEndRef = useRef(null);

    const [chatMessages, setChatMessages] = useState([
        { role: 'assistant', content: "Hi! I'm StudyBot 🤖 I can help you understand concepts, explain topics, answer academic questions, and give study tips. What would you like to learn about?" }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        fetch('/student/ai-analyzer/resources', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'same-origin',
        })
        .then(res => res.json())
        .then(data => setResources(data))
        .catch(() => {});
    }, []);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);
    useEffect(() => { docChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [docChatMessages]);

    const getCSRF = () => {
        const token = document.head.querySelector('meta[name="csrf-token"]');
        return token ? token.content : '';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') { setUploadedFile(file); setError(''); }
        else setError('Only PDF files are supported for analysis.');
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') { setUploadedFile(file); setError(''); }
        else setError('Only PDF files are supported.');
    };

    const isLargeFile = uploadedFile && uploadedFile.size > 1024 * 1024;

    const handleAnalyze = async () => {
        if (inputMode === 'library' && !selectedResource) return;
        if (inputMode === 'upload' && !uploadedFile) return;
        setAnalyzing(true);
        setError('');
        setResult(null);
        setDocChatMessages([]);

        try {
            let res;
            if (inputMode === 'library') {
                res = await fetch('/student/ai-analyzer/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': getCSRF(), 'X-Requested-With': 'XMLHttpRequest' },
                    credentials: 'same-origin',
                    body: JSON.stringify({ resource_id: selectedResource }),
                });
            } else {
                const formData = new FormData();
                formData.append('file', uploadedFile);
                res = await fetch('/student/ai-analyzer/analyze-file', {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': getCSRF(), 'X-Requested-With': 'XMLHttpRequest' },
                    credentials: 'same-origin',
                    body: formData,
                });
            }

            const data = await res.json();
            if (data.error || !data.resource) {
                setError(data.error || 'Analysis failed. Please try again.');
            } else {
                setResult(data);
                setActiveTab('summary');
                setDocChatMessages([{ role: 'assistant', content: 'I have read your document! Ask me anything about it — I can explain concepts, clarify points, or answer specific questions.' }]);
            }
        } catch (e) {
            setError('Something went wrong. Please try again.');
        }
        setAnalyzing(false);
    };

    const handleDocChat = async (e) => {
        e.preventDefault();
        if (!docChatInput.trim() || docChatLoading) return;
        const userMessage = docChatInput.trim();
        setDocChatInput('');
        setDocChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setDocChatLoading(true);
        try {
            const history = docChatMessages.map(m => ({ role: m.role, content: m.content }));
            const res = await fetch('/student/ai-analyzer/chat-document', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': getCSRF(), 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'same-origin',
                body: JSON.stringify({ message: userMessage, history, resource_id: inputMode === 'library' ? selectedResource : null }),
            });
            const data = await res.json();
            setDocChatMessages(prev => [...prev, { role: 'assistant', content: data.error ? 'Sorry, I encountered an error. Please try again.' : data.reply }]);
        } catch (e) {
            setDocChatMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
        }
        setDocChatLoading(false);
    };

    const handleSendChat = async (e) => {
        e.preventDefault();
        if (!chatInput.trim() || chatLoading) return;
        const userMessage = chatInput.trim();
        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setChatLoading(true);
        try {
            const history = chatMessages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));
            const res = await fetch('/student/ai-analyzer/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': getCSRF(), 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'same-origin',
                body: JSON.stringify({ message: userMessage, history }),
            });
            const data = await res.json();
            setChatMessages(prev => [...prev, { role: 'assistant', content: data.error ? 'Sorry, I encountered an error.' : data.reply }]);
        } catch (e) {
            setChatMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
        }
        setChatLoading(false);
    };

    // Style tokens aligned with the neo-brutalist theme structure
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const inputBg = dark ? 'bg-[#121110] border-[#2e2a24] text-white' : 'bg-[#fcf8f2] border-[#1a1a1a] text-black';
    const textMuted = dark ? 'text-stone-400' : 'text-stone-600';
    const textHeader = dark ? 'text-white' : 'text-black';

    const sectionTabClass = (section) => 
        'flex-1 sm:flex-none px-5 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider border-2 border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none ' + 
        (activeSection === section ? 'bg-red-400 text-black' : (dark ? 'bg-stone-800 text-stone-400' : 'bg-white text-stone-700'));

    const modeTabClass = (mode) =>
        'px-4 py-2 rounded-xl text-xs font-bold uppercase border-2 border-black tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 ' +
        (inputMode === mode ? 'bg-emerald-400 text-black' : (dark ? 'bg-stone-800 text-stone-400' : 'bg-white text-stone-600'));

    const tabClass = (tab) => 
        'px-3 sm:px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-black transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] ' + 
        (activeTab === tab ? 'bg-blue-400 text-black' : (dark ? 'bg-stone-800 text-stone-400' : 'bg-white text-stone-600'));

    return (
        <MainLayout auth={auth}>
            <Head title="AI Study Assistant" />
            <div className="mb-6 font-sans-custom">
                <h1 className={`font-unique-bold text-4xl uppercase tracking-tight ${textHeader}`}>🤖 AI Study Assistant</h1>
                <p className={`text-xs font-bold uppercase tracking-widest ${textMuted} mt-1`}>✦ Intelligent document parsing environment</p>
            </div>

            <div className="flex gap-2 sm:gap-3 mb-6 font-sans-custom">
                <button onClick={() => setActiveSection('analyzer')} className={sectionTabClass('analyzer')}>📄 PDF Analyzer</button>
                <button onClick={() => setActiveSection('chat')} className={sectionTabClass('chat')}>💬 StudyBot Chat</button>
            </div>

            {activeSection === 'analyzer' && (
                <div className="font-sans-custom">
                    <div className={`border-2 border-b-[8px] border-black rounded-3xl p-5 sm:p-6 mb-6 ${cardBg}`}>
                        <h2 className={`font-unique-bold text-xl uppercase tracking-wide mb-4 ${textHeader}`}>Select PDF to Analyze</h2>
                        <div className="flex gap-2 mb-4">
                            <button onClick={() => { setInputMode('library'); setUploadedFile(null); setError(''); }} className={modeTabClass('library')}>
                                📚 From Library
                            </button>
                            <button onClick={() => { setInputMode('upload'); setSelectedResource(''); setError(''); }} className={modeTabClass('upload')}>
                                📤 Upload PDF
                            </button>
                        </div>

                        {inputMode === 'library' && (
                            <select 
                                value={selectedResource} 
                                onChange={e => setSelectedResource(e.target.value)} 
                                className={`w-full border-2 border-black rounded-xl px-3 py-2.5 font-bold text-sm focus:outline-none focus:ring-0 mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${inputBg}`}
                            >
                                <option value="" className="font-bold">Choose a PDF from your library...</option>
                                {resources.map(r => (<option key={r.id} value={r.id} className="font-bold">{r.title} — {r.subject}</option>))}
                            </select>
                        )}

                        {inputMode === 'upload' && (
                            <div
                                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`mb-4 border-2 border-dashed border-black rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${dragging ? 'bg-blue-100 dark:bg-stone-800' : inputBg}`}
                            >
                                <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileInput} className="hidden" />
                                {uploadedFile ? (
                                    <div>
                                        <p className="text-4xl mb-2">📕</p>
                                        <p className={`font-unique-bold text-sm uppercase tracking-wide ${textHeader}`}>{uploadedFile.name}</p>
                                        <p className={`text-xs font-bold mt-1 uppercase ${textMuted}`}>
                                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB —{' '}
                                            {isLargeFile
                                                ? <span className="text-amber-500 font-black">⚠️ Partial scan active</span>
                                                : <span className="text-emerald-500 font-black">✅ Optimized size</span>
                                            }
                                        </p>
                                        <p className="text-[10px] font-bold uppercase mt-2 text-stone-400">Click payload box to re-browse</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-4xl mb-3">📂</p>
                                        <p className={`font-unique-bold text-base uppercase ${textHeader}`}>Drag and drop your PDF here</p>
                                        <p className={`text-xs font-bold uppercase mt-1 ${textMuted}`}>or click to browse local files</p>
                                        <p className="text-[10px] font-bold uppercase mt-3 text-stone-400 tracking-wider">PDF format • Max 1MB performance recommendation • Transient memory allocation</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {isLargeFile && (
                            <div className="mb-4 p-3 bg-amber-100 dark:bg-amber-900/30 border-2 border-black rounded-xl">
                                <p className="text-black dark:text-amber-200 text-xs font-bold uppercase tracking-wide">⚠️ Large document warning: The assistant will process the entry section. For exhaustive analytics split by chapter elements.</p>
                            </div>
                        )}

                        <button
                            onClick={handleAnalyze}
                            disabled={(inputMode === 'library' && !selectedResource) || (inputMode === 'upload' && !uploadedFile) || analyzing}
                            className="w-full bg-blue-500 text-black hover:opacity-90 border-2 border-black disabled:opacity-50 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                            {analyzing ? (
                                <>
                                    <svg className="animate-spin w-4 h-4 text-black" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                    </svg>
                                    Compiling Parsing Buffers...
                                </>
                            ) : '🤖 Initialize AI Matrix Analysis'}
                        </button>

                        {analyzing && (
                            <div className="mt-4 p-4 rounded-xl border-2 border-black bg-blue-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                        <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                        <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-wide">Document core vectors mapping... process executes within 10-30 cycles.</p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 p-4 bg-red-400 border-2 border-black rounded-xl text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <p className="text-xs font-black uppercase tracking-wide">❌ Operational Fault: {error}</p>
                            </div>
                        )}
                    </div>

                    {result && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                            <div className="flex flex-col gap-4">
                                <div className={`border-2 border-black rounded-2xl p-4 ${cardBg} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                                    <div className={`text-xs font-bold uppercase tracking-wider mb-3 ${textMuted}`}>
                                        Active Instance: <span className={`font-black ${textHeader}`}>{result.resource.title}</span>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {['summary', 'key_points', 'quiz', 'flashcards'].map(tab => (
                                            <button key={tab} onClick={() => setActiveTab(tab)} className={tabClass(tab)}>
                                                {tab === 'summary' && '📝 Summary'}
                                                {tab === 'key_points' && '🎯 Key Points'}
                                                {tab === 'quiz' && '❓ Quiz'}
                                                {tab === 'flashcards' && '🃏 Cards'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {activeTab === 'summary' && (
                                    <div className={`border-2 border-b-[8px] border-black rounded-3xl p-5 ${cardBg}`}>
                                        <h2 className={`font-unique-bold text-lg uppercase tracking-wide mb-3 ${textHeader}`}>📝 Summary Profile</h2>
                                        <p className={`leading-relaxed text-sm font-bold opacity-95 ${dark ? 'text-stone-300' : 'text-stone-800'}`}>{result.analysis.summary}</p>
                                    </div>
                                )}
                                {activeTab === 'key_points' && (
                                    <div className={`border-2 border-b-[8px] border-black rounded-3xl p-5 ${cardBg}`}>
                                        <h2 className={`font-unique-bold text-lg uppercase tracking-wide mb-4 ${textHeader}`}>🎯 Strategic Key Points</h2>
                                        <div className="flex flex-col gap-3">
                                            {result.analysis.key_points.map((point, i) => (
                                                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${inputBg}`}>
                                                    <span className="bg-blue-500 text-black border border-black text-xs w-6 h-6 rounded-lg flex items-center justify-center font-black flex-shrink-0 mt-0.5">{i + 1}</span>
                                                    <p className="text-xs font-bold leading-normal">{point}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'quiz' && (
                                    <div className={`border-2 border-b-[8px] border-black rounded-3xl p-5 ${cardBg}`}>
                                        <h2 className={`font-unique-bold text-lg uppercase tracking-wide mb-4 ${textHeader}`}>❓ Verification Quiz</h2>
                                        <div className="flex flex-col gap-6">
                                            {result.analysis.quiz_questions.map((q, i) => (<QuizQuestion key={i} question={q} index={i} dark={dark} inputBg={inputBg} textHeader={textHeader} />))}
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'flashcards' && (
                                    <div className={`border-2 border-b-[8px] border-black rounded-3xl p-5 ${cardBg}`}>
                                        <h2 className={`font-unique-bold text-lg uppercase tracking-wide mb-4 ${textHeader}`}>🃏 Retention Deck</h2>
                                        <div className="grid grid-cols-1 gap-4">
                                            {result.analysis.flashcards.map((card, i) => (<Flashcard key={i} card={card} dark={dark} inputBg={inputBg} textHeader={textHeader} />))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={`border-2 border-b-[8px] border-black rounded-3xl flex flex-col overflow-hidden ${cardBg}`} style={{height: 'min(600px, 80vh)', minHeight: '450px'}}>
                                <div className={`p-4 border-b-2 border-black ${inputBg}`}>
                                    <h2 className={`font-unique-bold text-base uppercase ${textHeader}`}>💬 Contextual Document Engine</h2>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${textMuted} mt-0.5`}>Isolated prompt space over read vectors</p>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                                    {docChatMessages.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`flex items-start gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                                <div className={`w-8 h-8 rounded-xl border-2 border-black flex items-center justify-center font-black text-xs flex-shrink-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${msg.role === 'user' ? 'bg-blue-400 text-black' : 'bg-purple-400 text-black'}`}>
                                                    {msg.role === 'user' ? auth?.user?.name?.charAt(0).toUpperCase() : '🤖'}
                                                </div>
                                                <div className={`px-3.5 py-2.5 rounded-2xl border-2 border-black font-medium text-xs leading-relaxed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${msg.role === 'user' ? 'bg-blue-300 text-black' : inputBg}`}>
                                                    {msg.content.split('\n').map((line, j) => (<p key={j} className={j > 0 ? 'mt-1' : ''}>{line}</p>))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {docChatLoading && (
                                        <div className="flex justify-start">
                                            <div className="flex items-start gap-2.5">
                                                <div className="w-8 h-8 rounded-xl border-2 border-black bg-purple-400 text-black flex items-center justify-center text-xs font-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">🤖</div>
                                                <div className={`px-4 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${inputBg}`}>
                                                    <div className="flex gap-1 py-1">
                                                        <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                                        <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                                        <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={docChatEndRef} />
                                </div>
                                <div className={`p-3 border-t-2 border-black ${inputBg}`}>
                                    <form onSubmit={handleDocChat} className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={docChatInput} 
                                            onChange={e => setDocChatInput(e.target.value)} 
                                            placeholder="Query active file data structures..." 
                                            className={`flex-1 border-2 border-black rounded-xl px-3 py-2 font-bold text-xs focus:outline-none focus:ring-0 min-w-0 ${inputBg}`} 
                                        />
                                        <button 
                                            type="submit" 
                                            disabled={!docChatInput.trim() || docChatLoading} 
                                            className="bg-purple-400 text-black uppercase font-black tracking-wider border-2 border-black px-4 py-2 rounded-xl text-xs transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none flex-shrink-0"
                                        >
                                            Ask
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeSection === 'chat' && (
                <div className={`font-sans-custom border-2 border-b-[8px] border-black rounded-3xl flex flex-col overflow-hidden ${cardBg}`} style={{height: 'min(600px, 80vh)', minHeight: '450px'}}>
                    <div className={`p-4 border-b-2 border-black flex items-center gap-3.5 ${inputBg}`}>
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 text-black border-2 border-black rounded-xl flex items-center justify-center text-xl font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">🤖</div>
                        <div>
                            <h2 className={`font-unique-bold text-base uppercase tracking-wide ${textHeader}`}>StudyBot Hub</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 animate-pulse">● System Matrix Active</p>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                        {chatMessages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex items-start gap-2.5 max-w-[85%] sm:max-w-xl ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-xl border-2 border-black flex items-center justify-center font-black text-xs flex-shrink-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${msg.role === 'user' ? 'bg-blue-400 text-black' : 'bg-purple-400 text-black'}`}>
                                        {msg.role === 'user' ? auth?.user?.name?.charAt(0).toUpperCase() : '🤖'}
                                    </div>
                                    <div className={`px-4 py-3 rounded-2xl border-2 border-black font-medium text-xs leading-relaxed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${msg.role === 'user' ? 'bg-blue-300 text-black' : inputBg}`}>
                                        {msg.content.split('\n').map((line, j) => (<p key={j} className={j > 0 ? 'mt-1' : ''}>{line}</p>))}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {chatLoading && (
                            <div className="flex justify-start">
                                <div className="flex items-start gap-2.5">
                                    <div className="w-8 h-8 rounded-xl border-2 border-black bg-purple-400 flex items-center justify-center font-black text-xs shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">🤖</div>
                                    <div className={`px-4 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${inputBg}`}>
                                        <div className="flex gap-1 py-1">
                                            <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                            <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                            <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                    <div className={`p-4 border-t-2 border-black ${inputBg}`}>
                        <div className="mb-3 flex flex-wrap gap-2">
                            {['Explain recursion', 'What is OOP?', 'Study tips for exams', 'Explain Big O notation'].map(suggestion => (
                                <button 
                                    key={suggestion} 
                                    onClick={() => setChatInput(suggestion)} 
                                    className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg border-2 border-black transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none ${dark ? 'bg-stone-800 text-stone-300' : 'bg-white text-stone-700'}`}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                        <form onSubmit={handleSendChat} className="flex gap-2">
                            <input 
                                type="text" 
                                value={chatInput} 
                                onChange={e => setChatInput(e.target.value)} 
                                placeholder="Transmit processing query string down link..." 
                                className={`flex-1 border-2 border-black rounded-xl px-4 py-2.5 font-bold text-xs focus:outline-none focus:ring-0 min-w-0 ${inputBg}`} 
                            />
                            <button 
                                type="submit" 
                                disabled={!chatInput.trim() || chatLoading} 
                                className="bg-emerald-400 text-black uppercase font-black tracking-widest border-2 border-black px-5 py-2.5 rounded-xl text-xs transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none flex-shrink-0"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}

function QuizQuestion({ question, index, dark, inputBg, textHeader }) {
    const [selected, setSelected] = useState(null);
    const [revealed, setRevealed] = useState(false);
    return (
        <div className={`p-4 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${inputBg}`}>
            <p className={`font-unique-bold text-sm uppercase tracking-wide mb-3 ${textHeader}`}>Q{index + 1}. {question.question}</p>
            <div className="flex flex-col gap-2 mb-3">
                {question.options.map((option, i) => {
                    let btnColor = dark ? 'bg-stone-800 text-stone-300' : 'bg-white text-stone-800';
                    if (selected === option) btnColor = 'bg-blue-400 text-black font-black';
                    if (revealed) {
                        if (option === question.answer) btnColor = 'bg-emerald-400 text-black font-black';
                        else if (selected === option) btnColor = 'bg-red-400 text-black font-black';
                    }
                    return (
                        <button 
                            key={i} 
                            onClick={() => !revealed && setSelected(option)} 
                            className={`text-left px-3 py-2 border-2 border-black rounded-xl text-xs font-bold transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] ${btnColor}`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
            <div className="flex justify-end">
                <button 
                    disabled={!selected || revealed} 
                    onClick={() => setRevealed(true)} 
                    className="px-4 py-1.5 rounded-lg border-2 border-black font-black text-[10px] uppercase tracking-wider bg-orange-400 text-black disabled:opacity-40 transition shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
                >
                    Submit Vector
                </button>
            </div>
        </div>
    );
}

function Flashcard({ card, dark, inputBg, textHeader }) {
    const [flipped, setFlipped] = useState(false);
    return (
        <div 
            onClick={() => setFlipped(!flipped)} 
            className={`p-4 min-h-[100px] border-2 border-black rounded-2xl cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center text-center transition-all ${flipped ? 'bg-amber-300 text-black' : inputBg}`}
        >
            <span className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">
                {flipped ? '✦ Output Data Structure' : '✦ Core Key Term'}
            </span>
            <p className={`text-xs font-unique-bold uppercase tracking-wide ${flipped ? 'text-black' : textHeader}`}>
                {flipped ? card.answer : card.question}
            </p>
        </div>
    );
}