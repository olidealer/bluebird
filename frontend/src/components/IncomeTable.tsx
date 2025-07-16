import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useTaxData from '../hooks/useTaxData';
import { Trash2, PlusCircle } from 'lucide-react';

const IncomeTable: React.FC = () => {
  const { t } = useTranslation();
  const { incomes, addIncome, deleteIncome, loading } = useTaxData();
  const [showForm, setShowForm] = useState(false);
  const [newIncome, setNewIncome] = useState({ description: '', date: '', amount: '', vat: '' });

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newIncome.description && newIncome.date && newIncome.amount) {
      await addIncome({
        description: newIncome.description,
        date: newIncome.date,
        amount: parseFloat(newIncome.amount),
        vat: parseFloat(newIncome.vat || '0'),
      });
      setNewIncome({ description: '', date: '', amount: '', vat: '' });
      setShowForm(false);
    }
  };
  
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalVat = incomes.reduce((acc, curr) => acc + curr.vat, 0);

  return (
    <div className="p-4 sm:p-6 bg-card rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold text-card-foreground">{t('incomes.title')}</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-colors w-full sm:w-auto"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          {t('incomes.add')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddIncome} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 border border-border rounded-lg">
          <input
            type="text"
            placeholder={t('incomes.description')}
            value={newIncome.description}
            onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
            className="col-span-1 md:col-span-2 p-2 bg-input border border-border rounded-md"
            required
          />
          <input
            type="date"
            value={newIncome.date}
            onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
            className="p-2 bg-input border border-border rounded-md"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder={t('incomes.amount')}
            value={newIncome.amount}
            onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
            className="p-2 bg-input border border-border rounded-md"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder={t('incomes.vat')}
            value={newIncome.vat}
            onChange={(e) => setNewIncome({ ...newIncome, vat: e.target.value })}
            className="p-2 bg-input border border-border rounded-md"
          />
          <button type="submit" className="col-span-1 md:col-span-5 px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors">{t('general.save')}</button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left responsive-table">
          <thead className="bg-muted">
            <tr>
              <th className="p-3">{t('incomes.description')}</th>
              <th className="p-3">{t('incomes.date')}</th>
              <th className="p-3 text-right">{t('incomes.amount')}</th>
              <th className="p-3 text-right">{t('incomes.vat')}</th>
              <th className="p-3 text-center">{t('incomes.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center p-4">Loading...</td></tr>
            ) : incomes.length === 0 ? (
              <tr><td colSpan={5} className="text-center p-4 text-muted-foreground">{t('incomes.empty')}</td></tr>
            ) : (
              incomes.map((income) => (
                <tr key={income.id} className="border-b border-border md:border-b-0">
                  <td data-label={t('incomes.description')} className="md:p-3 font-medium md:font-normal">{income.description}</td>
                  <td data-label={t('incomes.date')} className="md:p-3">{new Date(income.date).toLocaleDateString()}</td>
                  <td data-label={t('incomes.amount')} className="md:p-3 md:text-right">{income.amount.toFixed(2)}</td>
                  <td data-label={t('incomes.vat')} className="md:p-3 md:text-right">{income.vat.toFixed(2)}</td>
                  <td className="md:p-3 md:text-center actions-cell">
                    <button onClick={() => window.confirm(t('general.confirmDelete')) && deleteIncome(income.id)} className="text-destructive hover:text-destructive/80 p-2 rounded-md"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
           <tfoot className="hidden md:table-footer-group">
             <tr className="font-bold bg-secondary">
               <td className="p-3" colSpan={2}>{t('incomes.total')}</td>
               <td className="p-3 text-right">{totalIncome.toFixed(2)}</td>
               <td className="p-3 text-right">{totalVat.toFixed(2)}</td>
               <td className="p-3"></td>
             </tr>
           </tfoot>
        </table>
        {incomes.length > 0 && (
          <div className="md:hidden mt-4 p-4 bg-secondary rounded-lg space-y-2 font-bold">
              <div className="flex justify-between">
                  <span>{t('incomes.total')} ({t('incomes.amount')})</span>
                  <span>{totalIncome.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                  <span>{t('incomes.total')} ({t('incomes.vat')})</span>
                  <span>{totalVat.toFixed(2)}</span>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeTable;
