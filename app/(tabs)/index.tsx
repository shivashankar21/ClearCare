import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  Modal,
  Alert,
  TouchableOpacity
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import CameraCapture from '../../components/CameraCapture';
import AnalysisResults from '../../components/AnalysisResults';
import { SkinAnalysisService } from '../../services/skinAnalysisService';
import { SkinAnalysis } from '../../constants/types';
import { useSkinAnalysis } from '../../hooks/useSkinAnalysis';

type ViewState = 'capture' | 'analyzing' | 'results';

export default function ScanScreen() {
  const [viewState, setViewState] = useState<ViewState>('capture');
  const [currentAnalysis, setCurrentAnalysis] = useState<SkinAnalysis | null>(null);
  const [progress, setProgress] = useState(0);
  const { addAnalysis } = useSkinAnalysis();
  const insets = useSafeAreaInsets();
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onOk?: () => void;
  }>({ visible: false, title: '', message: '' });

  const showAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === 'web') {
      setAlertConfig({ visible: true, title, message, onOk });
    } else {
      Alert.alert(title, message, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
    }
  };

  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  const handleImageCaptured = async (imageUri: string) => {
    setViewState('analyzing');
    setProgress(0);

    // Simulate progress
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          if (progressInterval.current) {
            clearInterval(progressInterval.current);
          }
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const analysis = await SkinAnalysisService.processImage(imageUri);
      setCurrentAnalysis(analysis);
      setProgress(100);
      
      setTimeout(() => {
        setViewState('results');
      }, 500);
    } catch (error) {
      showAlert('Analysis Error', 'Failed to analyze the image. Please try again.');
      setViewState('capture');
    } finally {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }
  };

  const handleSaveAnalysis = async () => {
    if (currentAnalysis) {
      await addAnalysis(currentAnalysis);
      showAlert(
        'Analysis Saved!',
        'Your skin analysis has been saved to your history.',
        () => {
          setCurrentAnalysis(null);
          setViewState('capture');
        }
      );
    }
  };

  const handleRetakePhoto = () => {
    setCurrentAnalysis(null);
    setViewState('capture');
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image
        source={{ uri: 'https://cdn-ai.onspace.ai/onspace/project/image/GcwaZAoxDPxae5em3e5rUK/1000031465.jpg' }}
        style={styles.backgroundImage}
        contentFit="cover"
        cachePolicy="memory-disk"
      />
      
      {/* Content Container */}
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {viewState === 'capture' && 'Know Your Skin'}
            {viewState === 'analyzing' && 'Analyzing your skin...'}
            {viewState === 'results' && 'Analysis Results'}
          </Text>
        </View>

      {viewState === 'capture' && (
        <CameraCapture onImageCaptured={handleImageCaptured} />
      )}

      {viewState === 'analyzing' && (
        <View style={styles.analyzingContainer}>
          <View style={styles.progressContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.analyzingText}>
              Analyzing skin conditions...
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
          
          <View style={styles.analyzingSteps}>
            <Text style={styles.stepsTitle}>Analysis Steps:</Text>
            <Text style={[styles.stepText, progress >= 20 && styles.stepCompleted]}>
              • Processing image quality
            </Text>
            <Text style={[styles.stepText, progress >= 40 && styles.stepCompleted]}>
              • Detecting skin conditions
            </Text>
            <Text style={[styles.stepText, progress >= 60 && styles.stepCompleted]}>
              • Analyzing severity levels
            </Text>
            <Text style={[styles.stepText, progress >= 80 && styles.stepCompleted]}>
              • Generating recommendations
            </Text>
            <Text style={[styles.stepText, progress >= 100 && styles.stepCompleted]}>
              • Finalizing results
            </Text>
          </View>
        </View>
      )}

      {viewState === 'results' && currentAnalysis && (
        <ScrollView style={styles.resultsContainer}>
          <AnalysisResults
            analysis={currentAnalysis}
            onSave={handleSaveAnalysis}
            onRetake={handleRetakePhoto}
            showBackButton={true}
            onBack={() => {
              setCurrentAnalysis(null);
              setViewState('capture');
            }}
          />
        </ScrollView>
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
    backgroundColor: 'rgba(232, 245, 244, 0.95)'
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(184, 230, 220, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(109, 189, 182, 0.3)',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C5F5D',
    lineHeight: 32,
    textAlign: 'center'
  },
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'rgba(232, 245, 244, 0.95)'
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 40
  },
  analyzingText: {
    fontSize: 18,
    color: '#1A4D4A',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600'
  },
  progressBar: {
    width: 200,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 4
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2'
  },
  analyzingSteps: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(184, 230, 220, 0.95)',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(109, 189, 182, 0.3)'
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A4D4A',
    marginBottom: 12
  },
  stepText: {
    fontSize: 14,
    color: '#7A7A7A',
    marginBottom: 8
  },
  stepCompleted: {
    color: '#4CAF50',
    fontWeight: '500'
  },
  resultsContainer: {
    flex: 1
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