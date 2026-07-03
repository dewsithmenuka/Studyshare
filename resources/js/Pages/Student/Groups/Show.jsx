import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTheme } from '@/hooks/useTheme';
import { useState, useEffect, useRef } from 'react';

export default function Show({ auth, group, members, resources, userRole, availableResources }) {
    const { theme } = useTheme();
    const dark = theme === 'dark';

    const [searchQuery, setSearchQuery]           = useState('');
    const [searchResults, setSearchResults]       = useState([]);
    const [searching, setSearching]               = useState(false);
    const [selectedResource, setSelectedResource] = useState('');
    const [flash, setFlash]                       = useState('');
    const [activeTab, setActiveTab]               = useState('resources');

    const [messages, setMessages]       = useState([]);
    const [chatInput, setChatInput]     = useState('');
    const [sendingChat, setSendingChat] = useState(false);
    const [chatLoading, setChatLoading] = useState(true);
    const chatEndRef = useRef(null);
    const pollRef    = useRef(null);

    const icons = { pdf: '📕', pptx: '📊', docx: '📝' };

    const getCsrf = () =>
        document.head.querySelector('meta[name="csrf-token"]')?.content ?? '';

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/student/groups/${group.id}/messages`, {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'same-origin',
            });
            if (res.ok) setMessages(await res.json());
        } catch (e) {
            console.error('Chat fetch error:', e);
        } finally {
            setChatLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        pollRef.current = setInterval(fetchMessages, 5000);
        return () => clearInterval(pollRef.current);
    }, []);

    useEffect(() => {
        if (activeTab === 'chat') {
            setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }
    }, [messages, activeTab]);

    const handleSendMessage = async () => {
        const trimmed = chatInput.trim();
        if (!trimmed || sendingChat) return;
        setSendingChat(true);
        try {
            await fetch(`/student/groups/${group.id}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrf(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ message: trimmed }),
            });
            setChatInput('');
            await fetchMessages();
        } catch (e) {
            console.error('Send error:', e);
        } finally {
            setSendingChat(false);
        }
    };

    const handleChatKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const showFlash = (msg) => {
        setFlash(msg);
        setTimeout(() => setFlash(''), 3000);
    };

    const handleSearch = async () => {
        if (searchQuery.length < 2) return;
        setSearching(true);
        try {
            const res = await fetch(`/student/groups/${group.id}/members/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrf(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ query: searchQuery }),
            });
            setSearchResults(await res.json());
        } catch (e) { console.error(e); }
        setSearching(false);
    };

    const handleInvite = (userId) => {
        router.post(`/student/groups/${group.id}/members/invite`, { user_id: userId }, {
            onSuccess: () => { setSearchResults([]); setSearchQuery(''); showFlash('Member added!'); },
        });
    };

    const handleShareResource = () => {
        if (!selectedResource) return;
        router.post(`/student/groups/${group.id}/resources`, { resource_id: selectedResource }, {
            onSuccess: () => { setSelectedResource(''); showFlash('Resource shared into cluster!'); },
        });
    };

    const handleLeave   = () => { if (confirm('Sever connection and leave this group segment?')) router.delete(`/student/groups/${group.id}/leave`); };
    const handleDelete  = () => { if (confirm('Purge this group structure? Instruction cannot be inverted.')) router.delete(`/student/groups/${group.id}`); };

    const formatTime = (iso) => {
        if (!iso) return '';
        try { return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
        catch { return ''; }
    };

    const tabs = [
        { key: 'resources', label: 'Resources', emoji: '📚' },
        { key: 'chat',      label: 'Chat',      emoji: '💬' },
        { key: 'members',   label: 'Members',   emoji: '👥' },
    ];

    // Theme Tokens Shared with Components
    const textMuted = dark ? 'text-stone-400' : 'text-stone-600';
    const textHeader = dark ? 'text-white' : 'text-black';

    return (
        <MainLayout auth={auth}>
            <Head title={`Group // ${group.name}`} />

            {flash && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-400 text-black border-2 border-black font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                    ⚡ <span>{flash}</span>
                </div>
            )}

            {/* Header Block */}
            <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4 font-sans-custom">
                <div className="min-w-0">
                    <h1 className={`font-unique-bold text-3xl uppercase tracking-tight truncate ${textHeader}`}>{group.name}</h1>
                    {group.description && (
                        <p className={`mt-1 text-xs font-medium leading-relaxed max-w-2xl line-clamp-2 ${dark ? 'text-stone-300' : 'text-stone-800'}`}>{group.description}</p>
                    )}
                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${textMuted}`}>Cluster Core Node Spawned by {group.created_by}</p>
                </div>
                <div className="flex-shrink-0 self-start sm:self-center">
                    {userRole === 'leader' ? (
                        <button onClick={handleDelete} className="bg-red-400 text-black border-2 border-black text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all">
                            Purge Cluster
                        </button>
                    ) : (
                        <button onClick={handleLeave} className={`border-2 border-black text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all ${dark ? 'bg-stone-800 text-stone-300' : 'bg-white text-black'}`}>
                            Disconnect Node
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Navigation Interface Tabs */}
            <div className={`flex lg:hidden border-2 border-black rounded-xl overflow-hidden mb-6 ${dark ? 'bg-stone-900' : 'bg-white'}`}>
                {tabs.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider flex flex-col items-center gap-1 transition-all ${
                            activeTab === t.key
                                ? 'bg-blue-400 text-black border-r-2 last:border-r-0 border-black'
                                : `bg-transparent border-r-2 last:border-r-0 border-black ${dark ? 'text-stone-400 hover:bg-stone-800' : 'text-stone-600 hover:bg-stone-50'}`
                        }`}
                    >
                        <span className="text-sm drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">{t.emoji}</span>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Layout Allocation Array (Desktop) */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6">
                <div className="flex flex-col gap-6">
                    <MembersPanel dark={dark} members={members} userRole={userRole} searchQuery={searchQuery} setSearchQuery={setSearchQuery} searching={searching} handleSearch={handleSearch} searchResults={searchResults} handleInvite={handleInvite} />
                </div>
                <div className="flex flex-col gap-6">
                    <ResourceSharePanel dark={dark} availableResources={availableResources} selectedResource={selectedResource} setSelectedResource={setSelectedResource} handleShareResource={handleShareResource} />
                    <ResourceListPanel dark={dark} resources={resources} icons={icons} />
                </div>
                <div>
                    <ChatPanel dark={dark} messages={messages} chatLoading={chatLoading} chatInput={chatInput} setChatInput={setChatInput} sendingChat={sendingChat} handleSendMessage={handleSendMessage} handleChatKeyDown={handleChatKeyDown} chatEndRef={chatEndRef} currentUserId={auth.user.id} formatTime={formatTime} desktop />
                </div>
            </div>

            {/* Layout Allocation Array (Mobile) */}
            <div className="lg:hidden">
                {activeTab === 'members' && (
                    <div className="flex flex-col gap-6">
                        <MembersPanel dark={dark} members={members} userRole={userRole} searchQuery={searchQuery} setSearchQuery={setSearchQuery} searching={searching} handleSearch={handleSearch} searchResults={searchResults} handleInvite={handleInvite} />
                    </div>
                )}
                {activeTab === 'resources' && (
                    <div className="flex flex-col gap-6">
                        <ResourceSharePanel dark={dark} availableResources={availableResources} selectedResource={selectedResource} setSelectedResource={setSelectedResource} handleShareResource={handleShareResource} />
                        <ResourceListPanel dark={dark} resources={resources} icons={icons} />
                    </div>
                )}
                {activeTab === 'chat' && (
                    <ChatPanel dark={dark} messages={messages} chatLoading={chatLoading} chatInput={chatInput} setChatInput={setChatInput} sendingChat={sendingChat} handleSendMessage={handleSendMessage} handleChatKeyDown={handleChatKeyDown} chatEndRef={chatEndRef} currentUserId={auth.user.id} formatTime={formatTime} />
                )}
            </div>
        </MainLayout>
    );
}

// ── MembersPanel ──────────────────────────────────────────────────────────────
function MembersPanel({ dark, members, userRole, searchQuery, setSearchQuery, searching, handleSearch, searchResults, handleInvite }) {
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const subCardBg = dark ? 'bg-[#121110] border-[#2e2a24]' : 'bg-[#fcf8f2] border-[#1a1a1a]';
    const textHeader = dark ? 'text-white' : 'text-black';
    
    const card = `border-2 border-b-[8px] border-black rounded-3xl p-5 ${cardBg} font-sans-custom`;
    const input = `flex-1 border-2 border-black rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wide focus:outline-none focus:bg-amber-50/10 min-w-0 ${dark ? 'bg-stone-800 text-white placeholder-stone-500' : 'bg-white text-black placeholder-stone-400'}`;

    return (
        <>
            <div className={card}>
                <h2 className={`font-unique-bold text-sm uppercase tracking-wide mb-4 ${textHeader}`}>Linked Nodes ({members.length})</h2>
                <div className="flex flex-col gap-3">
                    {members.map((member) => (
                        <div key={member.id} className={`flex items-center justify-between p-2 border-2 border-black rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] ${subCardBg}`}>
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 bg-purple-400 border border-black rounded-lg flex items-center justify-center text-black text-xs font-black flex-shrink-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                    {member.name.charAt(0).toUpperCase()}
                                </div>
                                <a href={`/student/members/${member.id}`} className={`text-xs font-bold uppercase tracking-wide hover:text-blue-500 hover:underline transition truncate ${dark ? 'text-stone-200' : 'text-stone-900'}`}>
                                    {member.name}
                                </a>
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-black flex-shrink-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-black ${member.role === 'leader' ? 'bg-amber-400' : 'bg-stone-300'}`}>
                                {member.role}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {userRole === 'leader' && (
                <div className={card}>
                    <h2 className={`font-unique-bold text-sm uppercase tracking-wide mb-4 ${textHeader}`}>Bind New Node</h2>
                    <div className="flex gap-2 mb-3">
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Identity index hash or mail..." className={input} />
                        <button onClick={handleSearch} disabled={searching} className="bg-blue-400 text-black border-2 border-black text-xs font-black uppercase tracking-widest px-3.5 py-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex-shrink-0">
                            {searching ? '...' : 'Query'}
                        </button>
                    </div>
                    {searchResults.length > 0 && (
                        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                            {searchResults.map((user) => (
                                <div key={user.id} className={`flex items-center justify-between rounded-xl border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${subCardBg}`}>
                                    <div className="min-w-0 pr-2">
                                        <p className={`text-xs font-black uppercase tracking-wide truncate ${textHeader}`}>{user.name}</p>
                                        <p className="text-[9px] font-bold text-stone-400 truncate mt-0.5">{user.email}</p>
                                    </div>
                                    <button onClick={() => handleInvite(user.id)} className="bg-emerald-400 text-black border border-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex-shrink-0">Link</button>
                                </div>
                            ))}
                        </div>
                    )}
                    {searchResults.length === 0 && searchQuery.length >= 2 && !searching && (
                        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mt-2">No system entities matched indexing parameters.</p>
                    )}
                </div>
            )}
        </>
    );
}

// ── ResourceSharePanel ────────────────────────────────────────────────────────
function ResourceSharePanel({ dark, availableResources, selectedResource, setSelectedResource, handleShareResource }) {
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const textHeader = dark ? 'text-white' : 'text-black';

    return (
        <div className={`border-2 border-b-[8px] border-black rounded-3xl p-5 ${cardBg} font-sans-custom`}>
            <h2 className={`font-unique-bold text-sm uppercase tracking-wide mb-4 ${textHeader}`}>Mount Source Payload</h2>
            <div className="flex gap-2">
                <select
                    value={selectedResource}
                    onChange={e => setSelectedResource(e.target.value)}
                    className={`flex-1 border-2 border-black rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wide focus:outline-none min-w-0 ${dark ? 'bg-stone-800 text-white' : 'bg-white text-black'}`}
                >
                    <option value="">Select individual asset node...</option>
                    {availableResources.map((r) => (
                        <option key={r.id} value={r.id}>{r.title} // [{r.subject}]</option>
                    ))}
                </select>
                <button onClick={handleShareResource} disabled={!selectedResource} className="bg-blue-400 text-black border-2 border-black text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-40 flex-shrink-0">
                    Mount
                </button>
            </div>
        </div>
    );
}

// ── ResourceListPanel ─────────────────────────────────────────────────────────
function ResourceListPanel({ dark, resources, icons }) {
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const subCardBg = dark ? 'bg-[#121110] border-[#2e2a24]' : 'bg-[#fcf8f2] border-[#1a1a1a]'
    const textHeader = dark ? 'text-white' : 'text-black';

    return (
        <div className={`border-2 border-b-[8px] border-black rounded-3xl p-5 ${cardBg} font-sans-custom`}>
            <h2 className={`font-unique-bold text-sm uppercase tracking-wide mb-4 ${textHeader}`}>Mounted Assets Cluster ({resources.length})</h2>
            {resources.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-4xl mb-2 drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">📭</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400">No collective assets mounted to cluster array yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1">
                    {resources.map((r) => (
                        <div key={r.id} className={`flex items-center justify-between border-2 border-black rounded-2xl p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${subCardBg}`}>
                            <div className="flex items-center gap-3 min-w-0 pr-2">
                                <span className="text-2xl drop-shadow-[1px_1px_0px_rgba(0,0,0,1)] flex-shrink-0">{icons[r.file_type] || '📄'}</span>
                                <div className="min-w-0">
                                    <p className={`text-xs font-black uppercase tracking-wide truncate ${textHeader}`}>{r.title}</p>
                                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">{r.subject} ✦ {r.semester}</p>
                                    <p className={`text-[9px] font-medium tracking-wide ${dark ? 'text-stone-300' : 'text-stone-700'}`}>Node Mount Vector // {r.shared_by}</p>
                                </div>
                            </div>
                            <button onClick={() => window.location.href = '/student/download/' + r.id} className="bg-blue-400 text-black border-2 border-black text-xs font-black px-3 py-1.5 rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex-shrink-0">
                                ↓
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── ChatPanel ─────────────────────────────────────────────────────────────────
function ChatPanel({ dark, messages, chatLoading, chatInput, setChatInput, sendingChat, handleSendMessage, handleChatKeyDown, chatEndRef, currentUserId, formatTime, desktop }) {
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const subCardBg = dark ? 'bg-[#121110]' : 'bg-[#fcf8f2]';
    const textHeader = dark ? 'text-white' : 'text-black';

    return (
        <div className={`border-2 border-b-[8px] border-black rounded-3xl flex flex-col font-sans-custom overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${cardBg} ${
            desktop ? 'h-[calc(100vh-220px)] min-h-[520px]' : 'h-[calc(100vh-260px)] min-h-[440px]'
        }`}>
            {/* Component Header Terminal */}
            <div className="px-5 py-4 border-b-2 border-black flex-shrink-0 bg-black/5 dark:bg-white/5">
                <h2 className={`font-unique-bold text-sm uppercase tracking-wide ${textHeader}`}>💬 Message Terminal Frame</h2>
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">Auto routing sync interval: 5000ms loop</p>
            </div>

            {/* Chat Frame Logs Grid */}
            <div className={`flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 ${subCardBg}`}>
                {chatLoading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 bg-black dark:bg-white rounded-none border border-black animate-bounce" style={{animationDelay:'0ms'}}></div>
                            <div className="w-2.5 h-2.5 bg-black dark:bg-white rounded-none border border-black animate-bounce" style={{animationDelay:'150ms'}}></div>
                            <div className="w-2.5 h-2.5 bg-black dark:bg-white rounded-none border border-black animate-bounce" style={{animationDelay:'300ms'}}></div>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">Compiling packet arrays...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <p className="text-4xl mb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">💬</p>
                        <p className={`text-xs font-black uppercase tracking-wide ${textHeader}`}>No stream history verified</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-1">Broadcast an initial initialization packet vector</p>
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isMe = msg.user_id === currentUserId;
                        return (
                            <div key={msg.id ?? i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                {!isMe && (
                                    <span className="text-[9px] font-black uppercase tracking-widest mb-1 ml-1 text-stone-400">{msg.user_name}</span>
                                )}
                                {msg.type === 'resource' && msg.resource ? (
                                    /* Asset Embed Bubble Frame */
                                    <div className={`max-w-[85%] rounded-2xl p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                                        isMe
                                            ? 'bg-blue-400 text-black rounded-tr-none'
                                            : (dark ? 'bg-stone-800 text-white rounded-tl-none' : 'bg-white text-black rounded-tl-none')
                                    }`}>
                                        <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">📎 Payload Shared Array</p>
                                        <p className="text-xs font-black uppercase tracking-wide truncate">{msg.resource.title}</p>
                                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 truncate">{msg.resource.subject}</p>
                                        <button
                                            onClick={() => window.location.href = '/student/download/' + msg.resource.id}
                                            className="mt-2.5 text-[9px] font-black uppercase tracking-wider bg-black text-white px-2.5 py-1 rounded-md border border-black active:translate-y-0.5 transition-all"
                                        >
                                            Fetch Payload
                                        </button>
                                    </div>
                                ) : (
                                    /* Standard Text Bubble Frame */
                                    <div className={`max-w-[85%] px-3.5 py-2 border-2 border-black text-xs font-bold leading-relaxed break-words shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                                        isMe
                                            ? 'bg-purple-400 text-black rounded-2xl rounded-tr-none'
                                            : (dark ? 'bg-stone-800 text-stone-100 rounded-2xl rounded-tl-none' : 'bg-white text-black rounded-2xl rounded-tl-none')
                                    }`}>
                                        {msg.message}
                                    </div>
                                )}
                                <span className="text-[8px] font-bold uppercase tracking-widest text-stone-400 mt-1.5 mx-1">{formatTime(msg.created_at)}</span>
                            </div>
                        );
                    })
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Form Stream Sublayer */}
            <div className="px-4 py-3 border-t-2 border-black flex gap-2 flex-shrink-0 bg-black/5 dark:bg-white/5">
                <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={handleChatKeyDown}
                    placeholder="Broadcast text token array into pool..."
                    disabled={sendingChat}
                    className={`flex-1 border-2 border-black rounded-xl px-4 py-2 text-xs font-bold focus:outline-none min-w-0 disabled:opacity-50 ${
                        dark ? 'bg-stone-800 text-white placeholder-stone-500' : 'bg-white text-black placeholder-stone-400'
                    }`}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || sendingChat}
                    className="bg-blue-400 text-black border-2 border-black rounded-xl w-10 h-10 flex items-center justify-center transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none disabled:opacity-40 flex-shrink-0"
                    aria-label="Send message parameters"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}