import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HistoryList from '../../components/HistoryList';
import { useSkinAnalysis } from '../../hooks/useSkinAnalysis';

export default function HistoryScreen() {
  const { analyses, deleteAnalysis, loadAnalyses } = useSkinAnalysis();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await loadAnalyses();
      } catch (error) {
        console.error('Error initializing history data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeData();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analysis History</Text>
        <Text style={styles.headerSubtitle}>
          {analyses.length > 0 
            ? `${analyses.length} analysis${analyses.length === 1 ? '' : 'es'} saved`
            : 'No analyses yet'
          }
        </Text>
      </View>

      <HistoryList
        analyses={analyses}
        onDeleteAnalysis={deleteAnalysis}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5F4'
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666'
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
  }
});