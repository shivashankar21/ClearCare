import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DropdownNavigation from '../../components/DropdownNavigation';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image
        source={{ uri: 'https://cdn-ai.onspace.ai/onspace/project/image/GcwaZAoxDPxae5em3e5rUK/1000031465.jpg' }}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      
      {/* Content Container */}
      <View style={[styles.contentContainer, { paddingTop: insets.top }]}>
        {/* Dropdown Navigation */}
        <DropdownNavigation />
        
        {/* Stack Navigator */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="knowledge" />
          <Stack.Screen name="doctors" />
          <Stack.Screen name="history" />
          <Stack.Screen name="dashboard" />
          <Stack.Screen name="profile" />
        </Stack>
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  }
});