import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Invoice, IncomeRecord, MonthlyData, GeneratedPdf, TaxCalculations } from '../types';
import { IVA_RATE_GENERAL, RENTA_DEDUCTION_RATE, RENTA_TAX_RATE } from '../constants';

interface AppState {
    monthlyData: { [key: string]: MonthlyData };
    generatedPdfs: GeneratedPdf[];
}

interface TaxDataContextType {
    getMonthlyData: (yearMonth: string) => MonthlyData;
    addIncome: (yearMonth: string, income: Omit<IncomeRecord, 'id'>) => void;
    addExpense: (yearMonth: string, expense: Omit<Invoice, 'id'>) => void;
    deleteIncome: (yearMonth: string, incomeId: string) => void;
    deleteExpense: (yearMonth: string, expenseId: string) => void;
    getGeneratedPdfs: () => GeneratedPdf[];
    addGeneratedPdf: (pdfData: Omit<GeneratedPdf, 'id'>) => void;
    calculateTaxes: (monthlyData: MonthlyData) => TaxCalculations;
}

const TaxDataContext = createContext<TaxDataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'rental_property_tax_data';

export const TaxDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AppState>({
        monthlyData: {},
        generatedPdfs: [],
    });

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                // Basic validation to prevent crashes on bad data
                if (parsedData.monthlyData && parsedData.generatedPdfs) {
                    setState(parsedData);
                }
            }
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.error("Failed to save data to localStorage", error);
        }
    }, [state]);

    const getMonthlyData = useCallback((yearMonth: string): MonthlyData => {
        return state.monthlyData[yearMonth] || { income: [], expenses: [] };
    }, [state.monthlyData]);

    const updateMonthData = (yearMonth: string, updater: (prevData: MonthlyData) => MonthlyData) => {
        setState(prev => ({
            ...prev,
            monthlyData: {
                ...prev.monthlyData,
                [yearMonth]: updater(prev.monthlyData[yearMonth] || { income: [], expenses: [] })
            }
        }));
    };

    const addIncome = (yearMonth: string, income: Omit<IncomeRecord, 'id'>) => {
        const newIncome = { ...income, id: crypto.randomUUID() };
        updateMonthData(yearMonth, prevData => ({ ...prevData, income: [...prevData.income, newIncome] }));
    };

    const addExpense = (yearMonth: string, expense: Omit<Invoice, 'id'>) => {
        const newExpense = { ...expense, id: crypto.randomUUID() };
        updateMonthData(yearMonth, prevData => ({ ...prevData, expenses: [...prevData.expenses, newExpense] }));
    };
    
    const deleteIncome = (yearMonth: string, incomeId: string) => {
        updateMonthData(yearMonth, prevData => ({ ...prevData, income: prevData.income.filter(i => i.id !== incomeId) }));
    };

    const deleteExpense = (yearMonth: string, expenseId: string) => {
        updateMonthData(yearMonth, prevData => ({ ...prevData, expenses: prevData.expenses.filter(e => e.id !== expenseId) }));
    };

    const getGeneratedPdfs = useCallback(() => {
        return state.generatedPdfs.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
    }, [state.generatedPdfs]);

    const addGeneratedPdf = (pdfData: Omit<GeneratedPdf, 'id'>) => {
        const newPdf = { ...pdfData, id: crypto.randomUUID() };
        setState(prev => ({
            ...prev,
            generatedPdfs: [newPdf, ...prev.generatedPdfs.filter(p => p.yearMonth !== newPdf.yearMonth)] // Add or replace
        }));
    };
    
    const calculateTaxes = useCallback((monthlyData: MonthlyData): TaxCalculations => {
        const grossIncome = monthlyData.income.reduce((sum, i) => sum + i.totalAmount, 0);
        
        const ivaDebit = monthlyData.income.reduce((sum, i) => {
            return i.includesIva 
                ? sum + (i.totalAmount - i.totalAmount / (1 + IVA_RATE_GENERAL))
                : sum + (i.totalAmount * IVA_RATE_GENERAL);
        }, 0);

        const ivaCredit = monthlyData.expenses.reduce((sum, e) => sum + e.ivaAmount, 0);
        const netIva = Math.max(0, ivaDebit - ivaCredit);

        const fixedDeduction = grossIncome * RENTA_DEDUCTION_RATE;
        const netTaxableIncome = Math.max(0, grossIncome - fixedDeduction);
        const rentaTax = netTaxableIncome * RENTA_TAX_RATE;

        return { ivaDebit, ivaCredit, netIva, grossIncome, fixedDeduction, netTaxableIncome, rentaTax };
    }, []);

    const value = {
        getMonthlyData,
        addIncome,
        addExpense,
        deleteIncome,
        deleteExpense,
        getGeneratedPdfs,
        addGeneratedPdf,
        calculateTaxes
    };

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
