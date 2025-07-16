
export interface User {
  id: string;
  username: string;
}

export interface AppearanceSettings {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'es';
}

export interface AuthState {
  token: string | null;
  user: User | null;
  settings: AppearanceSettings | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface IncomeRecord {
  id: string;
  description: string;
  date: string;
  amount: number;
  vat: number;
}

export interface Invoice {
  id: string;
  issuerName: string;
  date: string;
  totalAmount: number;
  vatAmount: number;
  fileName: string;
}

export interface TaxDataContextType {
    incomes: IncomeRecord[];
    expenses: Invoice[];
    loading: boolean;
    error: string | null;
    currentMonth: number;
    currentYear: number;
    setCurrentMonth: (month: number) => void;
    setCurrentYear: (year: number) => void;
    fetchData: (year: number, month: number) => Promise<void>;
    addIncome: (income: Omit<IncomeRecord, 'id'>) => Promise<void>;
    deleteIncome: (id: string) => Promise<void>;
    addExpenses: (files: FileList) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
}