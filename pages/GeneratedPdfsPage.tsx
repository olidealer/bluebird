import React from 'react';
import { FileDown, CalendarDays, FileArchive } from 'lucide-react';
import { useTaxData } from '../hooks/useTaxData';
import { generateDeclarationPDF } from '../services/pdfGenerator';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MONTH_NAMES } from '../constants';

export const GeneratedPdfsPage: React.FC = () => {
    const { getGeneratedPdfs, getMonthlyData, calculateTaxes } = useTaxData();
    const pdfs = getGeneratedPdfs();

    const handleRedownload = (yearMonth: string) => {
        const [yearStr, monthStr] = yearMonth.split('-');
        const year = parseInt(yearStr);
        const monthIndex = parseInt(monthStr) - 1;
        
        const data = getMonthlyData(yearMonth);
        const calculations = calculateTaxes(data);
        generateDeclarationPDF(year, monthIndex, data, calculations);
    };

    const parseYearMonth = (yearMonth: string) => {
        const [year, month] = yearMonth.split('-');
        return `${MONTH_NAMES[parseInt(month) - 1]} ${year}`;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-dark">Historial de PDFs Generados</h1>
            <p className="mt-2 text-gray-600">Aquí puedes encontrar y volver a descargar todas las declaraciones que has generado.</p>
            
            <div className="mt-8">
                {pdfs.length === 0 ? (
                    <Card className="text-center py-12">
                         <FileArchive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700">No hay PDFs generados</h3>
                        <p className="text-gray-500 mt-2">Cuando generes tu primera declaración, aparecerá aquí.</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {pdfs.map(pdf => (
                            <Card key={pdf.id} className="flex flex-col md:flex-row items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-brand-dark">{`Declaración ${parseYearMonth(pdf.yearMonth)}`}</h3>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                        <CalendarDays size={14} className="mr-2" />
                                        <span>Generado el: {new Date(pdf.generatedAt).toLocaleDateString('es-CR')}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Archivo: {pdf.fileName}</p>
                                </div>
                                <Button 
                                    variant="outline"
                                    className="mt-4 md:mt-0"
                                    onClick={() => handleRedownload(pdf.yearMonth)}
                                >
                                    <FileDown size={16} className="mr-2" />
                                    Descargar de Nuevo
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
