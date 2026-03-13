import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';
import { useTransactions } from '../context/TransactionsContext';

export default function TransactionInputPage() {
    const navigate = useNavigate();
    const { addTransaction } = useTransactions();

    const [label, setLabel] = useState('');
    const [amount, setAmount] = useState('');
    const [sign, setSign] = useState(null); // 'plus' or 'minus'
    const [isStamping, setIsStamping] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent submission if no sign is chosen
        if (!sign) return;

        setIsStamping(true);

        const numericAmount = parseFloat(amount);
        const finalAmount = sign === 'minus' ? -Math.abs(numericAmount) : Math.abs(numericAmount);

        const success = await addTransaction({
            label,
            amount: finalAmount
        });

        setTimeout(() => {
            setIsStamping(false);
            if (success) {
                setLabel('');
                setAmount('');
                setSign(null);
                navigate('/');
            }
        }, 600);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col items-center justify-start min-h-screen overflow-x-hidden pb-20 selection:bg-primary/30">
            <div className="w-full max-w-[480px] min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-b from-[#101f22] to-[#121c1f]">

                <PageHeader title="Saisie Registre" showBack={true} />

                <main className="flex-1 flex flex-col px-4 py-8 gap-8 relative z-10 w-full pb-28">

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative flex-1">
                        {/* Left pipe decoration */}
                        <div className="absolute -left-6 top-0 bottom-0 w-2 bg-gradient-to-r from-[#4a3525] to-[#2a1b12] border-r border-[#6a4a2a] shadow-[2px_0_5px_rgba(0,0,0,0.5)] z-[-1]"></div>

                        {/* Sign Selection FIRST */}
                        <div className="flex flex-col gap-2 relative mt-2">
                            <label className={`text-sm font-bold text-slate-200 tracking-wide pl-2 uppercase opacity-80`}>
                                Type de Mouvement
                            </label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setSign('plus')}
                                    className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${sign === 'plus'
                                        ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                                        : 'bg-[#0d181a] border-[#2a454b] text-slate-500 hover:border-green-500/50 hover:text-green-500/70'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-4xl mb-1">add_circle</span>
                                    <span className="font-bold tracking-widest uppercase text-xs">Rentrée</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSign('minus')}
                                    className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${sign === 'minus'
                                        ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                                        : 'bg-[#0d181a] border-[#2a454b] text-slate-500 hover:border-red-500/50 hover:text-red-500/70'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-4xl mb-1">do_not_disturb_on</span>
                                    <span className="font-bold tracking-widest uppercase text-xs">Dépense</span>
                                </button>
                            </div>
                        </div>

                        {/* Amount Input SECOND */}
                        <div className="flex flex-col gap-2 relative mt-2">
                            <label className={`text-sm font-bold text-slate-200 tracking-wide pl-2 uppercase opacity-80`}>
                                Montant
                            </label>
                            <div className={`flex items-center rounded-lg bg-[#0d181a] border-2 ${sign === 'plus' ? 'border-green-500/50' : sign === 'minus' ? 'border-red-500/50' : 'border-primary/30'} focus-within:border-primary/50 transition-colors shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] overflow-hidden group`}>
                                <div className={`px-4 py-4 bg-[#101f22] border-r border-[#2a454b] flex items-center justify-center transition-colors ${sign === 'plus' ? 'text-green-400' : sign === 'minus' ? 'text-red-400' : 'text-primary'}`}>
                                    <span className="material-symbols-outlined text-[28px]">toll</span>
                                </div>
                                <input
                                    className={`w-full bg-transparent border-none ${sign === 'plus' ? 'text-green-400' : sign === 'minus' ? 'text-red-400' : 'text-primary'} placeholder-slate-600 focus:ring-0 p-4 font-bold text-3xl text-right tracking-wider outline-none`}
                                    placeholder="0.00"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(Math.abs(parseFloat(e.target.value) || '')?.toString() || e.target.value)} // always positive in input
                                    required
                                />
                            </div>
                        </div>

                        {/* Label Input THIRD */}
                        <div className="flex flex-col gap-2 relative mt-2">
                            <label className={`text-sm font-bold text-slate-200 tracking-wide pl-2 uppercase opacity-80`}>
                                Libellé
                            </label>
                            <div className={`flex items-center rounded-lg bg-[#111c1e] border-2 border-[#4a3525] focus-within:border-primary/50 transition-colors shadow-[inset_0_2px_5px_rgba(0,0,0,0.6)] overflow-hidden`}>
                                <div className="px-4 py-3 bg-[#182629] border-r border-[#4a3525] flex items-center justify-center text-amber-600/70">
                                    <span className="material-symbols-outlined">label</span>
                                </div>
                                <input
                                    className="w-full bg-transparent border-none text-slate-200 placeholder-slate-600 focus:ring-0 p-4 font-bold tracking-wide text-base outline-none"
                                    placeholder="Ex: Salaire, Loyer, Courses..."
                                    type="text"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button Area - CENTERED */}
                        <div className="mt-8 flex flex-col items-center gap-3 w-full">
                            <button
                                type="submit"
                                disabled={isStamping || !amount || parseFloat(amount) <= 0 || !label || !sign}
                                className={`w-full max-w-[320px] relative group h-24 bg-gradient-to-b from-[#3a3a3a] to-[#1a1a1a] rounded-xl border-b-[16px] border-[#0f0f0f] active:border-b-0 active:translate-y-[16px] transition-all duration-100 shadow-[0_20px_30px_rgba(0,0,0,0.9),inset_0_2px_2px_rgba(255,255,255,0.2)] flex items-center justify-center border-x-[6px] border-x-[#222] overflow-visible z-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${isStamping ? 'translate-y-[12px] border-b-[4px] scale-[0.98]' : ''}`}
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
                            {!sign && <p className="text-red-400 font-bold text-xs mt-2 text-center">Veuillez sélectionner Rentrée ou Dépense</p>}
                        </div>

                    </form>
                </main>
            </div>

            <BottomNav />
        </div>
    );
}
