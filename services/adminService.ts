import { AdminStats, SkinAnalysis, User } from '../constants/types';
import { SkinAnalysisService } from './skinAnalysisService';

export class AdminService {
  static generateMockAdminStats(): AdminStats {
    return {
      totalUsers: 1247,
      totalAnalyses: 3892,
      activeUsers: 324,
      avgAnalysesPerUser: 3.1,
      topConditions: [
        { name: 'Acne', count: 1456 },
        { name: 'Hyperpigmentation', count: 892 },
        { name: 'Fine Lines & Wrinkles', count: 743 },
        { name: 'Rosacea', count: 521 },
        { name: 'Skin Dryness', count: 280 }
      ]
    };
  }

  static generateMockRecentAnalyses(): SkinAnalysis[] {
    const analyses: SkinAnalysis[] = [];
    const userNames = ['John D.', 'Jane S.', 'Mike R.', 'Emily C.', 'David L.', 'Sarah M.'];
    
    for (let i = 0; i < 10; i++) {
      const analysis = SkinAnalysisService.generateMockAnalysis();
      // Add mock user info
      (analysis as any).userName = userNames[Math.floor(Math.random() * userNames.length)];
      // Set timestamp to recent dates
      const daysAgo = Math.floor(Math.random() * 7);
      analysis.timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      analyses.push(analysis);
    }
    
    return analyses.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  static getMockUserGrowthData() {
    const data = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    for (let i = 0; i < months.length; i++) {
      data.push({
        month: months[i],
        users: Math.floor(Math.random() * 200) + 150,
        analyses: Math.floor(Math.random() * 600) + 400
      });
    }
    
    return data;
  }

  static getMockConditionTrends() {
    return [
      { condition: 'Acne', trend: 'increasing', percentage: '+12%' },
      { condition: 'Hyperpigmentation', trend: 'stable', percentage: '+2%' },
      { condition: 'Wrinkles', trend: 'decreasing', percentage: '-5%' },
      { condition: 'Rosacea', trend: 'increasing', percentage: '+8%' }
    ];
  }
}