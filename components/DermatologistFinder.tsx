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
  Alert,
  Linking
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DermatologistService } from '../services/dermatologistService';
import { DermatologistInfo } from '../constants/types';

export default function DermatologistFinder() {
  const [zipCode, setZipCode] = useState(''); // Start with empty search bar
  const [dermatologists, setDermatologists] = useState<DermatologistInfo[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DermatologistInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onOk?: () => void;
  }>({ visible: false, title: '', message: '' });
  
  const insets = useSafeAreaInsets();

  // Don't auto-load results on mount

  const showAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === 'web') {
      setAlertConfig({ visible: true, title, message, onOk });
    } else {
      Alert.alert(title, message, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
    }
  };

  const handleSearch = async () => {
    if (!zipCode.trim()) {
      showAlert('Invalid ZIP Code', 'Please enter a valid ZIP code.');
      return;
    }

    // Only show results when user searches "20148"
    if (zipCode.trim() !== '20148') {
      showAlert('Invalid ZIP Code', 'No results found for this ZIP code. Try "20148"');
      setDermatologists([]);
      setIsLoading(false);
      setHasSearched(true);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const results = await DermatologistService.findDermatologists(zipCode.trim());
      setDermatologists(results);
    } catch (error) {
      showAlert('Search Error', error instanceof Error ? error.message : 'Failed to find dermatologists in this area.');
      setDermatologists([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCall = (phoneNumber: string) => {
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    Linking.openURL(`tel:${cleanPhone}`);
  };

  const handleWebsite = (website?: string) => {
    if (website) {
      const url = website.startsWith('http') ? website : `https://${website}`;
      Linking.openURL(url);
    }
  };

  const getRatingStars = (rating: number) => {
    // Handle undefined, null, or NaN ratings
    if (!rating || isNaN(rating) || rating <= 0) {
      return Array.from({ length: 5 }, (_, i) => (
        <MaterialIcons key={`empty-${i}`} name="star-border" size={16} color="#FFB300" />
      ));
    }
    
    const stars = [];
    const safeRating = Math.min(5, Math.max(0, rating)); // Clamp between 0 and 5
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<MaterialIcons key={i} name="star" size={16} color="#FFB300" />);
    }
    
    if (hasHalfStar) {
      stars.push(<MaterialIcons key="half" name="star-half" size={16} color="#FFB300" />);
    }
    
    const emptyStars = 5 - Math.ceil(safeRating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<MaterialIcons key={`empty-${i}`} name="star-border" size={16} color="#FFB300" />);
    }
    
    return stars;
  };

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
          <Text style={styles.headerTitle}>Find Dermatologists</Text>
          <Text style={styles.headerSubtitle}>Locate specialists in your area</Text>
        </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <MaterialIcons name="location-on" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Enter ZIP code (e.g., 10001)"
            value={zipCode}
            onChangeText={setZipCode}
            keyboardType="numeric"
            maxLength={5}
            placeholderTextColor="#999"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <MaterialIcons name="search" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Results */}
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {!hasSearched && !isLoading && (
          <View style={styles.noResultsContainer}>
            <MaterialIcons name="search" size={48} color="#ccc" />
            <Text style={styles.noResultsText}>Enter ZIP code to find doctors</Text>
            <Text style={styles.noResultsSubtext}>
              Search for dermatologists in your area
            </Text>
          </View>
        )}

        {hasSearched && !isLoading && dermatologists.length === 0 && (
          <View style={styles.noResultsContainer}>
            <MaterialIcons name="location-off" size={48} color="#ccc" />
            <Text style={styles.noResultsText}>No dermatologists found</Text>
            <Text style={styles.noResultsSubtext}>
              Try searching with ZIP code "20148" for demo results
            </Text>
          </View>
        )}

        {dermatologists.length > 0 && (
          <View style={styles.doctorsList}>
            <Text style={styles.resultsTitle}>
              Found {dermatologists.length} dermatologist{dermatologists.length !== 1 ? 's' : ''} near {zipCode}
            </Text>
            
            {dermatologists.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onPress={() => setSelectedDoctor(doctor)}
                onCall={() => handleCall(doctor.phone)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Doctor Detail Modal */}
      {selectedDoctor && (
        <Modal
          visible={true}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setSelectedDoctor(null)}
        >
          <DoctorDetailScreen 
            doctor={selectedDoctor} 
            onClose={() => setSelectedDoctor(null)}
            onCall={() => handleCall(selectedDoctor.phone)}
            onWebsite={() => handleWebsite(selectedDoctor.website)}
          />
        </Modal>
      )}
      
      {Platform.OS === 'web' && (
        <Modal visible={alertConfig.visible} transparent={true} animationType="fade">
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

function DoctorCard({ doctor, onPress, onCall }: { 
  doctor: DermatologistInfo; 
  onPress: () => void;
  onCall: () => void;
}) {
   const getRatingStars = (rating: number) => {
    // Handle undefined, null, or NaN ratings
    if (!rating || isNaN(rating) || rating <= 0) {
      return Array.from({ length: 5 }, (_, i) => (
        <MaterialIcons key={`empty-${i}`} name="star-border" size={14} color="#FFB300" />
      ));
    }
    
    const stars = [];
    const safeRating = Math.min(5, Math.max(0, rating)); // Clamp between 0 and 5
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<MaterialIcons key={i} name="star" size={14} color="#FFB300" />);
    }
    
    if (hasHalfStar) {
      stars.push(<MaterialIcons key="half" name="star-half" size={14} color="#FFB300" />);
    }
    
    const emptyStars = 5 - Math.ceil(safeRating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<MaterialIcons key={`empty-${i}`} name="star-border" size={14} color="#FFB300" />);
    }
    
    return stars;
  };

  // Safely format address
  const formatAddress = () => {
    const addressParts = [doctor.address, doctor.city, doctor.state].filter(
      item => item && typeof item === 'string' && item.trim() !== ''
    );
    return addressParts.length > 0 ? addressParts.join(', ') : 'Address not available';
  };

  // Safely format rating text  
  const formatRatingText = () => {
    const ratingValue = (doctor.rating && !isNaN(doctor.rating)) ? doctor.rating.toFixed(1) : 'No rating';
    const reviewCount = (doctor.reviewCount && doctor.reviewCount > 0) ? doctor.reviewCount : 0;
    return `${ratingValue} (${reviewCount} reviews)`;
  };

  // Safely format experience
  const formatExperience = () => {
    const years = (doctor.yearsExperience && typeof doctor.yearsExperience === 'number') ? doctor.yearsExperience : 0;
    return `${years} years experience`;
  };

  // Safely format distance
  const formatDistance = () => {
    if (doctor.distance && typeof doctor.distance === 'number') {
      return `${doctor.distance} miles away`;
    }
    return null;
  };

  return (
    <TouchableOpacity style={styles.doctorCard} onPress={onPress}>
      <View style={styles.doctorHeader}>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{String(doctor.name || 'Doctor Name')}</Text>
          <Text style={styles.doctorSpecialty}>{String(doctor.specialty || 'Specialty not available')}</Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {getRatingStars(doctor.rating)}
            </View>
            <Text style={styles.ratingText}>
              {formatRatingText()}
            </Text>
          </View>
        </View>
        
        <View style={styles.doctorActions}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: doctor.acceptingPatients ? '#4CAF50' : '#FF5722' }
          ]}>
            <Text style={styles.statusText}>
              {doctor.acceptingPatients ? 'ACCEPTING' : 'NOT ACCEPTING'}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.callButton} onPress={onCall}>
            <MaterialIcons name="phone" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.doctorDetails}>
        <View style={styles.doctorDetailItem}>
          <MaterialIcons name="location-on" size={16} color="#666" />
          <Text style={styles.doctorDetailText}>
            {formatAddress()}
          </Text>
        </View>
        
        <View style={styles.doctorDetailItem}>
          <MaterialIcons name="work" size={16} color="#666" />
          <Text style={styles.doctorDetailText}>
            {formatExperience()}
          </Text>
        </View>
        
        {formatDistance() && (
          <View style={styles.doctorDetailItem}>
            <MaterialIcons name="directions" size={16} color="#666" />
            <Text style={styles.distance}>
              {formatDistance()}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.doctorFooter}>
        <Text style={styles.viewMoreText}>Tap for more details</Text>
        <MaterialIcons name="chevron-right" size={20} color="#4A90E2" />
      </View>
    </TouchableOpacity>
  );
}

function DoctorDetailScreen({ 
  doctor, 
  onClose, 
  onCall, 
  onWebsite 
}: { 
  doctor: DermatologistInfo; 
  onClose: () => void;
  onCall: () => void;
  onWebsite: () => void;
}) {
  const insets = useSafeAreaInsets();
  
  const getRatingStars = (rating: number) => {
    // Handle undefined, null, or NaN ratings
    if (!rating || isNaN(rating) || rating <= 0) {
      return Array.from({ length: 5 }, (_, i) => (
        <MaterialIcons key={`empty-${i}`} name="star-border" size={18} color="#FFB300" />
      ));
    }
    
    const stars = [];
    const safeRating = Math.min(5, Math.max(0, rating)); // Clamp between 0 and 5
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<MaterialIcons key={i} name="star" size={18} color="#FFB300" />);
    }
    
    if (hasHalfStar) {
      stars.push(<MaterialIcons key="half" name="star-half" size={18} color="#FFB300" />);
    }
    
    const emptyStars = 5 - Math.ceil(safeRating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<MaterialIcons key={`empty-${i}`} name="star-border" size={18} color="#FFB300" />);
    }
    
    return stars;
  };

  // Helper functions for safe text formatting
  const formatDetailAddress = () => {
    const addressParts = [doctor.address, doctor.city, doctor.state, doctor.zipCode].filter(
      item => item && typeof item === 'string' && item.trim() !== ''
    );
    return addressParts.length > 0 ? addressParts.join(', ') : 'Address not available';
  };

  const formatDetailRating = () => {
    const ratingValue = (doctor.rating && !isNaN(doctor.rating)) ? doctor.rating.toFixed(1) : 'No rating';
    const reviewCount = (doctor.reviewCount && doctor.reviewCount > 0) ? doctor.reviewCount : 0;
    return `${ratingValue} out of 5 (${reviewCount} patient reviews)`;
  };

  const formatPhoneNumber = () => {
    return (doctor.phone && typeof doctor.phone === 'string') ? doctor.phone : 'Phone not available';
  };

  const formatWebsite = () => {
    return (doctor.website && typeof doctor.website === 'string') ? doctor.website : 'Website not available';
  };

  const formatEducation = () => {
    return (doctor.education && typeof doctor.education === 'string') ? doctor.education : 'Education information not available';
  };

  const formatYearsExperience = () => {
    const years = (doctor.yearsExperience && typeof doctor.yearsExperience === 'number') ? doctor.yearsExperience : 0;
    return `${years} years in dermatology`;
  };

  const formatDistanceDetail = () => {
    if (typeof doctor.distance === 'number') {
      const zipCode = (doctor.zipCode && typeof doctor.zipCode === 'string') ? doctor.zipCode : 'your location';
      return `${doctor.distance} miles from ${zipCode}`;
    }
    return 'Distance not available';
  };

  return (
    <View style={[styles.detailContainer, { paddingTop: insets.top }]}>
      <View style={styles.detailHeader}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.detailTitle}>Doctor Details</Text>
      </View>

      <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
        <View style={styles.doctorDetailSection}>
          <Text style={styles.doctorDetailName}>{String(doctor.name || 'Doctor Name')}</Text>
          <Text style={styles.doctorDetailSpecialty}>{String(doctor.specialty || 'Specialty not available')}</Text>
          
          <View style={styles.detailRatingContainer}>
            <View style={styles.starsContainer}>
              {getRatingStars(doctor.rating)}
            </View>
            <Text style={styles.detailRatingText}>
              {formatDetailRating()}
            </Text>
          </View>
          
          <View style={[
            styles.detailStatusBadge,
            { backgroundColor: doctor.acceptingPatients ? '#4CAF50' : '#FF5722' }
          ]}>
            <Text style={styles.detailStatusText}>
              {doctor.acceptingPatients ? 'Currently Accepting New Patients' : 'Not Accepting New Patients'}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoSectionTitle}>Contact Information</Text>
          
          <View style={styles.infoItem}>
            <MaterialIcons name="location-on" size={20} color="#4A90E2" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoText}>
                {formatDetailAddress()}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <MaterialIcons name="phone" size={20} color="#4A90E2" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoText}>{formatPhoneNumber()}</Text>
            </View>
          </View>
          
          {doctor.website && (
            <View style={styles.infoItem}>
              <MaterialIcons name="language" size={20} color="#4A90E2" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Website</Text>
                <Text style={styles.infoText}>{formatWebsite()}</Text>
              </View>
            </View>
          )}
          
          {doctor.distance && typeof doctor.distance === 'number' && (
            <View style={styles.infoItem}>
              <MaterialIcons name="directions" size={20} color="#4A90E2" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Distance</Text>
                <Text style={styles.infoText}>
                  {formatDistanceDetail()}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoSectionTitle}>Professional Background</Text>
          
          <View style={styles.infoItem}>
            <MaterialIcons name="school" size={20} color="#4A90E2" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Education</Text>
              <Text style={styles.infoText}>{formatEducation()}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <MaterialIcons name="work" size={20} color="#4A90E2" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Experience</Text>
              <Text style={styles.infoText}>{formatYearsExperience()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.primaryActionButton} onPress={onCall}>
            <MaterialIcons name="phone" size={20} color="white" />
            <Text style={styles.primaryActionText}>Call Now</Text>
          </TouchableOpacity>
          
          {doctor.website && (
            <TouchableOpacity style={styles.secondaryActionButton} onPress={onWebsite}>
              <MaterialIcons name="language" size={20} color="#4A90E2" />
              <Text style={styles.secondaryActionText}>Visit Website</Text>
            </TouchableOpacity>
          )}
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
  searchSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(240, 240, 240, 0.8)'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 12
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333'
  },
  searchButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 8
  },
  resultsContainer: {
    flex: 1
  },
  noResultsContainer: {
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
  doctorsList: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A4D4A',
    marginBottom: 16
  },
  doctorCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  doctorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  doctorInfo: {
    flex: 1,
    marginRight: 12
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A4D4A',
    marginBottom: 4
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#4A90E2',
    marginBottom: 8
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  starsContainer: {
    flexDirection: 'row'
  },
  ratingText: {
    fontSize: 12,
    color: '#666'
  },
  doctorActions: {
    alignItems: 'flex-end',
    gap: 8
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700'
  },
  callButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    padding: 8
  },
  doctorDetails: {
    gap: 6
  },
  doctorDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  doctorDetailText: {
    fontSize: 14,
    color: '#4A7A78',
    fontWeight: '500'
  },
  distance: {
    fontSize: 14,
    color: '#666'
  },
  doctorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0'
  },
  viewMoreText: {
    fontSize: 12,
    color: '#4A90E2'
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
    fontSize: 20,
    fontWeight: '600',
    color: '#333'
  },
  detailContent: {
    flex: 1
  },
  doctorDetailSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(240, 240, 240, 0.8)'
  },
  doctorDetailName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A4D4A',
    textAlign: 'center',
    marginBottom: 8
  },
  doctorDetailSpecialty: {
    fontSize: 16,
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 16
  },
  detailRatingContainer: {
    alignItems: 'center',
    marginBottom: 16
  },
  detailRatingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8
  },
  detailStatusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  detailStatusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center'
  },
  infoSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginTop: 8,
    padding: 20
  },
  infoSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A4D4A',
    marginBottom: 16
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12
  },
  infoTextContainer: {
    flex: 1
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 4
  },
  infoText: {
    fontSize: 14,
    color: '#1A4D4A',
    lineHeight: 20,
    fontWeight: '500'
  },
  actionSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginTop: 8,
    padding: 20,
    gap: 12
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8
  },
  primaryActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  secondaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A90E2',
    gap: 8
  },
  secondaryActionText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600'
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
    minWidth: 280,
    maxWidth: '90%'
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22
  },
  alertButton: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  alertButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});