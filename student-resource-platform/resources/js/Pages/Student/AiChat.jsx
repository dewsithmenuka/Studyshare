import { Head } from '@inertiajs/react';
import { useState, useRef } from 'react';
import MainLayout from '@/Layouts/MainLayout';

export default function AiChat({ auth }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const newMessages = [...messages, { user: 'Me', message: input }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        const res = await fetch('/student/ai-chat/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content },
            body: JSON.stringify({ message: input })
        });
        const data = await res.json();
        
        setMessages([...newMessages, { user: 'AI', message: data.message }]);
        setLoading(false);
    };

    return (
        <MainLayout auth={auth}>
            <Head title="AI Study Assistant" />
            <div className="max-w-3xl mx-auto h-[80vh] flex flex-col border-2 border-black rounded-3xl bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="text-xl font-black uppercase mb-4">AI Study Assistant</h1>
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    {messages.map((m, i) => (
                        <div key={i} className={`p-3 rounded-xl ${m.user === 'AI' ? 'bg-amber-200' : 'bg-blue-200 ml-auto'} max-w-[80%]`}>
                            <p className="font-bold text-xs">{m.user}</p>
                            <p className="text-sm">{m.message}</p>
                        </div>
                    ))}
                    {loading && <p className="text-xs font-bold animate-pulse">AI is thinking...</p>}
                </div>
                <div className="flex gap-2">
                    <input className="flex-1 border-2 border-black rounded-xl p-2" value={input} onChange={e => setInput(e.target.value)} />
                    <button onClick={handleSend} className="bg-black text-white px-4 py-2 rounded-xl">Send</button>
                </div>
            </div>
        </MainLayout>
    );
}