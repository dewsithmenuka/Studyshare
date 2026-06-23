import { Head, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTheme } from '@/hooks/useTheme';
import { useState, useRef, useEffect } from 'react';

export default function Profile({ auth, user, stats, completion }) {
    const { theme } = useTheme();
    const dark = theme === 'dark';
    const { props } = usePage();
    const flash = props.flash || {};

    const [activeTab, setActiveTab] = useState('profile');
    const [form, setForm] = useState({
        name: user.name || '',
        username: user.username || '',
        student_id: user.student_id || '',
        degree_program: user.degree_program || '',
        semester: user.semester || '',
        bio: user.bio || '',
        phone: user.phone || '',
        interests: user.interests || [],
        is_profile_public: user.is_profile_public ?? true,
    });
    const [interestInput, setInterestInput] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(user.avatar);
    const [avatarFile, setAvatarFile] = useState(null);
    const [draggingAvatar, setDraggingAvatar] = useState(false);
    const [unsaved, setUnsaved] = useState(false);
    const [toast, setToast] = useState(null);
    const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
    const [passwordForm, setPasswordForm] = useState({ current_password: '', password: '', password_confirmation: '' });
    const [saving, setSaving] = useState(false);
    const avatarRef = useRef(null);

    useEffect(() => {
        if (flash.success) showToast(flash.success, 'success');
        if (flash.error) showToast(flash.error, 'error');
    }, [flash]);

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Structural tokens matching core views
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const subCardBg = dark ? 'bg-[#121110] border-[#2e2a24]' : 'bg-[#fcf8f2] border-[#1a1a1a]';
    const textMuted = dark ? 'text-stone-400' : 'text-stone-600';
    const textHeader = dark ? 'text-white' : 'text-black';

    const card = `border-2 border-b-[6px] border-black rounded-3xl p-6 ${cardBg}`;
    const input = `w-full border-2 border-black rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wide focus:outline-none focus:bg-amber-50/10 transition-all ${dark ? 'bg-stone-800 text-white placeholder-stone-500' : 'bg-white text-black placeholder-stone-400'}`;
    const label = `block text-[11px] font-black uppercase tracking-wider mb-1.5 ${textHeader}`;
    
    const tabClass = (t) => `w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl border-2 border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none ${
        activeTab === t 
            ? 'bg-blue-400 text-black' 
            : (dark ? 'bg-stone-800 text-stone-300 hover:bg-stone-700' : 'bg-white text-black hover:bg-stone-100')
    }`;

    const handleAvatarFile = (file) => {
        if (!file) return;
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.type)) { showToast('Only JPG, PNG, WebP allowed.', 'error'); return; }
        if (file.size > 2 * 1024 * 1024) { showToast('Max file size is 2MB.', 'error'); return; }
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleAvatarDrop = (e) => {
        e.preventDefault();
        setDraggingAvatar(false);
        handleAvatarFile(e.dataTransfer.files[0]);
    };

    const handleSaveAvatar = () => {
        if (!avatarFile) return;
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        router.post('/student/profile/avatar', formData, {
            onSuccess: () => { setAvatarFile(null); showToast('Profile picture updated!', 'success'); },
        });
    };

    const handleRemoveAvatar = () => {
        if (confirm('Remove profile picture?')) {
            router.delete('/student/profile/avatar', {
                onSuccess: () => { setAvatarPreview(null); setAvatarFile(null); },
            });
        }
    };

    const handleAddInterest = (e) => {
        if (e.key === 'Enter' && interestInput.trim()) {
            e.preventDefault();
            if (!form.interests.includes(interestInput.trim())) {
                setForm({ ...form, interests: [...form.interests, interestInput.trim()] });
                setUnsaved(true);
            }
            setInterestInput('');
        }
    };

    const handleRemoveInterest = (interest) => {
        setForm({ ...form, interests: form.interests.filter(i => i !== interest) });
        setUnsaved(true);
    };

    const handleUpdate = () => {
        setSaving(true);
        router.put('/student/profile', form, {
            onSuccess: () => { setUnsaved(false); setSaving(false); },
            onError: () => setSaving(false),
        });
    };

    const handlePasswordUpdate = () => {
        router.put('/student/profile/password', passwordForm, {
            onSuccess: () => setPasswordForm({ current_password: '', password: '', password_confirmation: '' }),
        });
    };

    const handleDeleteAccount = () => {
        if (confirm('Are you sure? This will permanently delete your account and all your data. This cannot be undone.')) {
            router.delete('/student/profile/account');
        }
    };

    const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <MainLayout auth={auth}>
            <Head title="My Profile" />

            {/* Fixed Toast Banner */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-5 py-3 border-4 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black ${toast.type === 'success' ? 'bg-emerald-400' : 'bg-red-400'}`}>
                    {toast.type === 'success' ? '✅' : '❌'} {toast.message}
                </div>
            )}

            {/* Bottom Sticky Drawer Bar */}
            {unsaved && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-amber-400 text-black border-4 border-black px-6 py-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase tracking-wide flex flex-col sm:flex-row items-center gap-4 font-sans-custom">
                    <span>⚠️ Unsaved mutations detected within parameters</span>
                    <div className="flex gap-2">
                        <button onClick={handleUpdate} className="bg-black text-white border-2 border-black px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest active:translate-y-0.5">Save Now</button>
                        <button onClick={() => { setForm({ name: user.name || '', username: user.username || '', student_id: user.student_id || '', degree_program: user.degree_program || '', semester: user.semester || '', bio: user.bio || '', phone: user.phone || '', interests: user.interests || [], is_profile_public: user.is_profile_public ?? true }); setUnsaved(false); }} className="text-black underline text-[10px] uppercase font-black tracking-widest ml-1">Discard</button>
                    </div>
                </div>
            )}

            <div className="mb-6 font-sans-custom">
                <h1 className={`font-unique-bold text-4xl uppercase tracking-tight ${textHeader}`}>My Profile</h1>
                <p className={`text-xs font-bold uppercase tracking-widest ${textMuted} mt-1`}>✦ Manage your personal information and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-sans-custom">
                {/* Left Columns Array */}
                <div className="lg:col-span-1 flex flex-col gap-5">
                    {/* Identity Metadata Box */}
                    <div className={card + ' flex flex-col items-center text-center'}>
                        <div
                            onDragOver={e => { e.preventDefault(); setDraggingAvatar(true); }}
                            onDragLeave={() => setDraggingAvatar(false)}
                            onDrop={handleAvatarDrop}
                            onClick={() => avatarRef.current?.click()}
                            className={`relative cursor-pointer w-24 h-24 rounded-2xl flex items-center justify-center mb-4 border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all ${draggingAvatar ? 'bg-amber-200' : ''}`}
                        >
                            <input ref={avatarRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => handleAvatarFile(e.target.files[0])} />
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" className="w-full h-full rounded-xl object-cover" />
                            ) : (
                                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-black text-3xl font-black">
                                    {initials}
                                </div>
                            )}
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-400 border-2 border-black rounded-xl flex items-center justify-center text-black text-xs shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">📷</div>
                        </div>

                        <h3 className={`font-unique-bold text-lg uppercase tracking-wide leading-tight ${textHeader}`}>{user.name}</h3>
                        {user.username && <p className={`text-xs font-bold uppercase tracking-wider ${textMuted} mt-0.5`}>@{user.username}</p>}

                        <div className="flex gap-1.5 mt-3 flex-wrap justify-center">
                            {user.roles?.map(role => (
                                <span key={role} className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${role === 'admin' ? 'bg-purple-400 text-black' : 'bg-blue-400 text-black'}`}>{role}</span>
                            ))}
                            {user.email_verified && <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-black bg-emerald-400 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">✓ Verified</span>}
                        </div>

                        {avatarFile && (
                            <button onClick={handleSaveAvatar} className="mt-4 w-full bg-emerald-400 text-black border-2 border-black text-[10px] font-black uppercase tracking-widest py-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none">
                                Save Photo
                            </button>
                        )}
                        {avatarPreview && !avatarFile && (
                            <button onClick={handleRemoveAvatar} className="mt-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline">Remove photo</button>
                        )}

                        <div className="w-full mt-4 pt-3 border-t-2 border-dashed border-black/20 dark:border-white/10 text-left">
                            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">JOIN_TIMESTAMP // {user.joined_at}</p>
                            {user.last_login && <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">ACTIVE_INDEX // {user.last_login}</p>}
                        </div>
                    </div>

                    {/* Completion Tracker Card */}
                    <div className={card}>
                        <h3 className={`font-unique-bold text-xs uppercase tracking-wide mb-2.5 ${textHeader}`}>Profile Completion</h3>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex-1 h-4 rounded-xl border-2 border-black bg-stone-200 dark:bg-stone-800 overflow-hidden p-0.5">
                                <div className="h-full rounded-lg bg-emerald-400 border border-black transition-all" style={{width: completion + '%'}}></div>
                            </div>
                            <span className={`text-xs font-black uppercase tracking-wider ${textHeader}`}>{completion}%</span>
                        </div>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>
                            {completion < 100 ? '✦ Complete profile indexes to optimize directory storage' : '🎉 Index compilation complete'}
                        </p>
                    </div>

                    {/* Performance Stats Dashboard Component */}
                    <div className={card}>
                        <h3 className={`font-unique-bold text-xs uppercase tracking-wide mb-3 ${textHeader}`}>Activity Stats</h3>
                        <div className="flex flex-col gap-2">
                            {[
                                { label: 'Uploaded', value: stats.uploaded_resources, icon: '📁', bg: 'bg-blue-400' },
                                { label: 'Public', value: stats.public_resources, icon: '🌍', bg: 'bg-emerald-400' },
                                { label: 'Groups', value: stats.groups_joined, icon: '👥', bg: 'bg-purple-400' },
                                { label: 'Avg Rating', value: stats.average_rating ? parseFloat(stats.average_rating).toFixed(1) : 'N/A', icon: '⭐', bg: 'bg-amber-400' },
                            ].map(stat => (
                                <div key={stat.label} className={`flex items-center justify-between p-2.5 border-2 border-black rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] ${subCardBg}`}>
                                    <span className={`text-[11px] font-black uppercase tracking-wide ${textHeader}`}>{stat.icon} {stat.label}</span>
                                    <span className={`text-xs font-black uppercase px-2 py-0.5 rounded-md border border-black ${stat.bg} text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]`}>{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Tab Group System */}
                    <div className={`${card} flex flex-col gap-2.5`}>
                        {[
                            { id: 'profile', label: '👤 Personal Info' },
                            { id: 'password', label: '🔒 Password' },
                            { id: 'preferences', label: '⚙️ Preferences' },
                            { id: 'danger', label: '⚠️ Danger Zone' },
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={tabClass(tab.id)}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area Workspace */}
                <div className="lg:col-span-3 flex flex-col gap-6">

                    {activeTab === 'profile' && (
                        <>
                            <div className={card}>
                                <h2 className={`font-unique-bold text-lg uppercase tracking-wide mb-5 ${textHeader}`}>Personal Information</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={label}>Full Name</label>
                                        <input type="text" value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); setUnsaved(true); }} className={input} />
                                    </div>
                                    <div>
                                        <label className={label}>Username</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-xs font-black text-stone-500">@</span>
                                            <input type="text" value={form.username} onChange={e => { setForm({ ...form, username: e.target.value }); setUnsaved(true); }} className={input + ' pl-8'} placeholder="username" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={label}>Email Address</label>
                                        <div className="relative">
                                            <input type="email" value={user.email} disabled className={input + ' opacity-50 cursor-not-allowed bg-stone-100 dark:bg-stone-900'} />
                                            {user.email_verified && <span className="absolute right-3 top-2.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest">✓ Verified</span>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className={label}>Phone (optional)</label>
                                        <input type="tel" value={form.phone} onChange={e => { setForm({ ...form, phone: e.target.value }); setUnsaved(true); }} className={input} placeholder="+94 77 123 4567" />
                                    </div>
                                </div>
                            </div>

                            <div className={card}>
                                <h2 className={`font-unique-bold text-lg uppercase tracking-wide mb-5 ${textHeader}`}>Academic Information</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={label}>Student ID Identifier</label>
                                        <input type="text" value={form.student_id} onChange={e => { setForm({ ...form, student_id: e.target.value }); setUnsaved(true); }} className={input} placeholder="e.g. IT21234567" />
                                    </div>
                                    <div>
                                        <label className={label}>Degree Program Matrix</label>
                                        <input type="text" value={form.degree_program} onChange={e => { setForm({ ...form, degree_program: e.target.value }); setUnsaved(true); }} className={input} placeholder="e.g. BSc in Computer Science" />
                                    </div>
                                    <div>
                                        <label className={label}>Current Term Semester</label>
                                        <select value={form.semester} onChange={e => { setForm({ ...form, semester: e.target.value }); setUnsaved(true); }} className={input}>
                                            <option value="">Select semester</option>
                                            {['Semester 1','Semester 2','Semester 3','Semester 4','Semester 5','Semester 6','Semester 7','Semester 8'].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className={card}>
                                <h2 className={`font-unique-bold text-lg uppercase tracking-wide mb-5 ${textHeader}`}>About Me</h2>
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className={label}>Biography Block</label>
                                        <textarea value={form.bio} onChange={e => { setForm({ ...form, bio: e.target.value }); setUnsaved(true); }} rows={3} maxLength={500} className={input + ' normal-case'} placeholder="Tell others about yourself..." />
                                        <p className="text-[10px] font-bold uppercase text-stone-400 mt-1">{form.bio?.length || 0} / 500 characters max</p>
                                    </div>
                                    <div>
                                        <label className={label}>Interests & Skills Vector (press Enter to map)</label>
                                        <input
                                            type="text"
                                            value={interestInput}
                                            onChange={e => setInterestInput(e.target.value)}
                                            onKeyDown={handleAddInterest}
                                            className={input}
                                            placeholder="e.g. Machine Learning, Web Dev, Data Science..."
                                        />
                                        {form.interests?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {form.interests.map(interest => (
                                                    <span key={interest} className="inline-flex items-center gap-1 px-3 py-1 border-2 border-black rounded-xl text-[10px] font-black uppercase tracking-wide bg-blue-400 text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                                                        {interest}
                                                        <button onClick={() => handleRemoveInterest(interest)} className="hover:text-red-600 font-black ml-1 text-xs">×</button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleUpdate}
                                    disabled={saving}
                                    className="bg-emerald-400 text-black border-2 border-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
                                >
                                    {saving ? 'Saving Workspace...' : 'Save Changes'}
                                </button>
                                <button
                                    onClick={() => { setForm({ name: user.name || '', username: user.username || '', student_id: user.student_id || '', degree_program: user.degree_program || '', semester: user.semester || '', bio: user.bio || '', phone: user.phone || '', interests: user.interests || [], is_profile_public: user.is_profile_public ?? true }); setUnsaved(false); }}
                                    className={`border-2 border-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all ${dark ? 'bg-stone-800 text-stone-300 hover:bg-stone-700' : 'bg-white text-black hover:bg-stone-100'}`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}

                    {activeTab === 'password' && (
                        <div className={card}>
                            <h2 className={`font-unique-bold text-lg uppercase tracking-wide mb-4 ${textHeader}`}>Change Password</h2>
                            {user.google_id && (
                                <div className="p-3 border-2 border-black bg-blue-400 text-black rounded-xl text-xs font-bold uppercase tracking-wider mb-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    ℹ️ Identity provision established via Google federation. Standard password mapping optional.
                                </div>
                            )}
                            <div className="flex flex-col gap-4">
                                {!user.google_id && (
                                    <div>
                                        <label className={label}>Current Token Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword.current ? 'text' : 'password'}
                                                value={passwordForm.current_password}
                                                onChange={e => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                                                className={input}
                                                placeholder="Enter current password"
                                            />
                                            <button type="button" onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })} className="absolute right-3 top-2.5 text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-black dark:hover:text-white">
                                                {showPassword.current ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <label className={label}>New Vector Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword.new ? 'text' : 'password'}
                                            value={passwordForm.password}
                                            onChange={e => setPasswordForm({ ...passwordForm, password: e.target.value })}
                                            className={input}
                                            placeholder="Min 8 characters"
                                        />
                                        <button type="button" onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })} className="absolute right-3 top-2.5 text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-black dark:hover:text-white">
                                            {showPassword.new ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className={label}>Confirm Vector Password Mapping</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword.confirm ? 'text' : 'password'}
                                            value={passwordForm.password_confirmation}
                                            onChange={e => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
                                            className={input}
                                            placeholder="Repeat new password"
                                        />
                                        <button type="button" onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })} className="absolute right-3 top-2.5 text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-black dark:hover:text-white">
                                            {showPassword.confirm ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                </div>
                                <button onClick={handlePasswordUpdate} className="bg-blue-400 text-black border-2 border-black px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all w-fit mt-2">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className={card}>
                            <h2 className={`font-unique-bold text-lg uppercase tracking-wide mb-4 ${textHeader}`}>Preferences</h2>
                            <div className="flex flex-col gap-4">
                                <div className={`flex items-center justify-between p-4 border-2 border-black rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${subCardBg}`}>
                                    <div>
                                        <p className={`font-black text-xs uppercase tracking-wide ${textHeader}`}>Public Profile Directory Visibility</p>
                                        <p className={`text-[10px] font-bold uppercase tracking-wider ${textMuted} mt-0.5`}>Allow third-party peers inside the collective to query your attributes</p>
                                    </div>
                                    <button
                                        onClick={() => { setForm({ ...form, is_profile_public: !form.is_profile_public }); setUnsaved(true); }}
                                        className={`w-14 h-8 rounded-xl border-2 border-black p-0.5 transition-all relative ${form.is_profile_public ? 'bg-emerald-400' : 'bg-stone-300 dark:bg-stone-700'}`}
                                    >
                                        <div className={`w-6 h-6 bg-white border-2 border-black rounded-lg shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all transform ${form.is_profile_public ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>
                                <button onClick={handleUpdate} disabled={saving} className="bg-blue-400 text-black border-2 border-black px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all w-fit mt-2">
                                    {saving ? 'Processing Parameters...' : 'Save Preferences'}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'danger' && (
                        <div className={`border-2 border-b-[8px] border-red-500 rounded-3xl p-6 ${dark ? 'bg-[#1c1a18]' : 'bg-white'}`}>
                            <h2 className="font-unique-bold text-lg uppercase tracking-wide mb-1 text-red-500">Danger Zone</h2>
                            <p className={`text-xs font-bold uppercase tracking-wider ${textMuted} mb-5`}>Destructive mutations applied here break node connections permanently.</p>
                            
                            <div className={`p-4 border-2 border-red-500 rounded-2xl ${dark ? 'bg-red-950/20' : 'bg-red-50'}`}>
                                <h3 className="font-black text-xs uppercase tracking-wide text-red-500 mb-1">Purge Account Context</h3>
                                <p className={`text-[11px] font-medium leading-relaxed mb-4 ${dark ? 'text-stone-300' : 'text-stone-700'}`}>Wipes authentication record arrays, indexing blocks, object uploads, group maps, and message structures configuration completely.</p>
                                <button onClick={handleDeleteAccount} className="bg-red-500 text-white border-2 border-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all">
                                    Delete My Account
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}