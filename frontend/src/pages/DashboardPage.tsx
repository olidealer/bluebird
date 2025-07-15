
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, ChevronLeft, ChevronRightIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useTaxData } from '../context/TaxDataContext';
import { useTranslation } from 'react-i18next';

const MonthCard: React.FC<{ year: number, month: number }> = ({ year, month }) => {
    const { getMonthlyData } = useTaxData();
    const { t } = useTranslation();
    const monthNames = [t('January'), t('February'), t('March'), t('April'), t('May'), t('June'), t('July'), t('August'), t('September'), t('October'), t('November'), t('December')];
    const yearMonth = `${year}-${String(month + 1).padStart(2, '0')}`;
    const data = getMonthlyData(yearMonth);
    const hasData = data.income.length > 0 || data.expenses.length > 0;
    const status = hasData ? t('monthCardStatusInProgress') : t('monthCardStatusPending');
    const statusColor = hasData ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";


    return (
        <Link to={`/month/${year}/${month + 1}`}>
            <Card className="hover:shadow-lg hover:border-brand-primary border-2 border-transparent transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center text-gray-500">
                                <Calendar size={16} className="mr-2"/>
                                <p className="text-sm font-medium">{year}</p>
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mt-1">{monthNames[month]}</h3>
                        </div>
                        <ChevronRight className="text-gray-400" />
                    </div>
                </div>
                <div className="mt-4">
                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                        {status}
                    </span>
                </div>
            </Card>
        </Link>
    );
};

export const DashboardPage: React.FC = () => {
    const { t } = useTranslation();
    const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
    const monthNames = [t('January'), t('February'), t('March'), '...', t('December')]; // Just to get length

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-dark">{t('dashboardTitle')}</h1>
            <p className="mt-2 text-gray-600">{t('dashboardSubtitle')}</p>
            
            <div className="mt-8">
                 <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-700">{t('dashboardYear')} {displayYear}</h2>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => setDisplayYear(y => y - 1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                            <ChevronLeft />
                        </button>
                        <span className="text-lg font-bold w-12 text-center">{displayYear}</span>
                        <button onClick={() => setDisplayYear(y => y + 1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                            <ChevronRightIcon />
                        </button>
                    </div>
                 </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <MonthCard key={index} year={displayYear} month={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};
