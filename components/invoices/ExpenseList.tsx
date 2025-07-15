
import React from 'react';
import { Trash2, FileText } from 'lucide-react';
import { useTaxData } from '../../hooks/useTaxData';

interface ExpenseListProps {
  yearMonth: string;
}

const formatCurrency = (value: number) => `₡${value.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const ExpenseList: React.FC<ExpenseListProps> = ({ yearMonth }) => {
  const { getMonthlyData, deleteExpense } = useTaxData();
  const { expenses } = getMonthlyData(yearMonth);

  if (expenses.length === 0) {
    return <p className="text-sm text-gray-500 mt-4">Aún no has cargado facturas de gastos este mes.</p>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-800">Facturas de Gastos Cargadas</h3>
      <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto Total</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IVA Crédito</th>
              <th scope="col" className="relative px-4 py-3">
                <span className="sr-only">Eliminar</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{expense.provider}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{expense.description}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(expense.totalAmount)}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{formatCurrency(expense.ivaAmount)}</td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                   <button
                    onClick={() => deleteExpense(yearMonth, expense.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors"
                    aria-label="Eliminar gasto"
                    >
                        <Trash2 size={18} />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
