import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';

export default function TransactionInputPage() {
    const navigate = useNavigate();
    const { addTransaction } = useTransactions();
    const { categories } = useCategories();

    const [tab, setTab] = useState('expense'); // expense, income, fixed, regulation
    const [categoryId, setCategoryId] = useState('');
    const [label, setLabel] = useState('');
    const [amount, setAmount] = useState('');
    const [isRegulationActive, setIsRegulationActive] = useState(true);

    // Tab configurations
    const tabs = [
        { id: 'expense', label: 'Dépenses', activeClass: 'bg-amber-600/20 border-amber-600/50 text-amber-500 shadow-[0_0_12px_rgba(217,119,6,0.15)]', inactiveClass: 'text-amber-600/70 hover:text-amber-400 border-transparent', theme: 'amber' },
        { id: 'income', label: 'Entrées', activeClass: 'bg-primary/20 border-primary/50 text-primary shadow-[0_0_12px_rgba(19,200,236,0.15)]', inactiveClass: 'text-primary/70 hover:text-primary border-transparent', theme: 'primary' },
        { id: 'fixed', label: 'Fixes', activeClass: 'bg-bronze/20 border-bronze/50 text-bronze shadow-[0_0_12px_rgba(184,115,51,0.15)]', inactiveClass: 'text-bronze/70 hover:text-bronze border-transparent', theme: 'bronze' },
        { id: 'regulation', label: 'Régulation', activeClass: 'bg-slate-500/20 border-slate-500/50 text-slate-300 shadow-[0_0_12px_rgba(100,116,139,0.15)]', inactiveClass: 'text-slate-500 hover:text-slate-400 border-transparent', theme: 'slate' },
    ];

    const currentTab = tabs.find(t => t.id === tab);

    // Dynamic theme colors based on selected tab
    const getThemeColor = () => {
        switch (tab) {
            case 'expense': return 'text-amber-400';
            case 'income': return 'text-primary';
            case 'fixed': return 'text-bronze';
            case 'regulation': return 'text-slate-300';
            default: return 'text-amber-400';
        }
    };

    const borderClass = tab === 'expense' ? 'border-amber-600/50' :
        tab === 'income' ? 'border-primary/50' :
            tab === 'fixed' ? 'border-bronze/50' : 'border-slate-500/50';

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsStamping(true);

        const success = await addTransaction({
            label,
            amount: parseFloat(amount),
            type: tab,
            category_id: categories.find(c => c.type === tab || (tab === 'expense' && c.type === 'expense_variable') || (tab === 'fixed' && c.type === 'expense_fixed'))?.id || null,
            is_recurring: isRegulationActive
        });

        setTimeout(() => {
            setIsStamping(false);
            if (success) {
                setLabel('');
                setAmount('');
                navigate('/');
            }
        }, 600);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col items-center justify-start min-h-screen overflow-x-hidden pb-20 selection:bg-primary/30">
            <div className="w-full max-w-[480px] min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-b from-[#101f22] to-[#121c1f]">

                <PageHeader title="Saisie Registre" showBack={true} />

                <main className="flex-1 flex flex-col px-4 py-2 gap-8 relative z-10 w-full pb-28">

                    {/* Tabs */}
                    <div className="flex p-1 bg-[#152528] rounded-lg border border-[#2a454b] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                        {tabs.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => {
                                    setTab(t.id);
                                    setCategoryId('');
                                }}
                                className={`flex-1 py-2 text-[10px] sm:text-xs font-bold text-center rounded transition-all border ${tab === t.id ? t.activeClass : t.inactiveClass}`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative flex-1">
                        {/* Left pipe decoration */}
                        <div className="absolute -left-6 top-0 bottom-0 w-2 bg-gradient-to-r from-[#4a3525] to-[#2a1b12] border-r border-[#6a4a2a] shadow-[2px_0_5px_rgba(0,0,0,0.5)] z-[-1]"></div>

                        {/* Amount Input FIRST */}
                        <div className="flex flex-col gap-2 relative">
                            <label className={`text-sm font-bold text-slate-200 tracking-wide pl-2 uppercase opacity-80`}>
                                Montant
                            </label>
                            <div className={`flex items-center rounded-lg bg-[#0d181a] border-2 border-primary/30 focus-within:${borderClass} transition-colors shadow-[0_0_15px_rgba(19,200,236,0.05),inset_0_2px_5px_rgba(0,0,0,0.8)] overflow-hidden group`}>
                                <div className="px-4 py-4 bg-[#101f22] border-r border-primary/30 flex items-center justify-center text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[28px]">toll</span>
                                </div>
                                <input
                                    className="w-full bg-transparent border-none text-primary placeholder-primary/20 focus:ring-0 p-4 font-mono text-3xl text-right tracking-wider outline-none drop-shadow-[0_0_5px_rgba(19,200,236,0.6)]"
                                    placeholder="0.00"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Label Input SECOND */}
                        <div className="flex flex-col gap-2 relative">
                            <label className={`text-sm font-bold text-slate-200 tracking-wide pl-2 uppercase opacity-80`}>
                                Libellé
                            </label>
                            <div className={`flex items-center rounded-lg bg-[#111c1e] border-2 border-[#4a3525] focus-within:${borderClass} transition-colors shadow-[inset_0_2px_5px_rgba(0,0,0,0.6)] overflow-hidden`}>
                                <div className="px-4 py-3 bg-[#182629] border-r border-[#4a3525] flex items-center justify-center text-amber-600/70">
                                    <span className="material-symbols-outlined">label</span>
                                </div>
                                <input
                                    className="w-full bg-transparent border-none text-slate-200 placeholder-slate-600 focus:ring-0 p-4 font-bold tracking-wide text-base outline-none"
                                    placeholder="ex: Carburant Vapeur, Loyer"
                                    type="text"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Regulation Switch */}
                        <div className="mt-2 bg-[#152528] border border-[#3a281c] p-4 rounded-xl flex items-center justify-between shadow-[inset_0_0_20px_rgba(0,0,0,0.4)] relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 size-24 bg-amber-900/10 rounded-full blur-xl"></div>
                            <div className="flex flex-col relative z-10">
                                <span className="text-sm font-bold text-slate-200 tracking-wide">Régulation Mensuelle</span>
                                <span className="text-xs text-slate-500 font-mono mt-0.5">Basculer la polarité absolue</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer z-10">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={isRegulationActive}
                                    onChange={(e) => setIsRegulationActive(e.target.checked)}
                                />
                                <div className="w-16 h-8 bg-[#2a1b12] border-2 border-[#1a110b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-gradient-to-b after:from-[#b91c1c] after:to-[#7f1d1d] after:border-[#450a0a] after:border-2 after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] peer-checked:bg-[#122a20] shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] peer-checked:after:from-amber-400 peer-checked:after:to-amber-600 peer-checked:after:border-[#5a3a1a]"></div>
                            </label>
                        </div>

                        {/* Submit Button Area - CENTERED */}
                        <div className="mt-8 flex flex-col items-center gap-3 w-full">
                            <button
                                type="submit"
                                disabled={isStamping}
                                className={`w-full max-w-[320px] relative group h-24 bg-gradient-to-b from-[#3a3a3a] to-[#1a1a1a] rounded-xl border-b-[16px] border-[#0f0f0f] active:border-b-0 active:translate-y-[16px] transition-all duration-100 shadow-[0_20px_30px_rgba(0,0,0,0.9),inset_0_2px_2px_rgba(255,255,255,0.2)] flex items-center justify-center border-x-[6px] border-x-[#222] overflow-visible z-10 cursor-pointer ${isStamping ? 'translate-y-[12px] border-b-[4px] scale-[0.98]' : ''}`}
                            >
                                <div className={`absolute inset-2 bg-gradient-to-br from-[#a67c00] via-[#bf953f] to-[#b38728] rounded-lg border-2 border-[#fbf5b7]/40 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden transition-all duration-300 ${isStamping ? 'brightness-150' : ''}`}>
                                    {/* Corner bolts */}
                                    <div className="absolute top-1.5 left-1.5 size-2.5 rounded-full bg-[#1a110b] border border-[#fbf5b7]/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"></div>
                                    <div className="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-[#1a110b] border border-[#fbf5b7]/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"></div>
                                    <div className="absolute bottom-1.5 left-1.5 size-2.5 rounded-full bg-[#1a110b] border border-[#fbf5b7]/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"></div>
                                    <div className="absolute bottom-1.5 right-1.5 size-2.5 rounded-full bg-[#1a110b] border border-[#fbf5b7]/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"></div>

                                    {/* Steam Effect */}
                                    {isStamping && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-full h-full bg-white animate-ping opacity-20 rounded-full blur-2xl"></div>
                                        </div>
                                    )}

                                    <div className="relative z-10 flex flex-col items-center justify-center pt-1">
                                        <span className={`font-display font-black text-lg sm:text-xl text-[#1a110b] uppercase tracking-widest leading-tight text-center drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)] ${isStamping ? 'scale-110' : ''}`}>
                                            {isStamping ? "Impression..." : "Valider la\nTransaction"}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        </div>

                    </form>
                </main>
            </div>

            <BottomNav />
        </div>
    );
}
