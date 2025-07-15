export interface Invoice {
  id: string;
  provider: string;
  date: string;
  totalAmount: number;
  ivaAmount: number;
  ivaRate: number;
  description: string;
  category: string;
}

export interface IncomeRecord {
  id: string;
  totalAmount: number;
  includesIva: boolean;
  description?: string;
}

export interface MonthlyData {
  income: IncomeRecord[];
  expenses: Invoice[];
}

export interface TaxCalculations {
  ivaDebit: number;
  ivaCredit: number;
  netIva: number;
  grossIncome: number;
  fixedDeduction: number;
  netTaxableIncome: number;
  rentaTax: number;
}

export interface GeneratedPdf {
  id: string;
  yearMonth: string;
  fileName: string;
  generatedAt: string;
}
