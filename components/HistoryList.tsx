import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  Modal
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { SkinAnalysis } from '../constants/types';

interface HistoryListProps {
  analyses: SkinAnalysis[];
  onDeleteAnalysis: (id: string) => void;
  onViewAnalysis?: (analysis: SkinAnalysis) => void;
}

export default function HistoryList({ analyses, onDeleteAnalysis, onViewAnalysis }: HistoryListProps) {
  const [alertConfig, setAlertConfig] = React.useState<{
    visible: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({ visible: false, title: '', message: '' });

  const showAlert = (title: string, message: string, onConfirm?: () => void, onCancel?: () => void) => {
    if (Platform.OS === 'web') {
      setAlertConfig({ visible: true, title, message, onConfirm, onCancel });
    } else {
      Alert.alert(
        title,
        message,
        [
          { text: 'Cancel', style: 'cancel', onPress: onCancel },
          { text: 'Delete', style: 'destructive', onPress: onConfirm }
        ]
      );
    }
  };

  const handleDelete = (id: string) => {
    showAlert(
      'Delete Analysis',
      'Are you sure you want to delete this analysis? This action can not be undone.',
      () => onDeleteAnalysis(id)
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'fair': return '#FF9800';
      case 'poor': return '#F44336';
      default: return '#757575';
    }
  };

  const renderAnalysisItem = ({ item }: { item: SkinAnalysis }) => (
    <TouchableOpacity 
      style={styles.analysisCard}
      onPress={() => onViewAnalysis?.(item)}
    >
      <View style={styles.cardHeader}>
        {item.imageUri && (
          <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
        )}
        
        <View style={styles.headerInfo}>
          <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
          <View style={styles.healthIndicator}>
            <View style={[styles.healthDot, { backgroundColor: getHealthColor(item.overallHealth) }]} />
            <Text style={[styles.healthText, { color: getHealthColor(item.overallHealth) }]}>
              {item.overallHealth.charAt(0).toUpperCase() + item.overallHealth.slice(1)} Health
            </Text>
          </View>
          <Text style={styles.skinTypeText}>
            {item.skinType.charAt(0).toUpperCase() + item.skinType.slice(1)} Skin
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <MaterialIcons name="delete-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      
      {item.conditions.length > 0 && (
        <View style={styles.conditionsSection}>
          <Text style={styles.conditionsTitle}>Detected Conditions:</Text>
          <View style={styles.conditionsList}>
            {item.conditions.slice(0, 3).map((condition, index) => (
              <View key={index} style={styles.conditionItem}>
                <Text style={styles.conditionName}>{condition.condition}</Text>
                <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(condition.severity) }]}>
                  <Text style={styles.severityText}>{condition.severity.charAt(0).toUpperCase()}</Text>
                </View>
              </View>
            ))}
            {item.conditions.length > 3 && (
              <Text style={styles.moreConditions}>+{item.conditions.length - 3} more</Text>
            )}
          </View>
        </View>
      )}
      
      {item.conditions.length === 0 && (
        <View style={styles.noConditions}>
          <MaterialIcons name="check-circle-outline" size={16} color="#4CAF50" />
          <Text style={styles.noConditionsText}>No conditions detected</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (analyses.length === 0) {
    return (
      <View style={styles.emptyState}>
        <MaterialIcons name="history" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No Analysis History</Text>
        <Text style={styles.emptyDescription}>
          Your skin analysis history will appear here once you start taking scans.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={analyses}
        keyExtractor={(item) => item.id}
        renderItem={renderAnalysisItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      
      {Platform.OS === 'web' && (
        <Modal visible={alertConfig.visible} transparent animationType="fade">
          <View style={styles.alertOverlay}>
            <View style={styles.alertContainer}>
              <Text style={styles.alertTitle}>{alertConfig.title}</Text>
              <Text style={styles.alertMessage}>{alertConfig.message}</Text>
              <View style={styles.alertButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => {
                    alertConfig.onCancel?.();
                    setAlertConfig(prev => ({ ...prev, visible: false }));
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.confirmButton}
                  onPress={() => {
                    alertConfig.onConfirm?.();
                    setAlertConfig(prev => ({ ...prev, visible: false }));
                  }}
                >
                  <Text style={styles.confirmButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(232, 245, 244, 0.95)'
  },
  listContainer: {
    padding: 20,
    gap: 12
  },
  analysisCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(109, 189, 182, 0.2)'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  thumbnail: {
    width: 50,
    height: 60,
    borderRadius: 8,
    marginRight: 12
  },
  headerInfo: {
    flex: 1
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A4D4A',
    marginBottom: 4
  },
  healthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2
  },
  healthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  healthText: {
    fontSize: 14,
    fontWeight: '500'
  },
  skinTypeText: {
    fontSize: 12,
    color: '#4A7A78',
    fontWeight: '500'
  },
  deleteButton: {
    padding: 8
  },
  conditionsSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12
  },
  conditionsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A7A78',
    marginBottom: 8
  },
  conditionsList: {
    gap: 6
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  conditionName: {
    fontSize: 14,
    color: '#1A4D4A',
    flex: 1,
    fontWeight: '600'
  },
  severityBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  severityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700'
  },
  moreConditions: {
    fontSize: 12,
    color: '#4A90E2',
    fontStyle: 'italic'
  },
  noConditions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12
  },
  noConditionsText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  emptyTitle: {
    fontSize: 20,
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
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    minWidth: 300
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666'
  },
  alertButtons: {
    flexDirection: 'row',
    gap: 12
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center'
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600'
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    backgroundColor: '#F44336',
    alignItems: 'center'
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600'
  }
});