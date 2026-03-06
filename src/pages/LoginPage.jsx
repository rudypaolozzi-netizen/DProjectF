import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { insforge } from '../lib/insforge';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { data, error: loginError } = await insforge.auth.signInWithPassword({
                email,
                password,
            });

            if (loginError) {
                setError(loginError.message || 'Identifiants invalides');
                return;
            }

            if (data?.user) {
                setUser(data.user);
                navigate('/');
            }
        } catch (err) {
            setError('Erreur de connexion');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-vault-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col items-center justify-center overflow-x-hidden">
            <div
                className="relative flex h-full min-h-screen w-full max-w-[480px] flex-col overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: "linear-gradient(rgba(34, 27, 16, 0.8), rgba(34, 27, 16, 0.9)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDjkLzPfT_Sq68rnVIUhT0T_Crn9mEugfei3sHY95ieLBEVmx8sjgScfFTV2zIBnkd8Wgl71Aixlby29Mwi2qkaNHWNHBUHv85Cn0wQmD8qVKPfplXjSm6OlrzuMVUAnCRMiHF0v1jIJx7ZPusxgY6wG2JCDsPJx0atFtKwf6L36FHavXEMlKdWqWwZYu3YOSmuX1kQtjDQYpnIOJngw0uSOCCSF87LCN4Ho-eNBROQuLRqKB8-LL3apxwUBsCk4Ufuu40chic8gS70')" }}
            >
                <div className="flex items-center p-4 pb-2 justify-between z-10">
                    <div className="size-12 shrink-0"></div>
                    <h2 className="text-primary text-lg font-bold leading-tight flex-1 text-center uppercase tracking-widest drop-shadow-[0_0_8px_rgba(244,168,37,0.5)]">AetherVault</h2>
                    <div className="size-12 shrink-0"></div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 w-full relative">
                    <div className="absolute inset-0 m-6 border-[8px] border-primary/30 rounded-full border-dashed animate-[spin_60s_linear_infinite] pointer-events-none"></div>
                    <div className="absolute inset-0 m-10 border-[4px] border-primary/20 rounded-full animate-[spin_40s_linear_infinite_reverse] pointer-events-none"></div>

                    <div className="w-full max-w-sm bg-vault-dark/80 backdrop-blur-md rounded-full aspect-square flex flex-col items-center justify-center p-8 border-4 border-primary/40 shadow-[0_0_30px_rgba(244,168,37,0.2),inset_0_0_20px_rgba(244,168,37,0.1)] relative">
                        <h1 className="text-primary text-xl md:text-2xl font-bold leading-tight tracking-widest text-center mb-6 drop-shadow-[0_0_10px_rgba(244,168,37,0.8)] uppercase">Accès au Coffre-fort</h1>

                        <form onSubmit={handleLogin} className="w-full space-y-4 relative z-20 flex flex-col items-center">
                            <label className="flex flex-col w-full group relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-primary pointer-events-none">
                                    <span className="material-symbols-outlined text-[20px] drop-shadow-[0_0_5px_rgba(244,168,37,0.8)]">person</span>
                                </span>
                                <input
                                    className="form-input flex w-full resize-none overflow-hidden rounded-lg text-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-primary/30 bg-primary/10 h-12 md:h-14 placeholder:text-primary/50 pl-12 pr-4 text-sm md:text-base font-normal leading-normal transition-all shadow-[inset_0_0_10px_rgba(244,168,37,0.1)] focus:shadow-[inset_0_0_15px_rgba(244,168,37,0.3),0_0_10px_rgba(244,168,37,0.2)]"
                                    placeholder="Adresse Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </label>
                            <label className="flex flex-col w-full group relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-primary pointer-events-none">
                                    <span className="material-symbols-outlined text-[20px] drop-shadow-[0_0_5px_rgba(244,168,37,0.8)]">key</span>
                                </span>
                                <input
                                    className="form-input flex w-full resize-none overflow-hidden rounded-lg text-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-primary/30 bg-primary/10 h-12 md:h-14 placeholder:text-primary/50 pl-12 pr-4 text-sm md:text-base font-normal leading-normal transition-all shadow-[inset_0_0_10px_rgba(244,168,37,0.1)] focus:shadow-[inset_0_0_15px_rgba(244,168,37,0.3),0_0_10px_rgba(244,168,37,0.2)]"
                                    placeholder="Mot de passe"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </label>

                            {error && <p className="text-red-500 text-xs font-bold mt-2 bg-red-900/30 px-2 py-1 rounded">{error}</p>}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="mt-6 relative group px-6 py-3 rounded-full flex items-center justify-center border-2 border-primary bg-vault-dark overflow-hidden transition-all hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] z-20 disabled:opacity-50"
                            >
                                <div className="absolute inset-0 bg-primary/20 group-hover:bg-blue-500/20 transition-colors"></div>
                                <span className="material-symbols-outlined text-primary group-hover:text-blue-400 text-2xl z-10 drop-shadow-[0_0_8px_currentColor] mr-2">
                                    {isLoading ? 'hourglass_empty' : 'lock_open'}
                                </span>
                                <span className="text-primary group-hover:text-blue-400 text-sm font-bold tracking-widest uppercase z-10 drop-shadow-[0_0_8px_currentColor]">
                                    {isLoading ? 'Accès...' : 'Se connecter'}
                                </span>
                            </button>
                        </form>
                        <button className="mt-4 text-primary/70 hover:text-primary text-[10px] md:text-xs tracking-widest uppercase font-semibold transition-colors z-20">
                            Mot de passe oublié ?
                        </button>
                    </div>

                    <div className="mt-8 flex flex-col items-center">
                        <p className="text-primary/60 text-xs tracking-widest uppercase mb-4 font-bold">Dérogation biométrique</p>
                        <button className="w-20 h-20 rounded-lg border-2 border-primary/40 bg-vault-dark/50 flex items-center justify-center relative overflow-hidden group hover:border-primary transition-colors shadow-[0_0_15px_rgba(244,168,37,0.1)]">
                            <div className="absolute -bottom-2 -left-2 w-24 h-24 border-b-2 border-l-2 border-primary/20 rounded-bl-xl"></div>
                            <div className="absolute -top-2 -right-2 w-24 h-24 border-t-2 border-r-2 border-primary/20 rounded-tr-xl"></div>
                            <span className="material-symbols-outlined text-4xl text-primary/70 group-hover:text-primary drop-shadow-[0_0_10px_rgba(244,168,37,0.8)] transition-all animate-pulse">fingerprint</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
