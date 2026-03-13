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
            .select('*')
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

    const addTransaction = async ({ label, amount }) => {
        if (!user) return null;
        const { data, error } = await insforge.database
            .from('transactions')
            .insert({
                user_id: user.id,
                label,
                amount: parseFloat(amount),
                type: 'entry',
                category_id: null,
                is_recurring: false,
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

    const deleteTransactionsByYear = async (year) => {
        if (!user) return false;
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        const { error } = await insforge.database
            .from('transactions')
            .delete()
            .gte('transaction_date', startDate)
            .lte('transaction_date', endDate);

        if (!error) {
            fetchTransactions();
            return true;
        }
        console.error('Error deleting transactions:', error);
        return false;
    };

    const deleteAllTransactions = async () => {
        if (!user) return false;
        const { error } = await insforge.database
            .from('transactions')
            .delete()
            .eq('user_id', user.id);

        if (!error) {
            setTransactions([]);
            return true;
        }
        console.error('Error deleting all transactions:', error);
        return false;
    };

    return { transactions, loading, addTransaction, deleteTransactionsByYear, deleteAllTransactions, refresh: fetchTransactions };
}
