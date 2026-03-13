import React, { useState } from 'react';
import { insforge } from '../lib/insforge';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';

export default function ResetDataPage() {
    const { user } = useAuth();
    const [status, setStatus] = useState('');

    const handleReset = async () => {
        if (!user) return;
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer TOUTES vos données (transactions, budgets, catégories) ? Votre profil sera conservé.")) {
            return;
        }

        setStatus('Suppression des transactions...');
        await insforge.database.from('transactions').delete().eq('user_id', user.id);

        setStatus('Suppression des budgets...');
        await insforge.database.from('budgets').delete().eq('user_id', user.id);

        setStatus('Suppression des catégories...');
        await insforge.database.from('categories').delete().eq('user_id', user.id);

        setStatus('Toutes les données ont été réinitialisées avec succès !');
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col items-center">
            <div className="w-full max-w-[480px] min-h-screen flex flex-col relative overflow-hidden bg-steampunk pb-20">
                <PageHeader title="Outils Développeur" />
                <main className="flex-1 p-6 flex flex-col gap-6 items-center justify-center">
                    <p className="text-center text-slate-400 mb-8">
                        Cette page est temporaire pour effectuer le reset demandé.
                    </p>
                    <button
                        onClick={handleReset}
                        className="w-full py-4 rounded-lg bg-red-900/50 border border-red-500 text-red-100 font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors"
                    >
                        Réinitialiser toutes les données
                    </button>
                    {status && (
                        <p className="mt-4 font-mono text-amber-500 text-center">{status}</p>
                    )}
                </main>
            </div>
            <BottomNav />
        </div>
    );
}
