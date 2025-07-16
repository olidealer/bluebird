
import { useContext } from 'react';
import { AppearanceContext } from '../context/AppearanceContext';

const useAppearance = () => {
  const context = useContext(AppearanceContext);
  if (context === undefined) {
    throw new Error('useAppearance must be used within an AppearanceProvider');
  }
  return context;
};

export default useAppearance;