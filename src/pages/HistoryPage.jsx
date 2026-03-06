import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';

export default function HistoryPage() {
    const transactions = [
        { id: 1, date: '12 OCT', label: 'Salaire Éther', category: 'REVENU', amount: 4500.00, type: 'income', icon: 'payments' },
        { id: 2, date: '05 OCT', label: 'Loyer Vapeur', category: 'COÛT FIXE', amount: -1200.00, type: 'expense', icon: 'home' },
        { id: 3, date: '02 OCT', label: 'Taxe Dirigeable', category: 'RÉGULATION', amount: -300.00, type: 'regulation', icon: 'policy' },
        { id: 4, date: '28 SEP', label: 'Maint. Engrenages', category: 'RÉGULATION', amount: -150.00, type: 'regulation', icon: 'settings_suggest' },
    ];

    const formatAmount = (amount, type) => {
        const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(amount));
        // Note: mockup shows $ instead of €. Let's use EUR for realism, but follow the mockup style: -$1,200.00
        // Actually we decided earlier to use € for production, so let's use EUR.
        const eurFormatted = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Math.abs(amount));
        return type === 'income' ? `+ ${eurFormatted}` : `- ${eurFormatted}`;
    };

    return (
        <div className="bg-[#e0d6c8] dark:bg-[#1a1614] text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col items-center pb-20">
            <div
                className="w-full max-w-[480px] min-h-screen flex flex-col relative overflow-hidden"
                style={{ backgroundImage: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.05) 0%, transparent 70%)' }}
            >
                <PageHeader title="Grand Registre des Transactions" showBack={false} />

                <div className="flex flex-col gap-3 px-4 py-6 relative z-0">
                    <div className="absolute inset-0 border-b border-brass/10 pointer-events-none"></div>
                    <div className="flex min-w-[111px] flex-1 basis-[fit-content] flex-col gap-2 rounded-lg border-2 border-brass/30 bg-gradient-to-b from-brass/10 to-transparent p-5 items-center text-center shadow-[inset_0_0_20px_rgba(212,175,55,0.1)]">
                        <p className="text-red-500 tracking-wider text-4xl font-bold leading-tight drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                            - {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(450.00)}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-brass text-sm">gavel</span>
                            <p className="text-slate-400 text-xs sm:text-sm font-medium uppercase tracking-widest">Impact Mensuel des Régulations</p>
                        </div>
                    </div>
                </div>

                {/* Table Header */}
                <div className="flex justify-between px-4 py-2 border-b border-brass/20">
                    <div className="flex gap-4 sm:gap-8">
                        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Date</h3>
                        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Libellé</h3>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Montant</h3>
                </div>

                {/* Transactions List */}
                <div className="flex flex-col flex-1 pb-10">
                    {transactions.map(tx => (
                        <div key={tx.id} className="flex items-center gap-4 px-4 min-h-[80px] py-3 justify-between border-b border-brass/10 hover:bg-brass/5 transition-colors relative group">
                            {/* Color indicator line */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${tx.type === 'income' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]'} opacity-70 group-hover:opacity-100 transition-opacity`}></div>

                            <div className="flex items-center gap-4 w-full pl-2">
                                <div className="w-12 shrink-0 text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-widest font-bold text-center">
                                    {tx.date}
                                </div>

                                <div className="text-brass flex items-center justify-center rounded-lg border border-brass/30 bg-[#e0d6c8] dark:bg-[#1a1614] shrink-0 size-10 shadow-[inset_0_0_10px_rgba(212,175,55,0.2)]">
                                    <span className="material-symbols-outlined text-xl">{tx.icon}</span>
                                </div>

                                <div className="flex flex-col justify-center flex-1 min-w-0 pr-2">
                                    <p className="text-slate-900 dark:text-slate-100 text-sm sm:text-base font-bold leading-normal tracking-wide uppercase truncate">{tx.label}</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-medium leading-normal tracking-widest uppercase truncate">{tx.category}</p>
                                </div>

                                <div className="shrink-0 text-right">
                                    <p className={`text-base sm:text-lg font-bold leading-normal tracking-wider ${tx.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                        {formatAmount(tx.amount, tx.type)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
