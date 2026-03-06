import { useState, useEffect, useCallback } from 'react';
import { insforge } from '../lib/insforge';
import { useAuth } from '../context/AuthContext';

export function useBudget(month, year) {
    const { user } = useAuth();
    const [budget, setBudget] = useState(null);
    const [loading, setLoading] = useState(true);

    const currentMonth = month || new Date().getMonth() + 1;
    const currentYear = year || new Date().getFullYear();

    const fetchBudget = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const { data, error } = await insforge.database
            .from('budgets')
            .select('*')
            .eq('month', currentMonth)
            .eq('year', currentYear)
            .maybeSingle();

        if (!error && data) {
            setBudget(data);
        } else {
            // Create a default presentation budget
            setBudget({ ceiling: 0, month: currentMonth, year: currentYear });
        }
        setLoading(false);
    }, [user, currentMonth, currentYear]);

    useEffect(() => {
        fetchBudget();
    }, [fetchBudget]);

    const setCeiling = async (ceilingAmount) => {
        if (!user) return;
        // To properly update, we should check if one exists first, then insert or update.
        const { data: existing } = await insforge.database
            .from('budgets')
            .select('id')
            .eq('month', currentMonth)
            .eq('year', currentYear)
            .maybeSingle();

        if (existing) {
            await insforge.database
                .from('budgets')
                .update({ ceiling: parseFloat(ceilingAmount) })
                .eq('id', existing.id);
        } else {
            await insforge.database
                .from('budgets')
                .insert({
                    user_id: user.id,
                    month: currentMonth,
                    year: currentYear,
                    ceiling: parseFloat(ceilingAmount)
                });
        }
        fetchBudget();
    };

    return { budget, loading, refresh: fetchBudget, setCeiling };
}
