import { useState, useEffect, useCallback } from 'react';
import { insforge } from '../lib/insforge';
import { useAuth } from '../context/AuthContext';

export function useTransactions() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const { data, error } = await insforge.database
            .from('transactions')
            .select('*, categories(*)')
            .order('transaction_date', { ascending: false });

        if (!error && data) {
            setTransactions(data);
        } else if (error) {
            console.error('Error fetching transactions:', error);
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const addTransaction = async ({ label, amount, type, category_id, is_recurring }) => {
        if (!user) return null;
        const { data, error } = await insforge.database
            .from('transactions')
            .insert({
                user_id: user.id,
                label,
                amount: parseFloat(amount),
                type,
                category_id,
                is_recurring: !!is_recurring,
                transaction_date: new Date().toISOString().split('T')[0]
            })
            .select();

        if (!error) {
            fetchTransactions();
            return data?.[0];
        }
        console.error('Error adding transaction:', error);
        return null;
    };

    return { transactions, loading, addTransaction, refresh: fetchTransactions };
}
