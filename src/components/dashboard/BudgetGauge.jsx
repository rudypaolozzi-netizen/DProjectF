import React from 'react';

export default function BudgetGauge({ remaining, ceiling }) {
    // Calcul du pourcentage, limité entre 0 et 100
    const percentage = Math.min(Math.max((remaining / ceiling) * 100, 0), 100);

    return (
        <section className="flex flex-col items-center justify-center relative py-8">
            {/* Background animations */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <div className="w-64 h-64 rounded-full border-4 border-primary border-dashed animate-[spin_60s_linear_infinite]"></div>
                <div className="absolute w-48 h-48 rounded-full border-2 border-bronze border-dotted"></div>
            </div>

            {/* Gauge content */}
            <div className="relative z-10 flex flex-col items-center bg-surface/50 border border-primary/30 p-8 rounded-full shadow-[0_0_30px_rgba(19,200,236,0.1)] backdrop-blur-sm w-56 h-56 justify-center">
                <p className="text-on-surface-variant text-xs font-medium uppercase tracking-widest mb-2 text-center">
                    Budget Restant
                </p>
                <p className="text-4xl font-bold text-primary drop-shadow-[0_0_10px_rgba(19,200,236,0.8)] tabular-nums">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(remaining)}
                </p>
                <p className="text-xs text-on-surface-variant mt-2 font-mono opacity-80">
                    Plafond: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(ceiling)}
                </p>

                {/* Indicator dot */}
                <div className="absolute bottom-4 w-2 h-2 rounded-full bg-bronze"></div>

                {/* SVG Circle progress */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                    <circle
                        cx="50" cy="50" r="46"
                        fill="none" stroke="rgba(19,200,236,0.1)" strokeWidth="2"
                    />
                    <circle
                        cx="50" cy="50" r="46"
                        fill="none" stroke="currentColor" strokeWidth="3"
                        strokeLinecap="round"
                        className="text-primary drop-shadow-[0_0_5px_currentColor] transition-all duration-1000 ease-out"
                        strokeDasharray={`${percentage * 2.89} 289`}
                    />
                </svg>
            </div>
        </section>
    );
}
