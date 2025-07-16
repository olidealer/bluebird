import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useTaxData from '../hooks/useTaxData';
import { Trash2, Upload } from 'lucide-react';

const ExpensesTable: React.FC = () => {
  const { t } = useTranslation();
  const { expenses, addExpenses, deleteExpense, loading } = useTaxData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addExpenses(e.target.files);
      // Reset file input to allow uploading the same file again
      e.target.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalVatCredit = expenses.reduce((acc, curr) => acc + curr.vatAmount, 0);

  return (
    <div className="p-4 sm:p-6 bg-card rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold text-card-foreground">{t('expenses.title')}</h2>
        <input
          type="file"
          multiple
          accept=".xml"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={handleUploadClick}
          className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-colors w-full sm:w-auto"
        >
          <Upload className="w-4 h-4 mr-2" />
          {t('expenses.upload')}
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left responsive-table">
          <thead className="bg-muted">
            <tr>
              <th className="p-3">{t('expenses.issuer')}</th>
              <th className="p-3">{t('expenses.date')}</th>
              <th className="p-3 text-right">{t('expenses.total')}</th>
              <th className="p-3 text-right">{t('expenses.vat')}</th>
              <th className="p-3">{t('expenses.filename')}</th>
              <th className="p-3 text-center">{t('expenses.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center p-4">Loading...</td></tr>
            ) : expenses.length === 0 ? (
              <tr><td colSpan={6} className="text-center p-4 text-muted-foreground">{t('expenses.empty')}</td></tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-border md:border-b-0">
                  <td data-label={t('expenses.issuer')} className="md:p-3 font-medium md:font-normal">{expense.issuerName}</td>
                  <td data-label={t('expenses.date')} className="md:p-3">{new Date(expense.date).toLocaleDateString()}</td>
                  <td data-label={t('expenses.total')} className="md:p-3 md:text-right">{expense.totalAmount.toFixed(2)}</td>
                  <td data-label={t('expenses.vat')} className="md:p-3 md:text-right">{expense.vatAmount.toFixed(2)}</td>
                  <td data-label={t('expenses.filename')} className="md:p-3 truncate">{expense.fileName}</td>
                  <td className="md:p-3 md:text-center actions-cell">
                    <button onClick={() => window.confirm(t('general.confirmDelete')) && deleteExpense(expense.id)} className="text-destructive hover:text-destructive/80 p-2 rounded-md"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
           <tfoot className="hidden md:table-footer-group">
             <tr className="font-bold bg-secondary">
               <td className="p-3" colSpan={2}>{t('expenses.total')}</td>
               <td className="p-3 text-right">{totalExpenses.toFixed(2)}</td>
               <td className="p-3 text-right">{totalVatCredit.toFixed(2)}</td>
               <td colSpan={2}></td>
             </tr>
           </tfoot>
        </table>
        {expenses.length > 0 && (
          <div className="md:hidden mt-4 p-4 bg-secondary rounded-lg space-y-2 font-bold">
              <div className="flex justify-between">
                  <span>{t('expenses.total')} ({t('expenses.total')})</span>
                  <span>{totalExpenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                  <span>{t('expenses.total')} ({t('expenses.vat')})</span>
                  <span>{totalVatCredit.toFixed(2)}</span>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensesTable;
