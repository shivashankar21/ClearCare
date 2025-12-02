import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  Alert,
  Switch
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, signOut, isAdmin } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({ visible: false, title: '', message: '' });

  // AI Data Use Settings
  const [useDataForAnalysis, setUseDataForAnalysis] = useState(true); // Required ON
  const [allowDataForImprovement, setAllowDataForImprovement] = useState(false); // Default OFF
  const [showAISettings, setShowAISettings] = useState(false);

  const showAlert = (title: string, message: string, onConfirm?: () => void, onCancel?: () => void) => {
    if (Platform.OS === 'web') {
      setAlertConfig({ visible: true, title, message, onConfirm, onCancel });
    } else {
      Alert.alert(
        title,
        message,
        [
          { text: 'Cancel', style: 'cancel', onPress: onCancel },
          { text: 'Sign Out', style: 'destructive', onPress: onConfirm }
        ]
      );
    }
  };

  const handleSignOut = () => {
    showAlert(
      'Sign Out',
      'Are you sure you want to sign out?',
      async () => {
        await signOut();
        router.replace('/');
      }
    );
  };

  const handleAdminAccess = () => {
    router.push('/admin');
  };

  if (!user) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>Manage your account and settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Section */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.defaultAvatar}>
                <Text style={styles.avatarInitials}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            {isAdmin && (
              <View style={styles.adminBadgeContainer}>
                <MaterialIcons name="verified" size={20} color="#4A90E2" />
              </View>
            )}
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            {isAdmin && (
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>ADMINISTRATOR</Text>
              </View>
            )}
          </View>
        </View>

        {/* Admin Access (only for admins) */}
        {isAdmin && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Administrative</Text>
            <TouchableOpacity style={styles.menuItem} onPress={handleAdminAccess}>
              <MaterialIcons name="admin-panel-settings" size={24} color="#4A90E2" />
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemText}>Admin Dashboard</Text>
                <Text style={styles.menuItemSubtext}>Manage users and system analytics</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        )}

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="notifications" size={24} color="#4A90E2" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>Notifications</Text>
              <Text style={styles.menuItemSubtext}>Manage notification preferences</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowAISettings(true)}>
            <MaterialIcons name="privacy-tip" size={24} color="#4A90E2" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>Privacy Settings</Text>
              <Text style={styles.menuItemSubtext}>Control your data and privacy</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="security" size={24} color="#4A90E2" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>Security</Text>
              <Text style={styles.menuItemSubtext}>Password and security settings</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="language" size={24} color="#4A90E2" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>Language</Text>
              <Text style={styles.menuItemSubtext}>English</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="dark-mode" size={24} color="#4A90E2" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>Theme</Text>
              <Text style={styles.menuItemSubtext}>Light mode</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="help" size={24} color="#4A90E2" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>Help Center</Text>
              <Text style={styles.menuItemSubtext}>Get help and find answers</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="feedback" size={24} color="#4A90E2" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>Send Feedback</Text>
              <Text style={styles.menuItemSubtext}>Help us improve ClearCare</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="info" size={24} color="#4A90E2" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>About</Text>
              <Text style={styles.menuItemSubtext}>Version 1.0.0</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <MaterialIcons name="logout" size={24} color="#F44336" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* AI Data Use Settings Modal */}
      <Modal visible={showAISettings} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>AI Data Use</Text>
              <TouchableOpacity onPress={() => setShowAISettings(false)}>
                <MaterialIcons name="close" size={24} color="#1A4D4A" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalDescription}>
                Control how your data is used for AI analysis and model improvement.
              </Text>

              {/* Essential: Use data to analyze image */}
              <View style={styles.settingItem}>
                <View style={styles.settingHeader}>
                  <View style={styles.settingIconContainer}>
                    <MaterialIcons name="analytics" size={24} color="#4A90E2" />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <View style={styles.settingTitleRow}>
                      <Text style={styles.settingTitle}>Use my data to analyze this image</Text>
                      <View style={styles.requiredBadge}>
                        <Text style={styles.requiredText}>REQUIRED</Text>
                      </View>
                    </View>
                    <Text style={styles.settingDescription}>
                      Essential for providing skin analysis. This setting cannot be disabled as it is required to use the feature.
                    </Text>
                  </View>
                </View>
                <Switch
                  value={useDataForAnalysis}
                  disabled={true}
                  trackColor={{ false: '#ddd', true: '#6DBDB6' }}
                  thumbColor={useDataForAnalysis ? '#4A7A78' : '#f4f3f4'}
                />
              </View>

              <View style={styles.divider} />

              {/* Optional: Allow data to improve model */}
              <View style={styles.settingItem}>
                <View style={styles.settingHeader}>
                  <View style={styles.settingIconContainer}>
                    <MaterialIcons name="model-training" size={24} color="#6DBDB6" />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Allow my data to improve the model</Text>
                    <Text style={styles.settingDescription}>
                      Help improve AI accuracy by allowing anonymous use of your scan data for model training. You can disable this anytime.
                    </Text>
                  </View>
                </View>
                <Switch
                  value={allowDataForImprovement}
                  onValueChange={setAllowDataForImprovement}
                  trackColor={{ false: '#ddd', true: '#6DBDB6' }}
                  thumbColor={allowDataForImprovement ? '#4A7A78' : '#f4f3f4'}
                />
              </View>

              {/* Information Box */}
              <View style={styles.infoBox}>
                <MaterialIcons name="info" size={20} color="#4A90E2" />
                <Text style={styles.infoText}>
                  Your privacy is important. All data is encrypted and anonymized. You maintain full control over your data preferences.
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.doneButton}
                onPress={() => setShowAISettings(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
                  <Text style={styles.confirmButtonText}>Sign Out</Text>
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
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(184, 230, 220, 0.5)'
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  defaultAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6B46C1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white'
  },
  adminBadgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A4D4A',
    marginBottom: 4
  },
  userEmail: {
    fontSize: 16,
    color: '#4A7A78',
    marginBottom: 8,
    fontWeight: '500'
  },
  adminBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8
  },
  adminBadgeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '700'
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginTop: 8,
    paddingVertical: 8
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A7A78',
    paddingHorizontal: 20,
    paddingVertical: 12,
    textTransform: 'uppercase'
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa'
  },
  menuItemContent: {
    flex: 1,
    marginLeft: 16
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A4D4A',
    marginBottom: 2
  },
  menuItemSubtext: {
    fontSize: 14,
    color: '#4A7A78'
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginTop: 8,
    paddingVertical: 20,
    gap: 12
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336'
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContainer: {
    backgroundColor: '#E8F5F4',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(184, 230, 220, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A4D4A'
  },
  modalContent: {
    padding: 20
  },
  modalDescription: {
    fontSize: 16,
    color: '#4A7A78',
    marginBottom: 24,
    lineHeight: 22
  },
  settingItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(109, 189, 182, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  settingTextContainer: {
    flex: 1
  },
  settingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A4D4A',
    marginRight: 8
  },
  requiredBadge: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },
  requiredText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white'
  },
  settingDescription: {
    fontSize: 14,
    color: '#4A7A78',
    lineHeight: 20
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(184, 230, 220, 0.3)',
    marginVertical: 8
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    alignItems: 'flex-start'
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#4A7A78',
    marginLeft: 8,
    lineHeight: 18
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(184, 230, 220, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)'
  },
  doneButton: {
    backgroundColor: '#6DBDB6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center'
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white'
  }
});