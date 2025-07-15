
import React, { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, AlertTriangle } from 'lucide-react';
import { useTaxData } from '../context/TaxDataContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { IncomeForm } from '../components/income/IncomeForm';
import { InvoiceUploader } from '../components/invoices/InvoiceUploader';
import { GmailConnectPlaceholder } from '../components/invoices/GmailConnectPlaceholder';
import { IncomeList } from '../components/income/IncomeList';
import { ExpenseList } from '../components/invoices/ExpenseList';
import { generateDeclarationPDF } from '../services/pdfGenerator';
import { NotFoundPage } from './NotFoundPage';
import { useTranslation } from 'react-i18next';

const formatCurrency = (value: number) => `₡${value.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const MonthlyViewPage: React.FC = () => {
    const { year, month } = useParams<{ year: string, month: string }>();
    const { t } = useTranslation();
    const monthNames = [t('January'), t('February'), t('March'), t('April'), t('May'), t('June'), t('July'), t('August'), t('September'), t('October'), t('November'), t('December')];

    if (!year || !month || isNaN(parseInt(year)) || isNaN(parseInt(month))) return <NotFoundPage />;
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    if (monthNum < 1 || monthNum > 12) return <NotFoundPage />;
    
    const yearMonthKey = `${yearNum}-${String(monthNum).padStart(2, '0')}`;
    const { getMonthlyData, calculateTaxes, addGeneratedPdf, fetchMonthlyData, isLoading } = useTaxData();
    
    useEffect(() => {
        fetchMonthlyData(yearNum, monthNum);
    }, [yearNum, monthNum, fetchMonthlyData]);

    const monthlyData = getMonthlyData(yearMonthKey);
    const taxCalculations = useMemo(() => calculateTaxes(monthlyData), [monthlyData, calculateTaxes]);

    const handleGeneratePDF = () => {
        const fileName = generateDeclarationPDF(yearNum, monthNum - 1, monthlyData, taxCalculations, t);
        addGeneratedPdf(yearMonthKey, fileName);
    };

    const monthName = monthNames[monthNum - 1];
    const nextMonthName = monthNames[monthNum % 12];
    const deadlineYear = monthNum === 12 ? yearNum + 1 : yearNum;

    return (
        <div>
            <Link to="/" className="flex items-center text-brand-primary hover:underline mb-4">
                <ArrowLeft size={18} className="mr-1" />
                {t('monthlyViewBack')}
            </Link>
            <h1 className="text-3xl font-bold text-brand-dark">
                {t('monthlyViewTitle', { monthName, yearNum })}
            </h1>
            <div className="flex items-center mt-2 text-gray-500">
                <AlertTriangle size={16} className="mr-2 text-orange-500" />
                <p>{t('monthlyViewDeadline', { monthName: nextMonthName, yearNum: deadlineYear })}</p>
            </div>
            
            {isLoading && <p className="mt-8">Loading data...</p>}
            
            {!isLoading && (
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <h2 className="text-xl font-semibold text-brand-dark mb-4">{t('step1Title')}</h2>
                            <IncomeForm yearMonth={yearMonthKey} />
                            <IncomeList yearMonth={yearMonthKey} />
                        </Card>
                        <Card>
                            <h2 className="text-xl font-semibold text-brand-dark mb-4">{t('step2Title')}</h2>
                            <InvoiceUploader yearMonth={yearMonthKey} />
                            <GmailConnectPlaceholder />
                            <ExpenseList yearMonth={yearMonthKey} />
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <h2 className="text-xl font-semibold text-brand-dark mb-4">{t('taxSummaryTitle')}</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between"><span>{t('grossIncome')}:</span> <strong>{formatCurrency(taxCalculations.grossIncome)}</strong></div>
                                <hr/>
                                <h3 className="font-semibold pt-2 text-base">IVA (D-104-2)</h3>
                                <div className="flex justify-between text-green-600"><span>(+) {t('ivaDebit')}:</span> <span>{formatCurrency(taxCalculations.ivaDebit)}</span></div>
                                <div className="flex justify-between text-red-600"><span>(-) {t('ivaCredit')}:</span> <span>{formatCurrency(taxCalculations.ivaCredit)}</span></div>
                                <div className="flex justify-between font-bold text-lg border-t pt-2"><span>(=) {t('netIva')}:</span> <span>{formatCurrency(taxCalculations.netIva)}</span></div>
                                 <hr/>
                                <h3 className="font-semibold pt-2 text-base">Renta (D-125)</h3>
                                 <div className="flex justify-between"><span>{t('taxableBase')}:</span> <strong>{formatCurrency(taxCalculations.netTaxableIncome)}</strong></div>
                                <div className="flex justify-between font-bold text-lg border-t pt-2"><span>(=) {t('rentaTax')}:</span> <span>{formatCurrency(taxCalculations.rentaTax)}</span></div>
                            </div>
                            <Button onClick={handleGeneratePDF} className="w-full mt-6" disabled={monthlyData.income.length === 0 && monthlyData.expenses.length === 0}>
                                <Download size={18} className="mr-2"/>
                                {t('generatePdfButton')}
                            </Button>
                             <p className="text-xs text-gray-500 mt-4 text-center">{t('pdfDisclaimer')}</p>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};
