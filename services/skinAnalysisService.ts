import { SkinAnalysis, SkinCondition, SKIN_CONDITIONS, SKIN_RECOMMENDATIONS } from '../constants/types';

export class SkinAnalysisService {
  static generateMockAnalysis(imageUri?: string): SkinAnalysis {
    const conditions = this.generateRandomConditions();
    const skinType = this.generateSkinType();
    const overallHealth = this.calculateOverallHealth(conditions);
    const recommendations = this.generateRecommendations(conditions);

    return {
      id: this.generateId(),
      timestamp: new Date(),
      skinType,
      overallHealth,
      conditions,
      recommendations,
      imageUri
    };
  }

  private static generateRandomConditions(): SkinCondition[] {
    // Always return these three specific conditions
    const fixedConditions = [
      {
        condition: 'Eczema',
        severity: 'mild' as const,
        confidence: 85,
        affectedArea: 'Cheeks',
        description: 'Mild atopic dermatitis with occasional dry patches and slight itching. Skin barrier function is mildly compromised.'
      },
      {
        condition: 'Fine Lines & Wrinkles',
        severity: 'mild' as const,
        confidence: 82,
        affectedArea: 'Around eyes',
        description: 'Early signs of aging with subtle expression lines. Collagen production remains relatively healthy.'
      },
      {
        condition: 'Skin Dryness',
        severity: 'mild' as const,
        confidence: 88,
        affectedArea: 'Full face',
        description: 'Mild dehydration with some areas feeling tight. Skin needs enhanced moisture retention.'
      }
    ];

    return fixedConditions;
  }

  private static generateSeverity(): 'mild' | 'moderate' | 'severe' {
    const rand = Math.random();
    if (rand < 0.5) return 'mild';
    if (rand < 0.8) return 'moderate';
    return 'severe';
  }

  private static generateSkinType(): 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal' {
    const types: Array<'oily' | 'dry' | 'combination' | 'sensitive' | 'normal'> = 
      ['oily', 'dry', 'combination', 'sensitive', 'normal'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private static generateAffectedArea(): string {
    const areas = ['T-zone', 'Forehead', 'Cheeks', 'Chin', 'Around eyes', 'Full face', 'Nose area'];
    return areas[Math.floor(Math.random() * areas.length)];
  }

  private static calculateOverallHealth(conditions: SkinCondition[]): 'excellent' | 'good' | 'fair' | 'poor' {
    // Always return 'good' health status
    return 'good';
  }

  private static generateRecommendations(conditions: SkinCondition[]): string[] {
    const allRecommendations: string[] = [];
    
    conditions.forEach(condition => {
      const conditionKey = this.getConditionKey(condition.condition);
      if (conditionKey && SKIN_RECOMMENDATIONS[conditionKey]) {
        allRecommendations.push(...SKIN_RECOMMENDATIONS[conditionKey]);
      }
    });

    // Add general recommendations
    allRecommendations.push(
      'Maintain a consistent daily skincare routine',
      'Consult with a dermatologist for professional assessment',
      'Stay hydrated and maintain a healthy diet'
    );

    // Remove duplicates and limit to 6 recommendations
    return [...new Set(allRecommendations)].slice(0, 6);
  }

  private static getConditionKey(conditionName: string): keyof typeof SKIN_RECOMMENDATIONS | null {
    const mapping: Record<string, keyof typeof SKIN_RECOMMENDATIONS> = {
      'Acne': 'acne',
      'Rosacea': 'rosacea',
      'Fine Lines & Wrinkles': 'wrinkles',
      'Hyperpigmentation': 'hyperpigmentation',
      'Skin Dryness': 'dryness',
      'Eczema': 'dryness' // Map Eczema to dryness recommendations
    };
    return mapping[conditionName] || null;
  }

  private static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  static async processImage(imageUri: string): Promise<SkinAnalysis> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return this.generateMockAnalysis(imageUri);
  }
}