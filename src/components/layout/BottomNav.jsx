import { NavLink } from 'react-router-dom';

export default function BottomNav() {
    return (
        <nav className="fixed bottom-0 w-full max-w-[480px] bg-surface/95 backdrop-blur-md border-t border-primary/20 z-50 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
            <div className="flex px-2 pt-2 pb-2 gap-1 justify-between">
                <NavLink to="/" className={({ isActive }) => `flex flex-1 flex-col items-center justify-center gap-1 py-1 rounded-lg transition-colors ${isActive ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:text-primary'}`}>
                    <span className="material-symbols-outlined text-2xl">speed</span>
                    <p className="text-[10px] font-medium tracking-widest uppercase text-center w-full truncate px-1">Accueil</p>
                </NavLink>

                <NavLink to="/history" className={({ isActive }) => `flex flex-1 flex-col items-center justify-center gap-1 py-1 rounded-lg transition-colors ${isActive ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:text-primary'}`}>
                    <span className="material-symbols-outlined text-2xl">history_edu</span>
                    <p className="text-[10px] font-medium tracking-widest uppercase text-center w-full truncate px-1">Registre</p>
                </NavLink>

                <NavLink to="/input" className={({ isActive }) => `flex flex-1 flex-col items-center justify-end gap-1 text-primary relative -top-4 transition-transform hover:scale-105`}>
                    <div className="flex h-12 w-12 items-center justify-center bg-background-dark border-2 border-primary rounded-full shadow-[0_0_15px_rgba(19,200,236,0.3),inset_0_0_10px_rgba(19,200,236,0.2)]">
                        <span className="material-symbols-outlined text-[32px] drop-shadow-[0_0_5px_rgba(19,200,236,0.8)]">add</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider">Saisie</span>
                </NavLink>

                <NavLink to="/profile" className={({ isActive }) => `flex flex-1 flex-col items-center justify-center gap-1 py-1 rounded-lg transition-colors ${isActive ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:text-primary'}`}>
                    <span className="material-symbols-outlined text-2xl">person</span>
                    <p className="text-[10px] font-medium tracking-widest uppercase text-center w-full truncate px-1">Profil</p>
                </NavLink>
            </div>
        </nav>
    );
}
