
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileDown, CalendarDays, FileArchive } from 'lucide-react';
import { useTaxData } from '../context/TaxDataContext';
import { generateDeclarationPDF } from '../services/pdfGenerator';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const GeneratedPdfsPage: React.FC = () => {
    const { t } = useTranslation();
    const { generatedPdfs, fetchGeneratedPdfs, getMonthlyData, calculateTaxes, isLoading } = useTaxData();
    const monthNames = [t('January'), t('February'), t('March'), t('April'), t('May'), t('June'), t('July'), t('August'), t('September'), t('October'), t('November'), t('December')];
    
    useEffect(() => {
        fetchGeneratedPdfs();
    }, [fetchGeneratedPdfs]);

    const handleRedownload = (yearMonth: string) => {
        const [yearStr, monthStr] = yearMonth.split('-');
        const year = parseInt(yearStr);
        const monthIndex = parseInt(monthStr) - 1;
        
        const data = getMonthlyData(yearMonth);
        const calculations = calculateTaxes(data);
        generateDeclarationPDF(year, monthIndex, data, calculations, t);
    };

    const parseYearMonth = (yearMonth: string) => {
        const [year, month] = yearMonth.split('-');
        return `${monthNames[parseInt(month) - 1]} ${year}`;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-dark">{t('pdfsTitle')}</h1>
            <p className="mt-2 text-gray-600">{t('pdfsSubtitle')}</p>
            
            <div className="mt-8">
                {isLoading && <p>Loading...</p>}
                {!isLoading && generatedPdfs.length === 0 ? (
                    <Card className="text-center py-12">
                         <FileArchive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700">{t('pdfsEmptyTitle')}</h3>
                        <p className="text-gray-500 mt-2">{t('pdfsEmptySubtitle')}</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {generatedPdfs.map(pdf => (
                            <Card key={pdf.id} className="flex flex-col md:flex-row items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-brand-dark">{t('monthlyViewTitle', {monthName: parseYearMonth(pdf.yearMonth).split(' ')[0], yearNum: parseYearMonth(pdf.yearMonth).split(' ')[1]})}</h3>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                        <CalendarDays size={14} className="mr-2" />
                                        <span>{t('pdfsGeneratedOn', {date: new Date(pdf.generatedAt).toLocaleDateString()})}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{t('pdfsFile', {fileName: pdf.fileName})}</p>
                                </div>
                                <Button 
                                    variant="outline"
                                    className="mt-4 md:mt-0"
                                    onClick={() => handleRedownload(pdf.yearMonth)}
                                >
                                    <FileDown size={16} className="mr-2" />
                                    {t('pdfsRedownload')}
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
