
import React from 'react';
import { Trash2 } from 'lucide-react';
import { useTaxData } from '../../hooks/useTaxData';

interface IncomeListProps {
  yearMonth: string;
}

const formatCurrency = (value: number) => `₡${value.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const IncomeList: React.FC<IncomeListProps> = ({ yearMonth }) => {
  const { getMonthlyData, deleteIncome } = useTaxData();
  const { income } = getMonthlyData(yearMonth);

  if (income.length === 0) {
    return <p className="text-sm text-gray-500 mt-4">Aún no has registrado ingresos este mes.</p>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-800">Ingresos Registrados</h3>
      <ul className="mt-2 divide-y divide-gray-200">
        {income.map((item) => (
          <li key={item.id} className="py-3 flex justify-between items-center">
            <div>
              <p className="font-semibold text-brand-dark">{formatCurrency(item.totalAmount)}</p>
              <p className="text-sm text-gray-600">{item.description || 'Ingreso manual'}</p>
              {item.includesIva && <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">IVA incluido</span>}
            </div>
            <button
              onClick={() => deleteIncome(yearMonth, item.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors"
              aria-label="Eliminar ingreso"
            >
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
