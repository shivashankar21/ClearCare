import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Modal,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen() {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
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

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      showAlert('Sign In Failed', 'Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#6DBDB6', '#5BBFB3', '#B8E6DC']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoSection}>
          <Image
            source={{ uri: 'https://cdn-ai.onspace.ai/onspace/project/image/6XcxehzekPoVrjhBT3UPJp/claercare-logo.jpg' }}
            style={styles.logo}
            contentFit="contain"
          />
          <Text style={styles.tagline}>AI-Powered Skin Analysis</Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Discover Your Skin Health</Text>
          
          <View style={styles.feature}>
            <MaterialIcons name="camera-alt" size={24} color="white" />
            <Text style={styles.featureText}>Advanced skin scanning technology</Text>
          </View>
          
          <View style={styles.feature}>
            <MaterialIcons name="analytics" size={24} color="white" />
            <Text style={styles.featureText}>AI-powered condition detection</Text>
          </View>
          
          <View style={styles.feature}>
            <MaterialIcons name="lightbulb-outline" size={24} color="white" />
            <Text style={styles.featureText}>Personalized skincare recommendations</Text>
          </View>
          
          <View style={styles.feature}>
            <MaterialIcons name="trending-up" size={24} color="white" />
            <Text style={styles.featureText}>Track your progress over time</Text>
          </View>
        </View>

        <View style={styles.authSection}>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#333" />
            ) : (
              <>
                <MaterialIcons name="login" size={24} color="#333" />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>
          
          <Text style={styles.disclaimer}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
      
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between'
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 80
  },
  logo: {
    width: 240,
    height: 80,
    marginBottom: 24
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center'
  },
  featuresSection: {
    flex: 1,
    justifyContent: 'center'
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 32
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16
  },
  featureText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 16,
    flex: 1
  },
  authSection: {
    marginBottom: 40
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12
  },
  googleButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  disclaimer: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 16
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
    backgroundColor: '#6DBDB6',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center'
  },
  alertButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});