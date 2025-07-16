
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import api from '../services/api';
import { IncomeRecord, Invoice, TaxDataContextType } from '../types';

export const TaxDataContext = createContext<TaxDataContextType | undefined>(undefined);

export const TaxDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [incomes, setIncomes] = useState<IncomeRecord[]>([]);
    const [expenses, setExpenses] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const fetchData = useCallback(async (year: number, month: number) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get('/tax-data', {
                params: { year, month },
            });
            setIncomes(data.incomes || []);
            setExpenses(data.expenses || []);
        } catch (err) {
            console.error('Failed to fetch tax data', err);
            setError('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(currentYear, currentMonth);
    }, [currentYear, currentMonth, fetchData]);

    const addIncome = async (income: Omit<IncomeRecord, 'id'>) => {
        try {
            const { data } = await api.post('/tax-data/incomes', income);
            setIncomes(prev => [...prev, data]);
        } catch (err) {
            console.error('Failed to add income', err);
            setError('Failed to add income.');
        }
    };

    const deleteIncome = async (id: string) => {
        try {
            await api.delete(`/tax-data/incomes/${id}`);
            setIncomes(prev => prev.filter(inc => inc.id !== id));
        } catch (err) {
            console.error('Failed to delete income', err);
            setError('Failed to delete income.');
        }
    };

    const addExpenses = async (files: FileList) => {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('invoices', files[i]);
        }
        try {
            const { data } = await api.post('/tax-data/expenses', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setExpenses(prev => [...prev, ...data.createdInvoices]);
        } catch (err) {
            console.error('Failed to upload expenses', err);
            setError('Failed to upload expenses.');
        }
    };

    const deleteExpense = async (id: string) => {
        try {
            await api.delete(`/tax-data/expenses/${id}`);
            setExpenses(prev => prev.filter(exp => exp.id !== id));
        } catch (err) {
            console.error('Failed to delete expense', err);
            setError('Failed to delete expense.');
        }
    };

    const value = {
        incomes,
        expenses,
        loading,
        error,
        currentMonth,
        currentYear,
        setCurrentMonth,
        setCurrentYear,
        fetchData,
        addIncome,
        deleteIncome,
        addExpenses,
        deleteExpense,
    };

    return (
        <TaxDataContext.Provider value={value}>
            {children}
        </TaxDataContext.Provider>
    );
};