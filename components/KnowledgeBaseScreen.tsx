
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Modal,
  Alert
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KnowledgeBaseService } from '../services/knowledgeBaseService';
import { SkinConditionInfo } from '../constants/types';
import { useRouter } from 'expo-router';

export default function KnowledgeBaseScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [conditions, setConditions] = useState<SkinConditionInfo[]>([]);
  const [filteredConditions, setFilteredConditions] = useState<SkinConditionInfo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<SkinConditionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onOk?: () => void;
  }>({ visible: false, title: '', message: '' });
  
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const showAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === 'web') {
      setAlertConfig({ visible: true, title, message, onOk });
    } else {
      Alert.alert(title, message, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterConditions();
  }, [searchQuery, selectedCategory, conditions]);

  const handleSearch = () => {
    filterConditions();
  };

  const loadData = () => {
    setIsLoading(true);
    try {
      const allConditions = KnowledgeBaseService.getAllConditions();
      const allCategories = KnowledgeBaseService.getCategories();
      
      setConditions(allConditions);
      setCategories(['all', ...allCategories]);
      setFilteredConditions(allConditions); // Show all results by default
    } catch (error) {
      showAlert('Error', 'Failed to load conditions data.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterConditions = () => {
    let filtered = conditions;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(condition => 
        condition.name.toLowerCase().includes(query) ||
        condition.description.toLowerCase().includes(query) ||
        (condition.aliases && condition.aliases.some(alias => 
          alias.toLowerCase().includes(query)
        ))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(condition => condition.category === selectedCategory);
    }

    setFilteredConditions(filtered);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return '#4CAF50';
      case 'moderate': return '#FF9800';
      case 'severe': return '#F44336';
      default: return '#757575';
    }
  };

  const formatCategoryName = (category: string) => {
    if (category === 'all') return 'All';
    
    // Shorten long category names for better UI
    const shortNames: { [key: string]: string } = {
      'Inflammatory & Allergic Skin Disorders': 'Inflammatory',
      'Infectious Skin Conditions': 'Infectious',
      'Autoimmune & Systemic Skin Disorders': 'Autoimmune',
      'Traumatic / Physical Skin Conditions': 'Physical',
      'Pigmentation & Growth Disorders': 'Pigmentation',
      'Sebaceous & Glandular Disorders': 'Sebaceous'
    };
    
    return shortNames[category] || category;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading skin conditions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image
        source={{ uri: 'https://cdn-ai.onspace.ai/onspace/project/image/GcwaZAoxDPxae5em3e5rUK/1000031465.jpg' }}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      
      {/* Content Container */}
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Skin Guide</Text>
          <Text style={styles.headerSubtitle}>Learn about common skin conditions</Text>
        </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search skin conditions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
            }}>)
              <MaterialIcons name="clear" size={20} color="#666" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <MaterialIcons name="search" size={20} color="#4A90E2" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryChipText,
              selectedCategory === category && styles.categoryChipTextActive
            ]} numberOfLines={1}>
              {formatCategoryName(category)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {filteredConditions.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <MaterialIcons name="search-off" size={48} color="#ccc" />
            <Text style={styles.noResultsText}>
              No conditions found
            </Text>
            <Text style={styles.noResultsSubtext}>
              Try adjusting your search terms or category filter
            </Text>
          </View>
        ) : (
          <View style={styles.conditionsList}>
            {filteredConditions.map((condition) => (
              <ConditionCard
                key={condition.id}
                condition={condition}
                onPress={() => setSelectedCondition(condition)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Condition Detail Modal */}
      {selectedCondition && (
        <Modal
          visible={true}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setSelectedCondition(null)}
        >
          <ConditionDetailScreen 
            condition={selectedCondition} 
            onClose={() => setSelectedCondition(null)}
          />
        </Modal>
      )}
      
      {Platform.OS === 'web' && (
        <Modal visible={alertConfig.visible} transparent animationType="fade">
          <View style={styles.alertOverlay}>
            <View style={styles.alertContainer}>
              <Text style={styles.alertTitle}>{alertConfig.title}</Text>
              <Text style={styles.alertMessage}>{alertConfig.message}</Text>
              <TouchableOpacity 
                style={styles.alertButton}
                onPress={() => {
                  alertConfig.onOk?.();
                  setAlertConfig(prev => ({ ...prev, visible: false }));
                }}
              >
                <Text style={styles.alertButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      </View>
    </View>
  );
}

function ConditionCard({ condition, onPress }: { condition: SkinConditionInfo; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.conditionCard} onPress={onPress}>
      {condition.imageUrl && condition.imageUrl.length > 0 && (
        <Image
          source={{ uri: condition.imageUrl }}
          style={styles.conditionImage}
          contentFit="cover"
          placeholder="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&blur=10"
        />
      )}
      
      <View style={styles.conditionContent}>
        <Text style={styles.conditionName}>{condition.name}</Text>
        
        <Text style={styles.conditionCategory}>{condition.category}</Text>
        
        {condition.aliases && condition.aliases.length > 0 && (
          <Text style={styles.conditionAliases}>
            Also known as: {condition.aliases.join(', ')}
          </Text>
        )}
        
        <Text style={styles.conditionDescription} numberOfLines={2}>
          {condition.description}
        </Text>
        
        <View style={styles.conditionFooter}>
          <Text style={styles.prevalenceText}>Affects {condition.prevalence}</Text>
          <MaterialIcons name="chevron-right" size={20} color="#4A90E2" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function ConditionDetailScreen({ condition, onClose }: { condition: SkinConditionInfo; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return '#4CAF50';
      case 'moderate': return '#FF9800';
      case 'severe': return '#F44336';
      default: return '#757575';
    }
  };

  return (
    <View style={[styles.detailContainer, { paddingTop: insets.top }]}>
      <View style={styles.detailHeader}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.detailTitle}>{condition.name}</Text>
        <View style={[styles.detailSeverityBadge, { backgroundColor: getSeverityColor(condition.severity) }]}>
          <Text style={styles.detailSeverityText}>{condition.severity.toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
        {condition.imageUrl && condition.imageUrl.length > 0 && (
          <View style={styles.detailImageContainer}>
            <Image
              source={{ uri: condition.imageUrl }}
              style={styles.detailImage}
              contentFit="cover"
              placeholder="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&blur=10"
            />
            {condition.imageAlt && condition.imageAlt.length > 0 && (
              <Text style={styles.imageCaption}>{condition.imageAlt}</Text>
            )}
          </View>
        )}
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Overview</Text>
          <Text style={styles.detailDescription}>{condition.description}</Text>
          
          {condition.aliases && condition.aliases.length > 0 && (
            <View style={styles.aliasContainer}>
              <Text style={styles.aliasLabel}>Also known as:</Text>
              <Text style={styles.aliasText}>{condition.aliases.join(', ')}</Text>
            </View>
          )}
          
          <Text style={styles.detailPrevalence}>Prevalence: {condition.prevalence}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Symptoms</Text>
          {condition.symptoms.map((symptom, index) => (
            <View key={index} style={styles.detailListItem}>
              <MaterialIcons name="circle" size={6} color="#4A90E2" />
              <Text style={styles.detailListText}>{symptom}</Text>
            </View>
          ))}
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Causes</Text>
          {condition.causes.map((cause, index) => (
            <View key={index} style={styles.detailListItem}>
              <MaterialIcons name="circle" size={6} color="#FF9800" />
              <Text style={styles.detailListText}>{cause}</Text>
            </View>
          ))}
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Treatments</Text>
          {condition.treatments.map((treatment, index) => (
            <View key={index} style={styles.detailListItem}>
              <MaterialIcons name="circle" size={6} color="#4CAF50" />
              <Text style={styles.detailListText}>{treatment}</Text>
            </View>
          ))}
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Prevention</Text>
          {condition.prevention.map((prevention, index) => (
            <View key={index} style={styles.detailListItem}>
              <MaterialIcons name="circle" size={6} color="#9C27B0" />
              <Text style={styles.detailListText}>{prevention}</Text>
            </View>
          ))}
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>When to See a Doctor</Text>
          {condition.whenToSeeDoctor.map((reason, index) => (
            <View key={index} style={styles.detailListItem}>
              <MaterialIcons name="warning" size={16} color="#F44336" />
              <Text style={styles.detailListText}>{reason}</Text>
            </View>
          ))}
        </View>

        <View style={styles.disclaimerSection}>
          <MaterialIcons name="info-outline" size={20} color="#FF9800" />
          <Text style={styles.disclaimerText}>
            {KnowledgeBaseService.getDisclaimer()}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%'
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'rgba(248, 249, 250, 0.95)'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa'
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
    borderBottomColor: 'rgba(240, 240, 240, 0.8)'
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(240, 240, 240, 0.8)'
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12
  },
  searchButton: {
    padding: 4,
    marginLeft: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333'
  },
  categoryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(240, 240, 240, 0.8)',
    maxHeight: 50
  },
  categoryContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center'
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  categoryChipActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2'
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center'
  },
  categoryChipTextActive: {
    color: 'white'
  },
  resultsContainer: {
    flex: 1
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center'
  },
  conditionsList: {
    padding: 20,
    gap: 12
  },
  searchButton: {
    padding: 4,
    marginLeft: 8
  },
  conditionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  conditionImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f8f9fa'
  },
  conditionContent: {
    padding: 16
  },
  conditionName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A4D4A',
    marginBottom: 8
  },
  conditionCategory: {
    fontSize: 14,
    color: '#4A90E2',
    marginBottom: 4
  },
  conditionAliases: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8
  },
  conditionDescription: {
    fontSize: 14,
    color: '#4A7A78',
    lineHeight: 20,
    marginBottom: 12
  },
  conditionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  prevalenceText: {
    fontSize: 12,
    color: '#999'
  },
  // Detail Screen Styles
  detailContainer: {
    flex: 1,
    backgroundColor: 'rgba(248, 249, 250, 0.95)'
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(240, 240, 240, 0.8)'
  },
  closeButton: {
    marginRight: 16
  },
  detailTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#1A4D4A'
  },
  detailSeverityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  detailSeverityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700'
  },
  detailContent: {
    flex: 1
  },
  detailImageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginTop: 8
  },
  detailImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f8f9fa'
  },
  imageCaption: {
    padding: 12,
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    backgroundColor: '#f8f9fa'
  },
  detailSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginTop: 8,
    padding: 20
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A4D4A',
    marginBottom: 12
  },
  detailDescription: {
    fontSize: 16,
    color: '#4A7A78',
    lineHeight: 24,
    marginBottom: 12
  },
  detailPrevalence: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500'
  },
  aliasContainer: {
    marginVertical: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 6
  },
  aliasLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2
  },
  aliasText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic'
  },
  detailListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 4
  },
  detailListText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 12
  },
  disclaimerSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff8f0',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE0B2'
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginLeft: 12
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
    minWidth: 280
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 20
  },
  alertButton: {
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center'
  },
  alertButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});
