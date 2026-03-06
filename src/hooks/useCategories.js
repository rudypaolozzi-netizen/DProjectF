import { useState, useEffect } from 'react';
import { insforge } from '../lib/insforge';
import { useAuth } from '../context/AuthContext';

export function useCategories() {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchCategories = async () => {
            setLoading(true);
            const { data, error } = await insforge.database
                .from('categories')
                .select('*')
                .order('name', { ascending: true });

            if (!error && data) {
                setCategories(data);
            }
            setLoading(false);
        };
        fetchCategories();
    }, [user]);

    return { categories, loading };
}
