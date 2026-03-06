import { useNavigate } from 'react-router-dom';

export default function PageHeader({ title, showBack = false, rightElement = null }) {
    const navigate = useNavigate();

    return (
        <header className="flex items-center justify-between p-4 sticky top-0 z-10 bg-surface/80 backdrop-blur-md border-b border-surface-variant w-full max-w-[480px]">
            <div className="flex w-12 items-center justify-start">
                {showBack ? (
                    <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center text-primary/80 hover:text-primary transition-colors rounded-full hover:bg-primary/10">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                ) : (
                    <div className="flex size-10 items-center justify-center text-primary">
                        <span className="material-symbols-outlined">menu</span>
                    </div>
                )}
            </div>

            <h1 className="text-lg font-bold leading-tight flex-1 text-center tracking-wide uppercase text-primary drop-shadow-[0_0_8px_rgba(19,200,236,0.5)]">
                {title}
            </h1>

            <div className="flex w-12 items-center justify-end">
                {rightElement || (
                    <div className="size-10"></div>
                )}
            </div>
        </header>
    );
}
