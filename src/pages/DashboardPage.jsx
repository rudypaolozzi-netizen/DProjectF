import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';
import BudgetGauge from '../components/dashboard/BudgetGauge';
import SectionCard from '../components/dashboard/SectionCard';
import { useTransactions } from '../hooks/useTransactions';
import { useBudget } from '../hooks/useBudget';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { transactions } = useTransactions();

    const stats = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let totalIncome = 0;
        let totalExpenses = 0;
        let positiveReg = 0;
        let negativeReg = 0;
        let fixed = 0;
        let variable = 0;

        transactions.forEach(tx => {
            const txDate = new Date(tx.transaction_date);
            if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
                const amt = parseFloat(tx.amount);
                if (tx.type === 'income') {
                    totalIncome += amt;
                } else if (tx.type === 'fixed') {
                    fixed += amt;
                    totalExpenses += amt;
                } else if (tx.type === 'expense') {
                    variable += amt;
                    totalExpenses += amt;
                } else if (tx.type === 'regulation') {
                    if (amt >= 0) {
                        positiveReg += amt;
                        totalIncome += amt;
                    } else {
                        negativeReg += Math.abs(amt);
                        totalExpenses += Math.abs(amt);
                    }
                }
            }
        });

        const remaining = totalIncome - totalExpenses;

        return {
            remaining,
            totalIncome,
            totalExpenses,
            fixed,
            income: totalIncome - positiveReg,
            variable,
            positiveReg,
            negativeReg
        };
    }, [transactions]);

    const recentTransactions = transactions.slice(0, 3).map(tx => ({
        id: tx.id,
        date: new Date(tx.transaction_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        label: tx.label,
        amount: parseFloat(tx.amount),
        type: tx.type
    }));

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col items-center justify-start overflow-x-hidden pb-20">
            <div className="w-full max-w-[480px] min-h-screen bg-steampunk flex flex-col relative overflow-hidden">

                <PageHeader title="Tableau de Bord" />

                <main className="flex-1 flex flex-col gap-6 p-4">
                    <BudgetGauge remaining={stats.remaining} totalIncome={stats.totalIncome} />

                    {/* Régulation du mois */}
                    <section className="flex flex-col gap-3">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant border-b border-surface-variant pb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">tune</span>
                            Régulation du mois
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

                    {/* Sections */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant border-b border-surface-variant pb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">account_tree</span>
                            Sections
                        </h2>
                        <div className="flex flex-col gap-3">
                            <SectionCard
                                title="Fixes"
                                subtitle="Drain Statique"
                                amount={stats.fixed}
                                icon="lock"
                                type="fixed"
                            />
                            <SectionCard
                                title="Entrées"
                                subtitle="Entrée Aether"
                                amount={stats.income}
                                icon="bolt"
                                type="income"
                            />
                            <SectionCard
                                title="Dépenses"
                                subtitle="Flux Dynamique"
                                amount={stats.variable}
                                icon="waves"
                                type="variable"
                            />
                        </div>
                    </section>

                    {/* Historique Mini */}
                    <section className="flex flex-col gap-3 mt-4">
                        <div className="flex items-center justify-between border-b border-surface-variant pb-2">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">history_edu</span>
                                Historique Récent
                            </h2>
                            <button className="text-xs text-primary hover:underline uppercase tracking-wider">Archives</button>
                        </div>

                        <div className="flex flex-col gap-2 font-mono text-sm">
                            {recentTransactions.map(tx => (
                                <div key={tx.id} className="flex justify-between items-center py-2 border-b border-surface-variant/50">
                                    <div className="flex gap-3 items-center truncate pr-4">
                                        <span className="text-xs text-on-surface-variant opacity-70 shrink-0">{tx.date}</span>
                                        <span className="text-slate-200 truncate">{tx.label}</span>
                                    </div>
                                    <span className={`${tx.type === 'income' || (tx.type === 'regulation' && tx.amount >= 0) ? 'text-primary' : 'text-bronze'} shrink-0 font-bold`}>
                                        {tx.type === 'income' || (tx.type === 'regulation' && tx.amount >= 0) ? '+' : ''}
                                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(tx.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                </main>
            </div>

            <BottomNav />
        </div>
    );
}
