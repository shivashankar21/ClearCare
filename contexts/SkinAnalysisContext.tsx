import React, { createContext, ReactNode, useState, useEffect } from 'react';
import { SkinAnalysis, UserStats } from '../constants/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SkinAnalysisContextType {
  analyses: SkinAnalysis[];
  userStats: UserStats;
  addAnalysis: (analysis: SkinAnalysis) => Promise<void>;
  deleteAnalysis: (id: string) => Promise<void>;
  loadAnalyses: () => Promise<void>;
}

export const SkinAnalysisContext = createContext<SkinAnalysisContextType | undefined>(undefined);

export function SkinAnalysisProvider({ children }: { children: ReactNode }) {
  const [analyses, setAnalyses] = useState<SkinAnalysis[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalScans: 0,
    conditionsTracked: [],
    improvementTrend: 'stable'
  });

  useEffect(() => {
    loadAnalyses();
  }, []);

  useEffect(() => {
    updateUserStats();
  }, [analyses]);

  const generateDummyData = (): SkinAnalysis[] => {
    const dummyAnalyses: SkinAnalysis[] = [];
    const baseDate = new Date(2025, 6, 15); // July 15, 2025
    
    // July scans (2)
    dummyAnalyses.push(
      {
        id: 'dummy-july-1',
        timestamp: new Date(2025, 6, 8), // July 8, 2025
        imageUri: 'dummy://july1',
        skinType: 'combination',
        overallHealth: 'good',
        confidence: 87,
        conditions: [
          { condition: 'Mild Acne', severity: 'mild', confidence: 85, affectedArea: 'T-zone', description: 'Small blackheads and whiteheads on forehead and nose area' }
        ],
        recommendations: ['Use salicylic acid cleanser', 'Apply non-comedogenic moisturizer', 'Use SPF 30 daily']
      },
      {
        id: 'dummy-july-2',
        timestamp: new Date(2025, 6, 22), // July 22, 2025
        imageUri: 'dummy://july2',
        skinType: 'combination',
        overallHealth: 'fair',
        confidence: 82,
        conditions: [
          { condition: 'Mild Acne', severity: 'mild', confidence: 80, affectedArea: 'T-zone', description: 'Persistent blackheads with some inflammatory papules' },
          { condition: 'Dry Patches', severity: 'mild', confidence: 78, affectedArea: 'cheeks', description: 'Slight dryness on cheek areas' }
        ],
        recommendations: ['Continue salicylic acid treatment', 'Add hyaluronic acid serum', 'Use gentle exfoliation weekly']
      }
    );
    
    // August scans (2)
    dummyAnalyses.push(
      {
        id: 'dummy-aug-1',
        timestamp: new Date(2025, 7, 5), // Aug 5, 2025
        imageUri: 'dummy://aug1',
        skinType: 'combination',
        overallHealth: 'good',
        confidence: 89,
        conditions: [
          { condition: 'Mild Acne', severity: 'mild', confidence: 82, affectedArea: 'forehead', description: 'Reduced blackheads, treatment showing results' }
        ],
        recommendations: ['Continue current routine', 'Consider vitamin C serum', 'Maintain consistent SPF use']
      },
      {
        id: 'dummy-aug-2',
        timestamp: new Date(2025, 7, 19), // Aug 19, 2025
        imageUri: 'dummy://aug2',
        skinType: 'combination',
        overallHealth: 'excellent',
        confidence: 91,
        conditions: [],
        recommendations: ['Maintain current skincare routine', 'Consider adding retinol for prevention', 'Continue daily SPF protection']
      }
    );
    
    // September scans (2)
    dummyAnalyses.push(
      {
        id: 'dummy-sep-1',
        timestamp: new Date(2025, 8, 3), // Sep 3, 2025
        imageUri: 'dummy://sep1',
        skinType: 'combination',
        overallHealth: 'excellent',
        confidence: 93,
        conditions: [],
        recommendations: ['Excellent progress!', 'Continue prevention routine', 'Monthly skin checks recommended']
      },
      {
        id: 'dummy-sep-2',
        timestamp: new Date(2025, 8, 17), // Sep 17, 2025
        imageUri: 'dummy://sep2',
        skinType: 'combination',
        overallHealth: 'good',
        confidence: 85,
        conditions: [
          { condition: 'Minor Irritation', severity: 'mild', confidence: 79, affectedArea: 'chin', description: 'Slight redness possibly from new product trial' }
        ],
        recommendations: ['Discontinue new products temporarily', 'Use gentle, fragrance-free products', 'Allow skin to recover']
      }
    );
    
    // October scans (2)
    dummyAnalyses.push(
      {
        id: 'dummy-oct-1',
        timestamp: new Date(2025, 9, 1), // Oct 1, 2025
        imageUri: 'dummy://oct1',
        skinType: 'combination',
        overallHealth: 'good',
        confidence: 88,
        conditions: [
          { condition: 'Seasonal Dryness', severity: 'mild', confidence: 84, affectedArea: 'cheeks', description: 'Mild dryness due to changing weather conditions' }
        ],
        recommendations: ['Switch to richer moisturizer for fall', 'Add facial oil to evening routine', 'Use humidifier indoors']
      },
      {
        id: 'dummy-oct-2',
        timestamp: new Date(2025, 9, 15), // Oct 15, 2025
        imageUri: 'dummy://oct2',
        skinType: 'combination',
        overallHealth: 'excellent',
        confidence: 90,
        conditions: [],
        recommendations: ['Skin adapting well to seasonal changes', 'Continue current winter prep routine', 'Maintain consistent care']
      }
    );
    
    return dummyAnalyses.reverse(); // Most recent first
  };

  const loadAnalyses = async () => {
    try {
      const stored = await AsyncStorage.getItem('skinAnalyses');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const analysesWithDates = parsed.map((analysis: any) => ({
          ...analysis,
          timestamp: new Date(analysis.timestamp)
        }));
        setAnalyses(analysesWithDates);
      } else {
        // No stored data, initialize with dummy data
        const dummyData = generateDummyData();
        setAnalyses(dummyData);
        await AsyncStorage.setItem('skinAnalyses', JSON.stringify(dummyData));
      }
    } catch (error) {
      console.error('Error loading analyses:', error);
      // Fallback to dummy data if storage fails
      const fallbackData = generateDummyData();
      setAnalyses(fallbackData);
      try {
        await AsyncStorage.setItem('skinAnalyses', JSON.stringify(fallbackData));
      } catch (saveError) {
        console.error('Error saving fallback data:', saveError);
      }
    }
  };

  const addAnalysis = async (analysis: SkinAnalysis) => {
    const updatedAnalyses = [analysis, ...analyses];
    setAnalyses(updatedAnalyses);
    
    try {
      await AsyncStorage.setItem('skinAnalyses', JSON.stringify(updatedAnalyses));
    } catch (error) {
      console.error('Error saving analysis:', error);
    }
  };

  const deleteAnalysis = async (id: string) => {
    const updatedAnalyses = analyses.filter(analysis => analysis.id !== id);
    setAnalyses(updatedAnalyses);
    
    try {
      await AsyncStorage.setItem('skinAnalyses', JSON.stringify(updatedAnalyses));
    } catch (error) {
      console.error('Error deleting analysis:', error);
    }
  };

  const updateUserStats = () => {
    const totalScans = analyses.length;
    const latestScanDate = analyses.length > 0 ? analyses[0].timestamp : undefined;
    
    // Get all unique conditions
    const allConditions = new Set<string>();
    analyses.forEach(analysis => {
      analysis.conditions.forEach(condition => {
        allConditions.add(condition.condition);
      });
    });

    // Calculate improvement trend (simplified)
    let improvementTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (analyses.length >= 2) {
      const recent = analyses[0];
      const previous = analyses[1];
      const recentSeverityScore = calculateAverageSeverity(recent.conditions);
      const previousSeverityScore = calculateAverageSeverity(previous.conditions);
      
      if (recentSeverityScore < previousSeverityScore) {
        improvementTrend = 'improving';
      } else if (recentSeverityScore > previousSeverityScore) {
        improvementTrend = 'declining';
      }
    }

    setUserStats({
      totalScans,
      latestScanDate,
      conditionsTracked: Array.from(allConditions),
      improvementTrend
    });
  };

  return (
    <SkinAnalysisContext.Provider value={{
      analyses,
      userStats,
      addAnalysis,
      deleteAnalysis,
      loadAnalyses
    }}>
      {children}
    </SkinAnalysisContext.Provider>
  );
}

function calculateAverageSeverity(conditions: any[]): number {
  if (conditions.length === 0) return 0;
  
  const severityScores = conditions.map(condition => {
    switch (condition.severity) {
      case 'mild': return 1;
      case 'moderate': return 2;
      case 'severe': return 3;
      default: return 1;
    }
  });
  
  return severityScores.reduce((sum, score) => sum + score, 0) / severityScores.length;
}