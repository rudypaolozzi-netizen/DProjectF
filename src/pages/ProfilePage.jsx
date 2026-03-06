import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { insforge } from '../lib/insforge';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';

export default function ProfilePage() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await insforge.auth.signOut();
        setUser(null);
        navigate('/login');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col items-center">
            <div className="w-full max-w-[480px] min-h-screen flex flex-col relative overflow-hidden bg-steampunk pb-20">
                <PageHeader title="Profil Utilisateur" />
                <main className="flex-1 p-6 flex flex-col gap-6">
                    <div className="bg-surface border border-surface-variant p-6 rounded-xl flex flex-col items-center gap-4">
                        <div className="w-24 h-24 rounded-full bg-background-dark border-4 border-primary flex items-center justify-center text-primary text-4xl shadow-[0_0_15px_rgba(19,200,236,0.3),inset_0_0_10px_rgba(19,200,236,0.2)]">
                            <span className="material-symbols-outlined text-[48px] drop-shadow-[0_0_5px_rgba(19,200,236,0.8)]">person</span>
                        </div>
                        <div className="text-center">
                            <h2 className="font-bold text-xl text-primary drop-shadow-[0_0_5px_rgba(19,200,236,0.5)]">{user?.email || 'Aéronaute Inconnu'}</h2>
                            <p className="text-sm text-on-surface-variant mt-1">Membre de l'AetherVault</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full py-4 rounded-lg bg-red-900/20 border border-red-500/50 text-red-500 font-bold tracking-widest uppercase hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Déconnexion
                    </button>
                </main>
            </div>
            <BottomNav />
        </div>
    );
}
