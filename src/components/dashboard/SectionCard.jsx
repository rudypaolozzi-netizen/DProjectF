import React from 'react';

export default function SectionCard({ title, subtitle, amount, icon, type = 'neutral' }) {
    // Styles based on type
    const typeStyles = {
        fixed: {
            border: 'border-surface-variant',
            accent: 'bg-bronze',
            iconBg: 'bg-background-dark border-bronze/50 text-bronze',
            amountText: 'text-bronze',
            prefix: '-'
        },
        income: {
            border: 'border-primary/30 shadow-[0_0_15px_rgba(19,200,236,0.05)]',
            accent: 'bg-primary',
            iconBg: 'bg-background-dark border-primary/50 text-primary',
            amountText: 'text-primary',
            prefix: '+'
        },
        variable: {
            border: 'border-surface-variant',
            accent: 'bg-slate-500',
            iconBg: 'bg-background-dark border-slate-500/50 text-slate-400',
            amountText: 'text-slate-300',
            prefix: '-'
        }
    };

    const style = typeStyles[type] || typeStyles.fixed;
    const formattedAmount = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

    return (
        <div className={`flex items-center justify-between p-4 rounded-xl bg-surface border ${style.border} relative overflow-hidden group`}>
            {/* Left accent line */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.accent}`}></div>

            <div className="flex items-center gap-4 relative z-10 w-full">
                {/* Icon Circle */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${style.iconBg}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-bold text-slate-100 truncate">{title}</h3>
                    <p className="text-xs text-on-surface-variant truncate">{subtitle}</p>
                </div>

                {/* Amount */}
                <div className="text-right shrink-0">
                    <p className={`font-mono font-bold ${style.amountText}`}>
                        {style.prefix} {formattedAmount}
                    </p>
                </div>
            </div>
        </div>
    );
}
