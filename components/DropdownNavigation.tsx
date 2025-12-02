import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

interface NavigationItem {
  key: string;
  title: string;
  icon: string;
  route: string;
}

const navigationItems: NavigationItem[] = [
  { key: 'scan', title: 'Scan', icon: 'camera-alt', route: '/(tabs)' },
  { key: 'knowledge', title: 'Skin Guide', icon: 'medical-information', route: '/(tabs)/knowledge' },
  { key: 'doctors', title: 'Find Doctors', icon: 'local-hospital', route: '/(tabs)/doctors' },
  { key: 'history', title: 'History', icon: 'history', route: '/(tabs)/history' },
  { key: 'dashboard', title: 'Dashboard', icon: 'dashboard', route: '/(tabs)/dashboard' },
  { key: 'profile', title: 'Profile', icon: 'person', route: '/(tabs)/profile' }
];

export default function DropdownNavigation() {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const getCurrentTitle = () => {
    const current = navigationItems.find(item => 
      pathname === item.route || 
      (item.route === '/(tabs)' && pathname === '/(tabs)/index')
    );
    return current?.title || '';
  };

  const handleNavigate = (route: string) => {
    setIsDropdownVisible(false);
    router.push(route as any);
  };

  const handleLogout = async () => {
    setIsDropdownVisible(false);
    await logout();
    router.replace('/index');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Left Side - Logo */}
        <View style={styles.leftSection}>
          <Image 
            source={{ uri: 'https://cdn-ai.onspace.ai/onspace/project/image/3Ba9PyW9YDoxZBj89LptxQ/Screenshot_2025-10-18_at_11.09.46_PM-removebg-preview.png' }}
            style={styles.logoIcon}
            contentFit="contain"
          />
        </View>
        
        {/* Center - ClearCare Text */}
        <View style={styles.centerSection}>
          <Text style={styles.logoText}>ClearCare</Text>
        </View>
        
        {/* Right Side - Menu */}
        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setIsDropdownVisible(!isDropdownVisible)}
          >
            <MaterialIcons 
              name={isDropdownVisible ? "close" : "menu"} 
              size={24} 
              color="#6DBDB6" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown Menu */}
      <Modal
        visible={isDropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsDropdownVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            {navigationItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.menuItem,
                  (pathname === item.route || 
                   (item.route === '/(tabs)' && pathname === '/(tabs)/index')) && 
                  styles.activeMenuItem
                ]}
                onPress={() => handleNavigate(item.route)}
              >
                <MaterialIcons 
                  name={item.icon as any} 
                  size={20} 
                  color="#6DBDB6" 
                />
                <Text style={[
                  styles.menuItemText,
                  (pathname === item.route || 
                   (item.route === '/(tabs)' && pathname === '/(tabs)/index')) && 
                  styles.activeMenuItemText
                ]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
            
            {/* Separator */}
            <View style={styles.separator} />
            
            {/* Logout */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLogout}
            >
              <MaterialIcons 
                name="logout" 
                size={20} 
                color="#6DBDB6" 
              />
              <Text style={[styles.menuItemText, styles.logoutText]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(184, 230, 220, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(109, 189, 182, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  leftSection: {
    width: 80,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rightSection: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C5F5D',
    letterSpacing: 0.5
  },
  dropdownButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(109, 189, 182, 0.2)'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  dropdownMenu: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: 'rgba(184, 230, 220, 0.98)',
    borderRadius: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(109, 189, 182, 0.3)'
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(109, 189, 182, 0.2)'
  },
  activeMenuItem: {
    backgroundColor: 'rgba(109, 189, 182, 0.3)'
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#1A4D4A',
    fontWeight: '600'
  },
  activeMenuItemText: {
    color: '#2C5F5D',
    fontWeight: '700'
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(109, 189, 182, 0.3)',
    marginHorizontal: 16,
    marginVertical: 8
  },
  logoutText: {
    color: '#2C5F5D',
    fontWeight: '700'
  },
  logoIcon: {
    width: 60,
    height: 60,
    backgroundColor: 'transparent'
  }
});
