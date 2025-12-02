import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Modal
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';

interface CameraCaptureProps {
  onImageCaptured: (imageUri: string) => void;
}

export default function CameraCapture({ onImageCaptured }: CameraCaptureProps) {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onOk?: () => void;
  }>({ visible: false, title: '', message: '' });
  const cameraRef = useRef<CameraView>(null);

  const showAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === 'web') {
      setAlertConfig({ visible: true, title, message, onOk });
    } else {
      Alert.alert(title, message, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
    }
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          setCapturedImage(photo.uri);
        }
      } catch (error) {
        showAlert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
      }
    } catch (error) {
      showAlert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const useImage = () => {
    if (capturedImage) {
      onImageCaptured(capturedImage);
      setCapturedImage(null);
      setShowCamera(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  if (showCamera) {
    return (
      <Modal visible={showCamera} animationType="slide">
        <View style={styles.cameraContainer}>
          {capturedImage ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: capturedImage }} style={styles.previewImage} />
              <View style={styles.previewActions}>
                <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
                  <MaterialIcons name="refresh" size={24} color="white" />
                  <Text style={styles.actionButtonText}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.useButton} onPress={useImage}>
                  <MaterialIcons name="check" size={24} color="white" />
                  <Text style={styles.actionButtonText}>Use Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <CameraView 
                style={styles.camera} 
                facing={facing} 
                ref={cameraRef}
              >
                <View style={styles.cameraOverlay}>
                  <View style={styles.topControls}>
                    <TouchableOpacity 
                      style={styles.closeButton} 
                      onPress={() => setShowCamera(false)}
                    >
                      <MaterialIcons name="close" size={30} color="white" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.captureGuide}>
                    <View style={styles.faceFrame} />
                    <Text style={styles.guideText}>
                      Position your face within the frame
                    </Text>
                  </View>
                  
                  <View style={styles.bottomControls}>
                    <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
                      <MaterialIcons name="photo-library" size={30} color="white" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                      <View style={styles.captureButtonInner} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                      <MaterialIcons name="flip-camera-ios" size={30} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </CameraView>
            </>
          )}
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
      </Modal>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>Capture or upload a photo of your skin</Text>
      </View>
      
      <View style={styles.captureOptions}>
        <TouchableOpacity 
          style={styles.optionButton} 
          onPress={() => setShowCamera(true)}
        >
          <MaterialIcons name="camera-alt" size={40} color="#6DBDB6" />
          <Text style={styles.optionText}>Take Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
          <MaterialIcons name="photo-library" size={40} color="#6DBDB6" />
          <Text style={styles.optionText}>Choose from Gallery</Text>
        </TouchableOpacity>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(232, 245, 244, 0.95)'
  },
  permissionContainer: {
    alignItems: 'center',
    padding: 40
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 24
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6DBDB6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  instructionContainer: {
    marginBottom: 30,
    paddingHorizontal: 20
  },
  instructionText: {
    fontSize: 16,
    color: '#2C5F5D',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500'
  },
  captureOptions: {
    width: '100%',
    gap: 16
  },
  optionButton: {
    backgroundColor: 'rgba(184, 230, 220, 0.95)',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(109, 189, 182, 0.3)'
  },
  optionText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#2C5F5D'
  },
  optionSubtext: {
    marginTop: 4,
    fontSize: 14,
    color: '#666'
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black'
  },
  camera: {
    flex: 1
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 60
  },
  closeButton: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20
  },
  captureGuide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  faceFrame: {
    width: 250,
    height: 300,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    backgroundColor: 'transparent'
  },
  guideText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 40
  },
  cameraStatus: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center'
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 50,
    paddingHorizontal: 50
  },
  galleryButton: {
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  captureButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white'
  },
  captureButtonInnerDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  },
  flipButton: {
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'black'
  },
  previewImage: {
    flex: 1,
    width: '100%'
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 30,
    backgroundColor: 'black'
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8
  },
  useButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6DBDB6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8
  },
  actionButtonText: {
    color: 'white',
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
    backgroundColor: '#6DBDB6',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  alertButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});