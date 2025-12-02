import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { SkinAnalysis, SkinCondition } from '../constants/types';

interface AnalysisResultsProps {
  analysis: SkinAnalysis;
  onSave: () => void;
  onRetake: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function AnalysisResults({ 
  analysis, 
  onSave, 
  onRetake, 
  showBackButton = false, 
  onBack 
}: AnalysisResultsProps) {
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

  const formatSkinType = (skinType: string) => {
    return skinType.charAt(0).toUpperCase() + skinType.slice(1);
  };

  const formatHealth = (health: string) => {
    return health.charAt(0).toUpperCase() + health.slice(1);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Image Preview */}
      {analysis.imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: analysis.imageUri }} style={styles.image} />
        </View>
      )}

      {/* Analysis Overview */}
      <View style={styles.overviewSection}>
        <Text style={styles.sectionTitle}>Analysis Overview</Text>
        
        <View style={styles.overviewCards}>
          <View style={styles.overviewCard}>
            <MaterialIcons name="face" size={24} color="#4A90E2" />
            <Text style={styles.overviewLabel}>Skin Type</Text>
            <Text style={styles.overviewValue}>{formatSkinType(analysis.skinType)}</Text>
          </View>
          
          <View style={styles.overviewCard}>
            <MaterialIcons name="favorite" size={24} color={getHealthColor(analysis.overallHealth)} />
            <Text style={styles.overviewLabel}>Overall Health</Text>
            <Text style={[styles.overviewValue, { color: getHealthColor(analysis.overallHealth) }]}>
              {formatHealth(analysis.overallHealth)}
            </Text>
          </View>
        </View>
      </View>

      {/* Detected Conditions */}
      <View style={styles.conditionsSection}>
        <Text style={styles.sectionTitle}>Detected Conditions</Text>
        
        {analysis.conditions.length === 0 ? (
          <View style={styles.noConditionsCard}>
            <MaterialIcons name="check-circle" size={32} color="#4CAF50" />
            <Text style={styles.noConditionsText}>No significant conditions detected</Text>
            <Text style={styles.noConditionsSubtext}>Your skin appears healthy!</Text>
          </View>
        ) : (
          <View style={styles.conditionsList}>
            {analysis.conditions.map((condition, index) => (
              <ConditionCard key={index} condition={condition} />
            ))}
          </View>
        )}
      </View>

      {/* Recommendations */}
      <View style={styles.recommendationsSection}>
        <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
        
        <View style={styles.recommendationsList}>
          {analysis.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <MaterialIcons name="lightbulb-outline" size={20} color="#4A90E2" />
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Medical Disclaimer */}
      <View style={styles.disclaimerSection}>
        <MaterialIcons name="info-outline" size={20} color="#FF9800" />
        <Text style={styles.disclaimerText}>
          This analysis is for informational purposes only and should not replace professional medical advice. 
          Please consult with a dermatologist for proper diagnosis and treatment.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {showBackButton && onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={20} color="#4A90E2" />
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.retakeButton} onPress={onRetake}>
            <MaterialIcons name="refresh" size={20} color="#666" />
            <Text style={styles.retakeButtonText}>Retake Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <MaterialIcons name="save" size={20} color="white" />
            <Text style={styles.saveButtonText}>Save Analysis</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function ConditionCard({ condition }: { condition: SkinCondition }) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return '#4CAF50';
      case 'moderate': return '#FF9800';
      case 'severe': return '#F44336';
      default: return '#757575';
    }
  };

  return (
    <View style={styles.conditionCard}>
      <View style={styles.conditionHeader}>
        <Text style={styles.conditionName}>{condition.condition}</Text>
        <View style={styles.conditionMetrics}>
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(condition.severity) }]}>
            <Text style={styles.severityText}>{condition.severity.toUpperCase()}</Text>
          </View>
          <Text style={styles.confidenceText}>{condition.confidence}% confident</Text>
        </View>
      </View>
      
      <Text style={styles.affectedArea}>Affected area: {condition.affectedArea}</Text>
      <Text style={styles.conditionDescription}>{condition.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(232, 245, 244, 0.95)'
  },
  imageContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)'
  },
  image: {
    width: 200,
    height: 240,
    borderRadius: 12
  },
  overviewSection: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginTop: 8
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A4D4A',
    marginBottom: 16
  },
  overviewCards: {
    flexDirection: 'row',
    gap: 12
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  overviewLabel: {
    fontSize: 12,
    color: '#4A7A78',
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '600'
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A4D4A'
  },
  conditionsSection: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginTop: 8
  },
  noConditionsCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f0f8f0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50'
  },
  noConditionsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: 12
  },
  noConditionsSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  conditionsList: {
    gap: 12
  },
  conditionCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2'
  },
  conditionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  conditionName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A4D4A',
    flex: 1
  },
  conditionMetrics: {
    alignItems: 'flex-end'
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 4
  },
  severityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700'
  },
  confidenceText: {
    fontSize: 12,
    color: '#666'
  },
  affectedArea: {
    fontSize: 14,
    color: '#4A90E2',
    marginBottom: 8
  },
  conditionDescription: {
    fontSize: 14,
    color: '#4A7A78',
    lineHeight: 20
  },
  recommendationsSection: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginTop: 8
  },
  recommendationsList: {
    gap: 12
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    backgroundColor: '#f0f7ff',
    borderRadius: 8
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#1A4D4A',
    lineHeight: 20,
    fontWeight: '500'
  },
  disclaimerSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 20,
    backgroundColor: '#fff8f0',
    margin: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE0B2'
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    lineHeight: 18
  },
  actionButtons: {
    gap: 12,
    padding: 20,
    paddingBottom: 40
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A90E2',
    marginBottom: 8
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2'
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666'
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: '#4A90E2',
    borderRadius: 8
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white'
  }
});