import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { AdminStats, SkinAnalysis, User } from '../constants/types';
import { AdminService } from '../services/adminService';
import { AuthService } from '../services/authService';

export default function AdminDashboard() {
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<SkinAnalysis[]>([]);
  const [mockUsers, setMockUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analyses'>('overview');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = () => {
    setAdminStats(AdminService.generateMockAdminStats());
    setRecentAnalyses(AdminService.generateMockRecentAnalyses());
    setMockUsers(AuthService.getMockUsers());
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return '#4CAF50';
      case 'moderate': return '#FF9800';
      case 'severe': return '#F44336';
      default: return '#757575';
    }
  };

  const renderOverview = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {adminStats && (
        <>
          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialIcons name="people" size={32} color="#4A90E2" />
              <Text style={styles.statValue}>{adminStats.totalUsers.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialIcons name="analytics" size={32} color="#4CAF50" />
              <Text style={styles.statValue}>{adminStats.totalAnalyses.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Analyses</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialIcons name="trending-up" size={32} color="#FF9800" />
              <Text style={styles.statValue}>{adminStats.activeUsers}</Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialIcons name="bar-chart" size={32} color="#9C27B0" />
              <Text style={styles.statValue}>{adminStats.avgAnalysesPerUser}</Text>
              <Text style={styles.statLabel}>Avg per User</Text>
            </View>
          </View>

          {/* Top Conditions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Detected Conditions</Text>
            <View style={styles.conditionsChart}>
              {adminStats.topConditions.map((condition, index) => (
                <View key={index} style={styles.conditionRow}>
                  <Text style={styles.conditionName}>{condition.name}</Text>
                  <View style={styles.conditionBar}>
                    <View 
                      style={[
                        styles.conditionProgress, 
                        { 
                          width: `${(condition.count / adminStats.topConditions[0].count) * 100}%`,
                          backgroundColor: ['#4A90E2', '#4CAF50', '#FF9800', '#9C27B0', '#F44336'][index]
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.conditionCount}>{condition.count}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Condition Trends */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Condition Trends</Text>
            <View style={styles.trendsContainer}>
              {AdminService.getMockConditionTrends().map((trend, index) => (
                <View key={index} style={styles.trendItem}>
                  <MaterialIcons 
                    name={trend.trend === 'increasing' ? 'trending-up' : 
                          trend.trend === 'decreasing' ? 'trending-down' : 'trending-flat'} 
                    size={20} 
                    color={trend.trend === 'increasing' ? '#F44336' : 
                           trend.trend === 'decreasing' ? '#4CAF50' : '#FF9800'} 
                  />
                  <Text style={styles.trendCondition}>{trend.condition}</Text>
                  <Text style={[
                    styles.trendPercentage,
                    { color: trend.trend === 'increasing' ? '#F44336' : 
                             trend.trend === 'decreasing' ? '#4CAF50' : '#FF9800' }
                  ]}>
                    {trend.percentage}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );

  const renderUsers = () => (
    <FlatList
      data={mockUsers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.userItem}>
          <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            {item.isAdmin && (
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
            )}
          </View>
          <MaterialIcons name="more-vert" size={24} color="#666" />
        </View>
      )}
      style={styles.tabContent}
      contentContainerStyle={styles.listContainer}
    />
  );

  const renderAnalyses = () => (
    <FlatList
      data={recentAnalyses}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.analysisItem}>
          <View style={styles.analysisHeader}>
            <Text style={styles.analysisUser}>{(item as any).userName}</Text>
            <Text style={styles.analysisDate}>{formatDate(item.timestamp)}</Text>
          </View>
          
          <Text style={styles.analysisSkinType}>
            {item.skinType.charAt(0).toUpperCase() + item.skinType.slice(1)} skin
          </Text>
          
          {item.conditions.length > 0 ? (
            <View style={styles.analysisConditions}>
              {item.conditions.slice(0, 2).map((condition, index) => (
                <View key={index} style={styles.conditionTag}>
                  <Text style={styles.conditionTagText}>{condition.condition}</Text>
                  <View style={[styles.severityDot, { backgroundColor: getSeverityColor(condition.severity) }]} />
                </View>
              ))}
              {item.conditions.length > 2 && (
                <Text style={styles.moreConditions}>+{item.conditions.length - 2} more</Text>
              )}
            </View>
          ) : (
            <Text style={styles.noConditionsFound}>No conditions detected</Text>
          )}
        </View>
      )}
      style={styles.tabContent}
      contentContainerStyle={styles.listContainer}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>System overview and user management</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <MaterialIcons name="dashboard" size={20} color={activeTab === 'overview' ? '#4A90E2' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <MaterialIcons name="people" size={20} color={activeTab === 'users' ? '#4A90E2' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>Users</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'analyses' && styles.activeTab]}
          onPress={() => setActiveTab('analyses')}
        >
          <MaterialIcons name="analytics" size={20} color={activeTab === 'analyses' ? '#4A90E2' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'analyses' && styles.activeTabText]}>Analyses</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'users' && renderUsers()}
      {activeTab === 'analyses' && renderAnalyses()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666'
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 6
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2'
  },
  tabText: {
    fontSize: 14,
    color: '#666'
  },
  activeTabText: {
    color: '#4A90E2',
    fontWeight: '600'
  },
  tabContent: {
    flex: 1
  },
  listContainer: {
    padding: 20,
    gap: 12
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
    marginBottom: 4
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16
  },
  conditionsChart: {
    gap: 12
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  conditionName: {
    flex: 1,
    fontSize: 14,
    color: '#333'
  },
  conditionBar: {
    flex: 2,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4
  },
  conditionProgress: {
    height: '100%',
    borderRadius: 4
  },
  conditionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    minWidth: 40,
    textAlign: 'right'
  },
  trendsContainer: {
    gap: 12
  },
  trendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8
  },
  trendCondition: {
    flex: 1,
    fontSize: 14,
    color: '#333'
  },
  trendPercentage: {
    fontSize: 14,
    fontWeight: '600'
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  adminBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },
  adminBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '700'
  },
  analysisItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  analysisUser: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  analysisDate: {
    fontSize: 14,
    color: '#666'
  },
  analysisSkinType: {
    fontSize: 14,
    color: '#4A90E2',
    marginBottom: 8
  },
  analysisConditions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  conditionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4
  },
  conditionTagText: {
    fontSize: 12,
    color: '#4A90E2'
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  moreConditions: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic'
  },
  noConditionsFound: {
    fontSize: 14,
    color: '#4CAF50',
    fontStyle: 'italic'
  }
});