import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, AlertTriangle } from 'lucide-react';
import { MONTH_NAMES } from '../constants';
import { useTaxData } from '../hooks/useTaxData';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { IncomeForm } from '../components/income/IncomeForm';
import { InvoiceUploader } from '../components/invoices/InvoiceUploader';
import { GmailConnectPlaceholder } from '../components/invoices/GmailConnectPlaceholder';
import { IncomeList } from '../components/income/IncomeList';
import { ExpenseList } from '../components/invoices/ExpenseList';
import { generateDeclarationPDF } from '../services/pdfGenerator';
import { NotFoundPage } from './NotFoundPage';

const formatCurrency = (value: number) => `₡${value.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const MonthlyViewPage: React.FC = () => {
    const { year, month } = useParams<{ year: string, month: string }>();

    if (!year || !month || isNaN(parseInt(year)) || isNaN(parseInt(month))) {
        return <NotFoundPage />;
    }
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (monthNum < 1 || monthNum > 12) {
         return <NotFoundPage />;
    }
    
    const yearMonthKey = `${yearNum}-${String(monthNum).padStart(2, '0')}`;
    const { getMonthlyData, calculateTaxes, addGeneratedPdf } = useTaxData();
    const monthlyData = getMonthlyData(yearMonthKey);

    const taxCalculations = useMemo(() => calculateTaxes(monthlyData), [monthlyData, calculateTaxes]);

    const handleGeneratePDF = () => {
        const fileName = generateDeclarationPDF(yearNum, monthNum - 1, monthlyData, taxCalculations);
        addGeneratedPdf({
            yearMonth: yearMonthKey,
            fileName: fileName,
            generatedAt: new Date().toISOString()
        });
    };

    return (
        <div>
            <Link to="/" className="flex items-center text-brand-primary hover:underline mb-4">
                <ArrowLeft size={18} className="mr-1" />
                Volver al Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-brand-dark">
                Declaración de {MONTH_NAMES[monthNum - 1]} {yearNum}
            </h1>
            <div className="flex items-center mt-2 text-gray-500">
                <AlertTriangle size={16} className="mr-2 text-orange-500" />
                <p>Fecha límite de presentación: 15 de {MONTH_NAMES[monthNum % 12]} {monthNum === 12 ? yearNum + 1 : yearNum}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Main Content: Forms & Lists */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <h2 className="text-xl font-semibold text-brand-dark mb-4">Paso 1: Registra tus Ingresos</h2>
                        <IncomeForm yearMonth={yearMonthKey} />
                        <IncomeList yearMonth={yearMonthKey} />
                    </Card>
                    <Card>
                        <h2 className="text-xl font-semibold text-brand-dark mb-4">Paso 2: Carga tus Gastos Deducibles</h2>
                        <InvoiceUploader yearMonth={yearMonthKey} />
                        <GmailConnectPlaceholder />
                        <ExpenseList yearMonth={yearMonthKey} />
                    </Card>
                </div>

                {/* Sidebar: Summary & Actions */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-8">
                        <h2 className="text-xl font-semibold text-brand-dark mb-4">Resumen de Impuestos</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span>Ingresos Brutos:</span> <strong>{formatCurrency(taxCalculations.grossIncome)}</strong></div>
                            <hr/>
                            <h3 className="font-semibold pt-2 text-base">IVA (D-104-2)</h3>
                            <div className="flex justify-between text-green-600"><span>(+) IVA Débito:</span> <span>{formatCurrency(taxCalculations.ivaDebit)}</span></div>
                            <div className="flex justify-between text-red-600"><span>(-) IVA Crédito:</span> <span>{formatCurrency(taxCalculations.ivaCredit)}</span></div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2"><span>(=) IVA a Pagar:</span> <span>{formatCurrency(taxCalculations.netIva)}</span></div>
                             <hr/>
                            <h3 className="font-semibold pt-2 text-base">Renta (D-125)</h3>
                             <div className="flex justify-between"><span>Base Imponible:</span> <strong>{formatCurrency(taxCalculations.netTaxableIncome)}</strong></div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2"><span>(=) Renta a Pagar:</span> <span>{formatCurrency(taxCalculations.rentaTax)}</span></div>
                        </div>
                        <Button onClick={handleGeneratePDF} className="w-full mt-6" disabled={monthlyData.income.length === 0 && monthlyData.expenses.length === 0}>
                            <Download size={18} className="mr-2"/>
                            Generar PDF para Declaración
                        </Button>
                         <p className="text-xs text-gray-500 mt-4 text-center">Este es un documento sugerido. La declaración final es responsabilidad del contribuyente.</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};