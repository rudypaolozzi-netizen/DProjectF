import React, { useMemo, useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';
import { useTransactions } from '../context/TransactionsContext';

export default function HistoryPage() {
    const { transactions, deleteTransactionsByYear } = useTransactions();
    const [expandedMonths, setExpandedMonths] = useState([new Date().toISOString().slice(0, 7)]);
    const [isDeleting, setIsDeleting] = useState(false);

    const groupedTransactions = useMemo(() => {
        const groups = {};
        transactions.forEach(tx => {
            const date = new Date(tx.transaction_date);
            const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
            if (!groups[monthKey]) groups[monthKey] = [];
            groups[monthKey].push({
                ...tx,
                formattedDate: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
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

    const cumul = useMemo(() => {
        return transactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
    }, [transactions]);

    const toggleMonth = (monthKey) => {
        setExpandedMonths(prev =>
            prev.includes(monthKey)
                ? prev.filter(m => m !== monthKey)
                : [...prev, monthKey]
        );
    };

    const formatAmount = (amount) => {
        const eurFormatted = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Math.abs(amount));
        return (amount >= 0 ? `+ ` : `- `) + eurFormatted;
    };

    const handleExportCSV = (group) => {
        const headers = ["Date", "Description", "Montant"];
        const rows = group.items.map(tx => [
            tx.transaction_date,
            `"${tx.label.replace(/"/g, '""')}"`, // escape quotes
            tx.amountNum
        ]);

        const csvContent = [
            headers.join(";"),
            ...rows.map(row => row.join(";"))
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `aethervault_export_${group.monthKey}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleYearlyExportAndPurge = async (year) => {
        if (!window.confirm(`Voulez-vous vraiment exporter et effacer TOUTES les données de l'année ${year} ? Cette action est irréversible.`)) {
            return;
        }

        setIsDeleting(true);

        const yearTransactions = transactions.filter(tx => tx.transaction_date.startsWith(year.toString()));

        // 1. Export CSV
        const headers = ["Date", "Description", "Montant"];
        const rows = yearTransactions.map(tx => [
            tx.transaction_date,
            `"${tx.label.replace(/"/g, '""')}"`,
            parseFloat(tx.amount)
        ]);

        const csvContent = [
            headers.join(";"),
            ...rows.map(row => row.join(";"))
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `aethervault_archive_complete_${year}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 2. Delete from DB
        await deleteTransactionsByYear(year);

        setIsDeleting(false);
        alert(`Archives ${year} exportées et supprimées de la base avec succès.`);
    };

    // Check if it's January and if we have transactions from last year
    const isJanuary = new Date().getMonth() === 0;
    const lastYear = new Date().getFullYear() - 1;
    const hasLastYearData = transactions.some(tx => tx.transaction_date.startsWith(lastYear.toString()));

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
                        <p className={`${cumul >= 0 ? 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'} tracking-wider text-4xl font-bold leading-tight`}>
                            {cumul >= 0 ? '+' : '-'} {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Math.abs(cumul))}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-brass text-sm">account_balance_wallet</span>
                            <p className="text-slate-400 text-xs sm:text-sm font-medium uppercase tracking-widest">Cumul Global</p>
                        </div>
                    </div>
                </div>

                {/* Banner: Proposition d'archivage (Janvier seulement) */}
                {isJanuary && hasLastYearData && (
                    <div className="px-4 mb-4">
                        <div className="bg-amber-900/20 border border-amber-600/50 p-4 rounded-xl flex flex-col gap-3">
                            <h3 className="text-amber-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">warning</span>
                                Archivage Annuel
                            </h3>
                            <p className="text-xs text-slate-300">
                                Clôturez l'année {lastYear} : téléchargez un export complet et effacez les anciennes données pour alléger le registre.
                            </p>
                            <button
                                onClick={() => handleYearlyExportAndPurge(lastYear)}
                                disabled={isDeleting}
                                className="w-full bg-amber-600/20 text-amber-500 border border-amber-600/30 font-bold text-xs py-2 rounded uppercase tracking-wider hover:bg-amber-600/40 transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? "Traitement..." : `Archiver et purger ${lastYear}`}
                            </button>
                        </div>
                    </div>
                )}

                {/* Grouped Transactions List */}
                <div className="flex flex-col flex-1 pb-10 px-2">
                    {groupedTransactions.map(group => (
                        <div key={group.monthKey} className="mb-4">
                            <div className="flex items-center gap-2 mb-1">
                                <button
                                    onClick={() => toggleMonth(group.monthKey)}
                                    className="flex-1 flex items-center justify-between p-3 bg-brass/10 border border-brass/30 rounded-lg hover:bg-brass/20 transition-colors"
                                >
                                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-brass">{group.displayMonth}</span>
                                    <span className="material-symbols-outlined text-brass transition-transform duration-300" style={{ transform: expandedMonths.includes(group.monthKey) ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                        expand_more
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleExportCSV(group)}
                                    className="w-12 h-full flex items-center justify-center bg-surface/20 border border-surface-variant rounded-lg text-brass hover:bg-surface/40 transition-colors"
                                    title="Exporter CSV"
                                >
                                    <span className="material-symbols-outlined text-lg">download</span>
                                </button>
                            </div>

                            {expandedMonths.includes(group.monthKey) && (
                                <div className="flex flex-col border-x border-brass/10 bg-white/5 rounded-b-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 mt-1">
                                    {group.items.map(tx => (
                                        <div key={tx.id} className="flex items-center gap-3 px-3 min-h-[70px] py-2 justify-between border-b border-brass/5 hover:bg-brass/5 transition-colors relative group">
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${tx.amountNum >= 0 ? 'bg-green-500' : 'bg-red-500'} opacity-50`}></div>

                                            <div className="w-10 shrink-0 text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold text-center">
                                                {tx.formattedDate}
                                            </div>

                                            <div className="flex flex-col justify-center flex-1 min-w-0 px-2">
                                                <p className="text-slate-900 dark:text-slate-100 text-xs font-bold uppercase truncate">{tx.label}</p>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <p className={`text-sm font-bold tracking-wider ${tx.amountNum >= 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                                    {formatAmount(tx.amountNum)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {groupedTransactions.length === 0 && (
                        <p className="text-center text-slate-500 mt-8 text-sm">Le registre est vide.</p>
                    )}
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
