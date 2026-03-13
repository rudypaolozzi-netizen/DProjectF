import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';
import BudgetGauge from '../components/dashboard/BudgetGauge';
import { useTransactions } from '../context/TransactionsContext';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { transactions } = useTransactions();

    const cumul = useMemo(() => {
        return transactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
    }, [transactions]);

    const recentTransactions = transactions.slice(0, 3).map(tx => ({
        id: tx.id,
        date: new Date(tx.transaction_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        label: tx.label,
        amount: parseFloat(tx.amount)
    }));

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col items-center justify-start overflow-x-hidden pb-20">
            <div className="w-full max-w-[480px] min-h-screen bg-steampunk flex flex-col relative overflow-hidden">

                <PageHeader title="Tableau de Bord" />

                <main className="flex-1 flex flex-col gap-6 p-4">
                    <BudgetGauge cumul={cumul} />

                    {/* Mouvement Financier */}
                    <section className="flex flex-col gap-3">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant border-b border-surface-variant pb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
                            Mouvement Financier
                        </h2>
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate('/input')}
                                className="w-full flex items-center justify-center gap-2 rounded-lg h-12 bg-primary/20 border border-primary text-primary font-bold hover:bg-primary/30 transition-all shadow-[inset_0_0_10px_rgba(19,200,236,0.2)]"
                            >
                                <span className="material-symbols-outlined text-xl">add_circle</span>
                                <span className="truncate">Injecter</span>
                            </button>
                        </div>
                    </section>

                    {/* Historique Mini */}
                    <section className="flex flex-col gap-3 mt-4">
                        <div className="flex items-center justify-between border-b border-surface-variant pb-2">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">history_edu</span>
                                Historique Récent
                            </h2>
                            <button onClick={() => navigate('/history')} className="text-xs text-primary hover:underline uppercase tracking-wider">Archives</button>
                        </div>

                        <div className="flex flex-col gap-2 font-mono text-sm">
                            {recentTransactions.map(tx => (
                                <div key={tx.id} className="flex justify-between items-center py-2 border-b border-surface-variant/50">
                                    <div className="flex gap-3 items-center truncate pr-4">
                                        <span className="text-xs text-on-surface-variant opacity-70 shrink-0">{tx.date}</span>
                                        <span className="text-slate-200 truncate">{tx.label}</span>
                                    </div>
                                    <span className={`${tx.amount >= 0 ? 'text-primary' : 'text-red-500'} shrink-0 font-bold`}>
                                        {tx.amount >= 0 ? '+' : ''}
                                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(tx.amount)}
                                    </span>
                                </div>
                            ))}
                            {recentTransactions.length === 0 && (
                                <p className="text-center text-slate-500 text-xs py-4">Aucune transaction récente</p>
                            )}
                        </div>
                    </section>

                </main>
            </div>

            <BottomNav />
        </div>
    );
}
