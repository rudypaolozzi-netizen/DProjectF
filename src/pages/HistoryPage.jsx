import React, { useMemo, useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';
import { useTransactions } from '../hooks/useTransactions';

export default function HistoryPage() {
    const { transactions } = useTransactions();
    const [expandedMonths, setExpandedMonths] = useState([new Date().toISOString().slice(0, 7)]); // Current month expanded by default

    const groupedTransactions = useMemo(() => {
        const groups = {};
        transactions.forEach(tx => {
            const date = new Date(tx.transaction_date);
            const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
            if (!groups[monthKey]) groups[monthKey] = [];
            groups[monthKey].push({
                ...tx,
                formattedDate: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
                categoryName: tx.categories?.name || 'Inconnu',
                categoryIcon: tx.categories?.icon || 'receipt_long',
                amountNum: parseFloat(tx.amount)
            });
        });

        // Sort keys descending
        return Object.keys(groups).sort().reverse().map(key => ({
            monthKey: key,
            displayMonth: new Date(key + "-01").toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
            items: groups[key]
        }));
    }, [transactions]);

    const regulationImpact = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return transactions
            .filter(tx => {
                const d = new Date(tx.transaction_date);
                return tx.type === 'regulation' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
            })
            .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
    }, [transactions]);

    const toggleMonth = (monthKey) => {
        setExpandedMonths(prev =>
            prev.includes(monthKey)
                ? prev.filter(m => m !== monthKey)
                : [...prev, monthKey]
        );
    };

    const formatAmount = (amount, type) => {
        const eurFormatted = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Math.abs(amount));
        return type === 'income' ? `+ ${eurFormatted}` : `- ${eurFormatted}`;
    };

    return (
        <div className="bg-[#e0d6c8] dark:bg-[#1a1614] text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col items-center pb-20">
            <div
                className="w-full max-w-[480px] min-h-screen flex flex-col relative overflow-hidden"
                style={{ backgroundImage: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.05) 0%, transparent 70%)' }}
            >
                <PageHeader title="Historique" showBack={false} />

                <div className="flex flex-col gap-3 px-4 py-6 relative z-0">
                    <div className="absolute inset-0 border-b border-brass/10 pointer-events-none"></div>
                    <div className="flex min-w-[111px] flex-1 basis-[fit-content] flex-col gap-2 rounded-lg border-2 border-brass/30 bg-gradient-to-b from-brass/10 to-transparent p-5 items-center text-center shadow-[inset_0_0_20px_rgba(212,175,55,0.1)]">
                        <p className={`${regulationImpact >= 0 ? 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'} tracking-wider text-4xl font-bold leading-tight`}>
                            {regulationImpact >= 0 ? '+' : '-'} {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Math.abs(regulationImpact))}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-brass text-sm">gavel</span>
                            <p className="text-slate-400 text-xs sm:text-sm font-medium uppercase tracking-widest">Impact Régulations (Mois en cours)</p>
                        </div>
                    </div>
                </div>

                {/* Grouped Transactions List */}
                <div className="flex flex-col flex-1 pb-10 px-2">
                    {groupedTransactions.map(group => (
                        <div key={group.monthKey} className="mb-4">
                            <button
                                onClick={() => toggleMonth(group.monthKey)}
                                className="w-full flex items-center justify-between p-3 bg-brass/10 border border-brass/30 rounded-lg mb-1 hover:bg-brass/20 transition-colors"
                            >
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-brass">{group.displayMonth}</span>
                                <span className="material-symbols-outlined text-brass transition-transform duration-300" style={{ transform: expandedMonths.includes(group.monthKey) ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                    expand_more
                                </span>
                            </button>

                            {expandedMonths.includes(group.monthKey) && (
                                <div className="flex flex-col border-x border-brass/10 bg-white/5 rounded-b-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                                    {group.items.map(tx => (
                                        <div key={tx.id} className="flex items-center gap-3 px-3 min-h-[70px] py-2 justify-between border-b border-brass/5 hover:bg-brass/5 transition-colors relative group">
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${tx.type === 'income' ? 'bg-green-500' : 'bg-red-500'} opacity-50`}></div>

                                            <div className="w-10 shrink-0 text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold text-center">
                                                {tx.formattedDate}
                                            </div>

                                            <div className="text-brass flex items-center justify-center rounded-lg border border-brass/20 bg-[#e0d6c8] dark:bg-[#1a1614] shrink-0 size-8">
                                                <span className="material-symbols-outlined text-base">{tx.categoryIcon}</span>
                                            </div>

                                            <div className="flex flex-col justify-center flex-1 min-w-0 pr-2">
                                                <p className="text-slate-900 dark:text-slate-100 text-xs font-bold uppercase truncate">{tx.label}</p>
                                                <p className="text-slate-500 dark:text-slate-400 text-[9px] font-medium tracking-widest uppercase truncate">{tx.categoryName}</p>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <p className={`text-sm font-bold tracking-wider ${tx.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                                    {formatAmount(tx.amountNum, tx.type)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
