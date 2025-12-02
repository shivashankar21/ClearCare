import { useContext } from 'react';
import { SkinAnalysisContext } from '../contexts/SkinAnalysisContext';

export function useSkinAnalysis() {
  const context = useContext(SkinAnalysisContext);
  if (!context) {
    throw new Error('useSkinAnalysis must be used within SkinAnalysisProvider');
  }
  return context;
}