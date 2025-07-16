
import { useContext } from 'react';
import { TaxDataContext } from '../context/TaxDataContext';

const useTaxData = () => {
  const context = useContext(TaxDataContext);
  if (context === undefined) {
    throw new Error('useTaxData must be used within a TaxDataProvider');
  }
  return context;
};

export default useTaxData;