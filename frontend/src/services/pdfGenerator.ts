
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { MonthlyData, TaxCalculations } from "../types";
import { TFunction } from "i18next";

const formatCurrency = (value: number) => {
    return `CRC ₡${value.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const generateDeclarationPDF = (year: number, month: number, data: MonthlyData, calculations: TaxCalculations, t: TFunction): string => {
    const doc = new jsPDF();
    const monthNames = [t('January'), t('February'), t('March'), t('April'), t('May'), t('June'), t('July'), t('August'), t('September'), t('October'), t('November'), t('December')];
    const monthName = monthNames[month];
    const fileName = `Declaration_${year}_${String(month + 1).padStart(2, '0')}.pdf`;

    // Header
    doc.setFontSize(22);
    doc.setTextColor('#007A87');
    doc.text(t('monthlyViewTitle', { monthName, yearNum: year }), 14, 22);
    doc.setFontSize(11);
    doc.setTextColor('#484848');
    doc.text(`${t('pdfsGeneratedOn', { date: new Date().toLocaleDateString() })}`, 14, 30);

    // Summary Section
    doc.setFontSize(16);
    doc.setTextColor('#007A87');
    doc.text(t('taxSummaryTitle'), 14, 45);

    autoTable(doc, {
        startY: 50,
        head: [['Concepto', 'Monto']],
        body: [
            [t('grossIncome'), formatCurrency(calculations.grossIncome)],
            [`${t('ivaDebit')} (13%)`, formatCurrency(calculations.ivaDebit)],
            [t('ivaCredit'), formatCurrency(calculations.ivaCredit)],
            [t('netIva'), formatCurrency(calculations.netIva)],
            ['---', '---'],
            [t('taxableBase'), formatCurrency(calculations.netTaxableIncome)],
            [t('rentaTax'), formatCurrency(calculations.rentaTax)],
        ],
        theme: 'grid',
        headStyles: { fillColor: 'var(--color-primary)' },
    });

    const finalY = (doc as any).lastAutoTable.finalY;

    // Income Details
    if (data.income.length > 0) {
        doc.setFontSize(16);
        doc.setTextColor('#007A87');
        doc.text(t('incomeListTitle'), 14, finalY + 15);
        autoTable(doc, {
            startY: finalY + 20,
            head: [['Descripción', 'Monto Total']],
            body: data.income.map(i => [i.description || 'Ingreso manual', formatCurrency(i.totalAmount)]),
            theme: 'grid',
            headStyles: { fillColor: 'var(--color-primary)' },
        });
    }

    const finalY2 = (doc as any).lastAutoTable.finalY || finalY;

    // Expense Details
    if (data.expenses.length > 0) {
        doc.setFontSize(16);
        doc.setTextColor('#007A87');
        doc.text(t('expenseListTitle'), 14, finalY2 + 15);
        autoTable(doc, {
            startY: finalY2 + 20,
            head: [['Proveedor', 'Descripción', 'Total', 'IVA Soportado']],
            body: data.expenses.map(e => [
                e.provider,
                e.description,
                formatCurrency(e.totalAmount),
                formatCurrency(e.ivaAmount),
            ]),
            theme: 'grid',
            headStyles: { fillColor: 'var(--color-primary)' },
        });
    }

    doc.save(fileName);
    return fileName;
};
