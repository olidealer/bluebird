import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice, IncomeRecord } from '../types';
import { TFunction } from 'i18next';

interface TaxSummary {
  grossIncome: number;
  totalExpenses: number;
  vatDebit: number;
  vatCredit: number;
  vatPayable: number;
  taxableBase: number;
  incomeTaxPayable: number;
}

export const generatePdf = (
  incomes: IncomeRecord[],
  expenses: Invoice[],
  summary: TaxSummary,
  period: { month: number; year: number },
  t: TFunction,
  language: string
) => {
  const doc = new jsPDF();

  const monthName = new Date(period.year, period.month - 1, 1).toLocaleString(language, { month: 'long' });
  const title = `${t('dashboard.title')} - ${monthName} ${period.year}`;

  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Summary Table
  autoTable(doc, {
    startY: 30,
    head: [[t('summary.title'), '']],
    body: [
        [t('summary.grossIncome'), summary.grossIncome.toFixed(2)],
        [t('summary.deductibleExpenses'), summary.totalExpenses.toFixed(2)],
        [t('summary.vatDebit'), summary.vatDebit.toFixed(2)],
        [t('summary.vatCredit'), summary.vatCredit.toFixed(2)],
        [{ content: t('summary.vatPayable'), styles: { fontStyle: 'bold' } }, { content: summary.vatPayable.toFixed(2), styles: { fontStyle: 'bold' } }],
        [t('summary.taxableBaseIncome'), summary.taxableBase.toFixed(2)],
        [{ content: t('summary.incomeTaxPayable'), styles: { fontStyle: 'bold' } }, { content: summary.incomeTaxPayable.toFixed(2), styles: { fontStyle: 'bold' } }],
    ],
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
  });

  let lastY = (doc as any).lastAutoTable.finalY;
  
  // Income Table
  doc.setFontSize(14);
  doc.text(t('incomes.title'), 14, lastY + 15);
  autoTable(doc, {
    startY: lastY + 20,
    head: [[t('incomes.description'), t('incomes.date'), t('incomes.amount'), t('incomes.vat')]],
    body: incomes.map(inc => [
      inc.description,
      new Date(inc.date).toLocaleDateString(),
      inc.amount.toFixed(2),
      inc.vat.toFixed(2)
    ]),
    theme: 'striped',
    headStyles: { fillColor: [22, 160, 133] },
  });

  lastY = (doc as any).lastAutoTable.finalY;

  // Expenses Table
  doc.setFontSize(14);
  doc.text(t('expenses.title'), 14, lastY + 15);
  autoTable(doc, {
    startY: lastY + 20,
    head: [[t('expenses.issuer'), t('expenses.date'), t('expenses.total'), t('expenses.vat')]],
    body: expenses.map(exp => [
      exp.issuerName,
      new Date(exp.date).toLocaleDateString(),
      exp.totalAmount.toFixed(2),
      exp.vatAmount.toFixed(2)
    ]),
    theme: 'striped',
    headStyles: { fillColor: [192, 57, 43] },
  });

  doc.save(`Tax_Summary_${period.month}_${period.year}.pdf`);
};