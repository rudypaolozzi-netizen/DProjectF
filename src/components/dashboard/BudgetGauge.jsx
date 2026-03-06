import React from 'react';

export default function BudgetGauge({ remaining, totalIncome }) {
    const isOverBudget = remaining < 0;

    // Normal mode (Green): remaining / totalIncome
    // Over budget mode (Red): abs(remaining) / totalIncome (representing debt growth)
    const displayAmount = Math.abs(remaining);

    // Capacity logic: totalIncome is the 100% mark.
    // If credit: starts at 100% (green full) and decreases.
    // If debt: starts at 0% (red empty) and increases.
    let percentage = 0;
    if (!isOverBudget) {
        // Decreasing from full green
        percentage = totalIncome > 0 ? (remaining / totalIncome) * 100 : 0;
    } else {
        // Increasing red debt
        percentage = totalIncome > 0 ? (displayAmount / totalIncome) * 100 : 100;
    }

    const limitedPercentage = Math.min(Math.max(percentage, 0), 100);
    const dashOffset = 289 - (limitedPercentage * 2.89);

    const mainColor = isOverBudget ? 'text-red-500' : 'text-primary';
    const glowColor = isOverBudget ? 'rgba(239,68,68,0.5)' : 'rgba(19,200,236,0.5)';

    return (
        <section className="flex flex-col items-center justify-center relative py-8">
            {/* Background animations */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <div className={`w-64 h-64 rounded-full border-4 ${isOverBudget ? 'border-red-500' : 'border-primary'} border-dashed animate-[spin_60s_linear_infinite]`}></div>
                <div className="absolute w-48 h-48 rounded-full border-2 border-bronze border-dotted"></div>
            </div>

            {/* Gauge content */}
            <div className={`relative z-10 flex flex-col items-center bg-surface/50 border ${isOverBudget ? 'border-red-500/50' : 'border-primary/30'} p-8 rounded-full shadow-[0_0_30px_${glowColor}] backdrop-blur-sm w-56 h-56 justify-center transition-colors duration-500`}>
                <p className="text-on-surface-variant text-xs font-medium uppercase tracking-widest mb-2 text-center">
                    {isOverBudget ? 'Déficit Aether' : 'Budget Restant'}
                </p>
                <p className={`text-4xl font-bold ${mainColor} drop-shadow-[0_0_10px_${glowColor}] tabular-nums transition-colors duration-500`}>
                    {isOverBudget ? '-' : ''}{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(displayAmount)}
                </p>
                <p className="text-xs text-on-surface-variant mt-2 font-mono opacity-80 uppercase tracking-tighter">
                    Capacité: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(totalIncome)}
                </p>

                {/* SVG Circle progress */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                    {/* Background track */}
                    <circle
                        cx="50" cy="50" r="46"
                        fill="none" stroke={isOverBudget ? "rgba(239,68,68,0.1)" : "rgba(19,200,236,0.1)"} strokeWidth="2"
                    />
                    {/* Progress arc */}
                    <circle
                        cx="50" cy="50" r="46"
                        fill="none" stroke="currentColor" strokeWidth="4"
                        strokeLinecap="round"
                        className={`${mainColor} drop-shadow-[0_0_8px_currentColor] transition-all duration-1000 ease-in-out`}
                        strokeDasharray="289"
                        strokeDashoffset={dashOffset}
                    />
                </svg>

                {/* Mechanical needle decoration */}
                <div
                    className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-1000 ease-in-out`}
                    style={{ transform: `rotate(${(limitedPercentage * 3.6) - 90}deg)` }}
                >
                    <div className={`w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-bronze ml-24 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)]`}></div>
                </div>
            </div>
        </section>
    );
}
