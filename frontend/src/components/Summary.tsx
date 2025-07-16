import React from 'react';
import { useTranslation } from 'react-i18next';
import useTaxData from '../hooks/useTaxData';
import { generatePdf } from '../services/pdfGenerator';
import { FileDown } from 'lucide-react';

const Summary: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { incomes, expenses, currentMonth, currentYear } = useTaxData();

  const grossIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.totalAmount, 0);
  const vatDebit = incomes.reduce((sum, item) => sum + item.vat, 0);
  const vatCredit = expenses.reduce((sum, item) => sum + item.vatAmount, 0);
  const vatPayable = Math.max(0, vatDebit - vatCredit);

  // Rental Income Tax Logic
  const fixedDeductionRate = 0.15;
  const incomeTaxRate = 0.15;
  const taxableBase = grossIncome * (1 - fixedDeductionRate);
  const incomeTaxPayable = taxableBase * incomeTaxRate;
  
  const summaryData = { grossIncome, totalExpenses, vatDebit, vatCredit, vatPayable, taxableBase, incomeTaxPayable };

  const handleGeneratePdf = () => {
    generatePdf(incomes, expenses, summaryData, { month: currentMonth, year: currentYear }, t, i18n.language);
  };
  
  const renderRow = (label: string, value: number, isBold: boolean = false) => (
      <div className={`flex justify-between items-center py-2 px-3 ${isBold ? 'font-bold text-lg' : ''}`}>
          <span>{label}</span>
          <span>{value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
  );

  return (
    <div className="p-6 bg-card rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-card-foreground">{t('summary.title')}</h2>
        <button
          onClick={handleGeneratePdf}
          className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <FileDown className="w-4 h-4 mr-2" />
          {t('summary.generatePdf')}
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="bg-secondary rounded-lg">
            {renderRow(t('summary.grossIncome'), grossIncome)}
            {renderRow(t('summary.deductibleExpenses'), totalExpenses)}
        </div>
        
        <div className="bg-secondary rounded-lg pt-2">
            <h3 className="font-semibold text-center text-muted-foreground">VAT</h3>
            {renderRow(t('summary.vatDebit'), vatDebit)}
            {renderRow(t('summary.vatCredit'), vatCredit)}
            <div className="border-t border-border my-1"></div>
            {renderRow(t('summary.vatPayable'), vatPayable, true)}
        </div>

        <div className="bg-secondary rounded-lg pt-2">
            <h3 className="font-semibold text-center text-muted-foreground">Income Tax</h3>
            {renderRow(t('summary.taxableBaseIncome'), taxableBase)}
            <p className="text-xs text-muted-foreground px-3">{t('summary.fixedDeductionNote')}</p>
            <div className="border-t border-border my-1"></div>
            {renderRow(t('summary.incomeTaxPayable'), incomeTaxPayable, true)}
            <p className="text-xs text-muted-foreground px-3">{t('summary.incomeTaxNote')}</p>
        </div>
      </div>
    </div>
  );
};

export default Summary;