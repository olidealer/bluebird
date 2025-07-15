
import React, { useState } from 'react';
import { useTaxData } from '../../hooks/useTaxData';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface IncomeFormProps {
    yearMonth: string;
}

export const IncomeForm: React.FC<IncomeFormProps> = ({ yearMonth }) => {
    const [amount, setAmount] = useState('');
    const [includesIva, setIncludesIva] = useState(false);
    const [description, setDescription] = useState('');
    const { addIncome } = useTaxData();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const totalAmount = parseFloat(amount);
        if (isNaN(totalAmount) || totalAmount <= 0) {
            alert("Por favor, ingrese un monto válido.");
            return;
        }

        addIncome(yearMonth, { totalAmount, includesIva, description });
        setAmount('');
        setDescription('');
        setIncludesIva(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Monto Total del Ingreso (₡)"
                    id="income-amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Ej: 50000"
                    required
                />
                 <Input
                    label="Descripción (Opcional)"
                    id="income-description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej: Huésped Enero Semana 1"
                />
            </div>
            <div className="flex items-center">
                <input
                    id="includes-iva"
                    type="checkbox"
                    checked={includesIva}
                    onChange={(e) => setIncludesIva(e.target.checked)}
                    className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
                />
                <label htmlFor="includes-iva" className="ml-2 block text-sm text-gray-900">
                    Este monto ya incluye el 13% de IVA
                </label>
            </div>
            <Button type="submit">Agregar Ingreso</Button>
        </form>
    );
};
