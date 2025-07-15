
import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { Invoice, IncomeRecord, MonthlyData, GeneratedPdf, TaxCalculations } from '../types';
import { IVA_RATE_GENERAL, RENTA_DEDUCTION_RATE, RENTA_TAX_RATE } from '../constants';
import { api } from '../services/api';

interface TaxDataContextType {
    monthlyData: { [key: string]: MonthlyData };
    generatedPdfs: GeneratedPdf[];
    fetchMonthlyData: (year: number, month: number) => Promise<void>;
    addIncome: (yearMonth: string, income: Omit<IncomeRecord, 'id'>) => Promise<void>;
    addExpensesFromFiles: (yearMonth: string, files: File[]) => Promise<{successCount: number, errorCount: number}>;
    deleteIncome: (yearMonth: string, incomeId: string) => Promise<void>;
    deleteExpense: (yearMonth: string, expenseId: string) => Promise<void>;
    fetchGeneratedPdfs: () => Promise<void>;
    addGeneratedPdf: (yearMonth: string, fileName: string) => Promise<void>;
    calculateTaxes: (monthlyData: MonthlyData) => TaxCalculations;
    getMonthlyData: (yearMonth: string) => MonthlyData;
    isLoading: boolean;
}

const TaxDataContext = createContext<TaxDataContextType | undefined>(undefined);

export const TaxDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [monthlyData, setMonthlyData] = useState<{ [key: string]: MonthlyData }>({});
    const [generatedPdfs, setGeneratedPdfs] = useState<GeneratedPdf[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getMonthlyDataFromState = useCallback((yearMonth: string): MonthlyData => {
        return monthlyData[yearMonth] || { income: [], expenses: [] };
    }, [monthlyData]);
    
    const fetchMonthlyData = async (year: number, month: number) => {
        setIsLoading(true);
        try {
            const { data } = await api.get(`/taxes/${year}/${month}`);
            const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
            setMonthlyData(prev => ({...prev, [yearMonth]: data }));
        } catch (error) {
            console.error("Failed to fetch monthly data", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const fetchGeneratedPdfs = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/pdfs');
            setGeneratedPdfs(data);
        } catch (error) {
            console.error("Failed to fetch generated PDFs", error);
        } finally {
            setIsLoading(false);
        }
    };

    const addIncome = async (yearMonth: string, income: Omit<IncomeRecord, 'id'>) => {
        const { data: newIncome } = await api.post(`/taxes/${yearMonth}/income`, income);
        setMonthlyData(prev => ({
            ...prev,
            [yearMonth]: {
                ...prev[yearMonth],
                income: [newIncome, ...(prev[yearMonth]?.income || [])]
            }
        }));
    };
    
    const addExpensesFromFiles = async (yearMonth: string, files: File[]) => {
        const formData = new FormData();
        files.forEach(file => formData.append('invoices', file));

        const { data } = await api.post(`/taxes/${yearMonth}/expenses`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (data.addedExpenses?.length > 0) {
            setMonthlyData(prev => ({
                ...prev,
                [yearMonth]: {
                    ...prev[yearMonth],
                    expenses: [...data.addedExpenses, ...(prev[yearMonth]?.expenses || [])]
                }
            }));
        }
        return { successCount: data.successCount, errorCount: data.errorCount };
    };

    const deleteIncome = async (yearMonth: string, incomeId: string) => {
        await api.delete(`/taxes/income/${incomeId}`);
        setMonthlyData(prev => ({
            ...prev,
            [yearMonth]: {
                ...prev[yearMonth],
                income: prev[yearMonth].income.filter(i => i.id !== incomeId)
            }
        }));
    };

    const deleteExpense = async (yearMonth: string, expenseId: string) => {
        await api.delete(`/taxes/expenses/${expenseId}`);
        setMonthlyData(prev => ({
            ...prev,
            [yearMonth]: {
                ...prev[yearMonth],
                expenses: prev[yearMonth].expenses.filter(e => e.id !== expenseId)
            }
        }));
    };

    const addGeneratedPdf = async (yearMonth: string, fileName: string) => {
        const { data: newPdf } = await api.post('/pdfs', { yearMonth, fileName });
        setGeneratedPdfs(prev => [newPdf, ...prev.filter(p => p.yearMonth !== yearMonth)]);
    };

    const calculateTaxes = useCallback((data: MonthlyData): TaxCalculations => {
        const grossIncome = data.income.reduce((sum, i) => sum + i.totalAmount, 0);
        
        const ivaDebit = data.income.reduce((sum, i) => {
            return i.includesIva 
                ? sum + (i.totalAmount - i.totalAmount / (1 + IVA_RATE_GENERAL))
                : sum + (i.totalAmount * IVA_RATE_GENERAL);
        }, 0);

        const ivaCredit = data.expenses.reduce((sum, e) => sum + e.ivaAmount, 0);
        const netIva = Math.max(0, ivaDebit - ivaCredit);

        const fixedDeduction = grossIncome * RENTA_DEDUCTION_RATE;
        const netTaxableIncome = Math.max(0, grossIncome - fixedDeduction);
        const rentaTax = netTaxableIncome * RENTA_TAX_RATE;

        return { ivaDebit, ivaCredit, netIva, grossIncome, fixedDeduction, netTaxableIncome, rentaTax };
    }, []);

    const value = useMemo(() => ({
        monthlyData,
        generatedPdfs,
        fetchMonthlyData,
        addIncome,
        addExpensesFromFiles,
        deleteIncome,
        deleteExpense,
        fetchGeneratedPdfs,
        addGeneratedPdf,
        calculateTaxes,
        getMonthlyData: getMonthlyDataFromState,
        isLoading,
    }), [monthlyData, generatedPdfs, isLoading, calculateTaxes, getMonthlyDataFromState]);

    return (
        <TaxDataContext.Provider value={value}>
            {children}
        </TaxDataContext.Provider>
    );
};

export const useTaxData = (): TaxDataContextType => {
    const context = useContext(TaxDataContext);
    if (!context) {
        throw new Error('useTaxData must be used within a TaxDataProvider');
    }
    return context;
};
