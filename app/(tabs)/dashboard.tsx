import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UserDashboard from '../../components/UserDashboard';
import { useSkinAnalysis } from '../../hooks/useSkinAnalysis';

export default function DashboardScreen() {
  const { userStats } = useSkinAnalysis();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>
          Track your skin health progress
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <UserDashboard userStats={userStats} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5F4'
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(184, 230, 220, 0.5)'
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A4D4A',
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#4A7A78',
    fontWeight: '500'
  },
  content: {
    flex: 1
  }
});