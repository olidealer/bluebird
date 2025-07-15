import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { MonthlyData, TaxCalculations } from "../types";
import { MONTH_NAMES } from "../constants";

const formatCurrency = (value: number) => {
    return `CRC ₡${value.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const generateDeclarationPDF = (year: number, month: number, data: MonthlyData, calculations: TaxCalculations): string => {
    const doc = new jsPDF();
    const monthName = MONTH_NAMES[month];
    const fileName = `Declaracion_${year}_${String(month + 1).padStart(2, '0')}.pdf`;

    // Header
    doc.setFontSize(22);
    doc.setTextColor('#007A87');
    doc.text(`Declaración Sugerida - ${monthName} ${year}`, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor('#484848');
    doc.text(`Generado: ${new Date().toLocaleDateString('es-CR')}`, 14, 30);

    // Summary Section
    doc.setFontSize(16);
    doc.setTextColor('#007A87');
    doc.text("Resumen de Impuestos", 14, 45);

    autoTable(doc, {
        startY: 50,
        head: [['Concepto', 'Monto']],
        body: [
            ['Ingresos Brutos', formatCurrency(calculations.grossIncome)],
            ['IVA Débito (13%)', formatCurrency(calculations.ivaDebit)],
            ['Total Gastos Deducibles', formatCurrency(data.expenses.reduce((sum, e) => sum + (e.totalAmount - e.ivaAmount), 0))],
            ['IVA Crédito Soportado', formatCurrency(calculations.ivaCredit)],
            ['IVA a Pagar (D-104-2)', formatCurrency(calculations.netIva)],
            ['---', '---'],
            ['Base Imponible Renta', formatCurrency(calculations.netTaxableIncome)],
            ['Impuesto de Renta (D-125)', formatCurrency(calculations.rentaTax)],
        ],
        theme: 'grid',
        headStyles: { fillColor: '#007A87' },
    });

    const finalY = (doc as any).lastAutoTable.finalY;

    // Income Details
    if (data.income.length > 0) {
        doc.setFontSize(16);
        doc.setTextColor('#007A87');
        doc.text("Detalle de Ingresos", 14, finalY + 15);
        autoTable(doc, {
            startY: finalY + 20,
            head: [['Descripción', 'Monto Total']],
            body: data.income.map(i => [i.description || 'Ingreso manual', formatCurrency(i.totalAmount)]),
            theme: 'grid',
            headStyles: { fillColor: '#007A87' },
        });
    }

    const finalY2 = (doc as any).lastAutoTable.finalY || finalY;

    // Expense Details
    if (data.expenses.length > 0) {
        doc.setFontSize(16);
        doc.setTextColor('#007A87');
        doc.text("Detalle de Gastos (Facturas)", 14, finalY2 + 15);
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
            headStyles: { fillColor: '#007A87' },
        });
    }

    doc.save(fileName);
    return fileName;
};