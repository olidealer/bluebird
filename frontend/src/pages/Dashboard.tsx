import React from 'react';
import { useTranslation } from 'react-i18next';
import useTaxData from '../hooks/useTaxData';
import IncomeTable from '../components/IncomeTable';
import ExpensesTable from '../components/ExpensesTable';
import Summary from '../components/Summary';

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentMonth, currentYear, setCurrentMonth, setCurrentYear, error } = useTaxData();

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const monthNames = months.map(m => new Date(2000, m - 1, 1).toLocaleString(i18n.language, { month: 'long' }));

  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center sm:text-left">{t('dashboard.title')}</h1>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
            className="p-2 bg-input border border-border rounded-md w-full"
            aria-label={t('dashboard.month')}
          >
            {months.map((month, index) => (
              <option key={month} value={month}>{monthNames[index]}</option>
            ))}
          </select>
          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
            className="p-2 bg-input border border-border rounded-md w-full"
            aria-label={t('dashboard.year')}
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="bg-destructive text-destructive-foreground p-4 rounded-md mb-6">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <IncomeTable />
          <ExpensesTable />
        </div>
        <div className="lg:col-span-1">
          <Summary />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;