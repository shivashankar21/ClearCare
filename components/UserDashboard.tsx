import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { UserStats, SkinAnalysis } from '../constants/types';
import { useSkinAnalysis } from '../hooks/useSkinAnalysis';

interface UserDashboardProps {
  userStats: UserStats;
}

const { width } = Dimensions.get('window');

export default function UserDashboard({ userStats }: UserDashboardProps) {
  const { analyses } = useSkinAnalysis();
  
  // Generate symptom tracking data
  const getSymptomTrendData = () => {
    const last6Months = analyses.slice(0, 6).reverse();
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return months.slice(0, Math.min(6, analyses.length)).map((month, index) => {
      const analysis = last6Months[index];
      const severityScore = analysis ? calculateSeverityScore(analysis.conditions) : 0;
      const conditionCount = analysis ? analysis.conditions.length : 0;
      
      return {
        month,
        severity: severityScore,
        conditionCount,
        overallHealth: analysis?.overallHealth || 'good'
      };
    });
  };
  
  const calculateSeverityScore = (conditions: any[]) => {
    if (conditions.length === 0) return 0;
    
    const totalScore = conditions.reduce((sum, condition) => {
      switch (condition.severity) {
        case 'mild': return sum + 1;
        case 'moderate': return sum + 2;
        case 'severe': return sum + 3;
        default: return sum + 1;
      }
    }, 0);
    
    return Math.round((totalScore / conditions.length) * 100) / 100;
  };
  
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'fair': return '#FF9800';
      case 'poor': return '#F44336';
      default: return '#9E9E9E';
    }
  };
  
  const trendData = getSymptomTrendData();
  const getTrendIcon = () => {
    switch (userStats.improvementTrend) {
      case 'improving': return { name: 'trending-up', color: '#4CAF50' };
      case 'declining': return { name: 'trending-down', color: '#F44336' };
      default: return { name: 'trending-flat', color: '#FF9800' };
    }
  };

  const getTrendText = () => {
    switch (userStats.improvementTrend) {
      case 'improving': return 'Improving';
      case 'declining': return 'Needs Attention';
      default: return 'Stable';
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'No scans yet';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const trendIcon = getTrendIcon();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Your Skin Health Dashboard</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <MaterialIcons name="analytics" size={32} color="#4A90E2" />
          <Text style={styles.statValue}>{userStats.totalScans}</Text>
          <Text style={styles.statLabel}>Total Scans</Text>
        </View>
        
        <View style={styles.statCard}>
          <MaterialIcons name="schedule" size={32} color="#4A90E2" />
          <Text style={styles.statValueSmall}>{formatDate(userStats.latestScanDate)}</Text>
          <Text style={styles.statLabel}>Latest Scan</Text>
        </View>
        
        <View style={styles.statCard}>
          <MaterialIcons name="visibility" size={32} color="#4A90E2" />
          <Text style={styles.statValue}>{userStats.conditionsTracked.length}</Text>
          <Text style={styles.statLabel}>Conditions Tracked</Text>
        </View>
        
        <View style={styles.statCard}>
          <MaterialIcons name={trendIcon.name as any} size={32} color={trendIcon.color} />
          <Text style={[styles.statValueSmall, { color: trendIcon.color }]}>
            {getTrendText()}
          </Text>
          <Text style={styles.statLabel}>Trend</Text>
        </View>
      </View>

      {userStats.conditionsTracked.length > 0 && (
        <View style={styles.conditionsTracked}>
          <Text style={styles.sectionTitle}>Conditions Being Tracked</Text>
          <View style={styles.conditionTags}>
            {userStats.conditionsTracked.map((condition, index) => (
              <View key={index} style={styles.conditionTag}>
                <Text style={styles.conditionTagText}>{condition}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Symptom Trends Chart */}
      {analyses.length > 1 && (
        <View style={styles.trendsSection}>
          <Text style={styles.sectionTitle}>Skin Health Trends</Text>
          <Text style={styles.sectionSubtitle}>Track your progress over time</Text>
          
          {/* Chart Container */}
          <View style={styles.chartContainer}>
            <View style={styles.chartArea}>
              {/* Y-axis labels */}
              <View style={styles.yAxisLabels}>
                <Text style={styles.axisLabel}>High</Text>
                <Text style={styles.axisLabel}>Med</Text>
                <Text style={styles.axisLabel}>Low</Text>
                <Text style={styles.axisLabel}>None</Text>
              </View>
              
              {/* Chart bars */}
              <View style={styles.chartBars}>
                {trendData.map((data, index) => {
                  const barHeight = Math.max(20, (data.severity / 3) * 80 + 20);
                  const healthColor = getHealthColor(data.overallHealth);
                  
                  return (
                    <View key={index} style={styles.barContainer}>
                      <View style={styles.barArea}>
                        <View 
                          style={[
                            styles.bar,
                            { 
                              height: barHeight,
                              backgroundColor: healthColor,
                              opacity: 0.8
                            }
                          ]}
                        />
                        {data.conditionCount > 0 && (
                          <View style={[styles.conditionBadge, { backgroundColor: healthColor }]}>
                            <Text style={styles.conditionBadgeText}>{data.conditionCount}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.monthLabel}>{data.month}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
          
          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendText}>Excellent</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#8BC34A' }]} />
              <Text style={styles.legendText}>Good</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
              <Text style={styles.legendText}>Fair</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
              <Text style={styles.legendText}>Poor</Text>
            </View>
          </View>
        </View>
      )}
      
      {/* Recent Conditions Overview */}
      {analyses.length > 0 && (
        <View style={styles.recentConditions}>
          <Text style={styles.sectionTitle}>Recent Analysis Summary</Text>
          {analyses.slice(0, 3).map((analysis, index) => {
            const timeAgo = getTimeAgo(analysis.timestamp);
            return (
              <View key={analysis.id} style={styles.recentAnalysisCard}>
                <View style={styles.analysisHeader}>
                  <Text style={styles.analysisDate}>{timeAgo}</Text>
                  <View style={[styles.healthIndicator, { backgroundColor: getHealthColor(analysis.overallHealth) }]}>
                    <Text style={styles.healthIndicatorText}>{analysis.overallHealth.toUpperCase()}</Text>
                  </View>
                </View>
                
                {analysis.conditions.length > 0 ? (
                  <View style={styles.conditionsContainer}>
                    {analysis.conditions.slice(0, 2).map((condition, condIndex) => (
                      <View key={condIndex} style={styles.conditionItem}>
                        <MaterialIcons name="circle" size={6} color="#666" />
                        <Text style={styles.conditionText}>
                          {condition.condition} ({condition.severity})
                        </Text>
                      </View>
                    ))}
                    {analysis.conditions.length > 2 && (
                      <Text style={styles.moreConditions}>+{analysis.conditions.length - 2} more</Text>
                    )}
                  </View>
                ) : (
                  <View style={styles.noConditionsContainer}>
                    <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                    <Text style={styles.noConditionsText}>No concerns detected</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}

      {userStats.totalScans === 0 && (
        <View style={styles.emptyState}>
          <MaterialIcons name="camera-alt" size={48} color="#ccc" />
          <Text style={styles.emptyTitle}>Start Your Skin Health Journey</Text>
          <Text style={styles.emptyDescription}>
            Take your first skin analysis to begin tracking your progress and receive personalized recommendations.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function getTimeAgo(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(232, 245, 244, 0.95)'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A4D4A',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 20
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 20
  },

  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(109, 189, 182, 0.2)'
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A4D4A',
    marginTop: 8,
    marginBottom: 4
  },
  statValueSmall: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A4D4A',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center'
  },
  statLabel: {
    fontSize: 12,
    color: '#4A7A78',
    textAlign: 'center',
    fontWeight: '600'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A4D4A',
    marginBottom: 12
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#4A7A78',
    marginBottom: 16,
    fontWeight: '500'
  },
  conditionsTracked: {
    marginBottom: 24,
    paddingHorizontal: 20
  },
  conditionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  conditionTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4A90E2'
  },
  conditionTagText: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500'
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f8f9fa',
    borderRadius: 12
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8
  },
  emptyDescription: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20
  },
  // Trends Chart Styles
  trendsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(109, 189, 182, 0.2)'
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16
  },
  chartArea: {
    flexDirection: 'row',
    height: 120,
    alignItems: 'flex-end'
  },
  yAxisLabels: {
    justifyContent: 'space-between',
    height: 100,
    marginRight: 12,
    paddingVertical: 4
  },
  axisLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right'
  },
  chartBars: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 100
  },
  barContainer: {
    alignItems: 'center',
    flex: 1
  },
  barArea: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 100
  },
  bar: {
    width: 24,
    borderRadius: 4,
    minHeight: 8
  },
  conditionBadge: {
    position: 'absolute',
    top: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4
  },
  conditionBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold'
  },
  monthLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 8,
    textAlign: 'center'
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2
  },
  legendText: {
    fontSize: 11,
    color: '#666'
  },
  // Recent Conditions Styles
  recentConditions: {
    paddingHorizontal: 20,
    marginBottom: 20
  },
  recentAnalysisCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(109, 189, 182, 0.2)'
  },
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  analysisDate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A4D4A'
  },
  healthIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  healthIndicatorText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '700'
  },
  conditionsContainer: {
    gap: 4
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  conditionText: {
    fontSize: 13,
    color: '#4A7A78',
    flex: 1,
    fontWeight: '500'
  },
  moreConditions: {
    fontSize: 12,
    color: '#4A90E2',
    fontStyle: 'italic',
    marginLeft: 14
  },
  noConditionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  noConditionsText: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '500'
  }
});