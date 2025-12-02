export interface SkinCondition {
  condition: string;
  severity: 'mild' | 'moderate' | 'severe';
  confidence: number;
  affectedArea: string;
  description: string;
}

export interface SkinAnalysis {
  id: string;
  timestamp: Date;
  skinType: 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal';
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
  conditions: SkinCondition[];
  recommendations: string[];
  imageUri?: string;
}

export interface UserStats {
  totalScans: number;
  latestScanDate?: Date;
  conditionsTracked: string[];
  improvementTrend: 'improving' | 'stable' | 'declining';
}

export interface SkinConditionInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  symptoms: string[];
  causes: string[];
  treatments: string[];
  prevention: string[];
  severity: 'mild' | 'moderate' | 'severe';
  prevalence: string;
  tags: string[];
  whenToSeeDoctor: string[];
  aliases?: string[];
  keywords?: string[];
  imageUrl?: string;
  imageAlt?: string;
}

export interface KnowledgeBaseCategory {
  id: string;
  name: string;
  description: string;
  common_conditions: Array<{
    name: string;
    aliases: string[];
    keywords: string[];
  }>;
  mechanism: string;
  precautions: string[];
  example: {
    sample_condition: string;
    image: {
      url: string;
      alt: string;
      source: string;
    };
  };
  tags: string[];
}

export interface DermatologistInfo {
  id: string;
  name: string;
  specialty: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  rating: number;
  reviewCount: number;
  acceptingPatients: boolean;
  distance?: number;
  latitude: number;
  longitude: number;
  education: string;
  yearsExperience: number;
  website?: string;
}

export const SKIN_CONDITIONS = {
  acne: {
    name: 'Acne',
    descriptions: {
      mild: 'Few comedones and minor inflammatory lesions',
      moderate: 'Multiple papules, pustules, and comedones',
      severe: 'Deep cysts, nodules, and widespread inflammation'
    }
  },
  rosacea: {
    name: 'Rosacea',
    descriptions: {
      mild: 'Slight facial redness and occasional flushing',
      moderate: 'Persistent redness with visible blood vessels',
      severe: 'Severe inflammation with papules and potential eye involvement'
    }
  },
  wrinkles: {
    name: 'Fine Lines & Wrinkles',
    descriptions: {
      mild: 'Minor expression lines, barely visible at rest',
      moderate: 'Visible lines with moderate depth and length',
      severe: 'Deep wrinkles and significant skin texture changes'
    }
  },
  hyperpigmentation: {
    name: 'Hyperpigmentation',
    descriptions: {
      mild: 'Light spots or patches with minimal contrast',
      moderate: 'Noticeable dark spots affecting facial appearance',
      severe: 'Extensive pigmentation with significant skin discoloration'
    }
  },
  dryness: {
    name: 'Skin Dryness',
    descriptions: {
      mild: 'Slight tightness with minimal flaking',
      moderate: 'Noticeable dryness with some scaling',
      severe: 'Severe dehydration with cracking and irritation'
    }
  }
};

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isAdmin?: boolean;
}

export interface AdminStats {
  totalUsers: number;
  totalAnalyses: number;
  activeUsers: number;
  avgAnalysesPerUser: number;
  topConditions: { name: string; count: number }[];
}

export const SKIN_RECOMMENDATIONS = {
  acne: [
    'Use salicylic acid or benzoyl peroxide cleansers',
    'Apply non-comedogenic moisturizers',
    'Consider retinoid treatments for persistent cases',
    'Maintain consistent skincare routine'
  ],
  rosacea: [
    'Use gentle, fragrance-free products',
    'Apply broad-spectrum SPF daily',
    'Avoid known triggers (spicy foods, alcohol, extreme temperatures)',
    'Consider anti-inflammatory ingredients like niacinamide'
  ],
  wrinkles: [
    'Incorporate retinol or retinoids into routine',
    'Use peptide-rich moisturizers',
    'Apply vitamin C serum for antioxidant protection',
    'Never skip sunscreen to prevent further damage'
  ],
  hyperpigmentation: [
    'Use vitamin C and kojic acid serums',
    'Apply broad-spectrum SPF 30+ daily',
    'Consider chemical exfoliants (glycolic acid)',
    'Be consistent with treatment for 6-12 weeks'
  ],
  dryness: [
    'Use ceramide and hyaluronic acid moisturizers',
    'Apply face oils for extra hydration',
    'Use gentle, cream-based cleansers',
    'Consider overnight hydrating masks'
  ]
};