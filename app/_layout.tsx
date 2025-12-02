import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SkinAnalysisProvider } from '../contexts/SkinAnalysisContext';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SkinAnalysisProvider>
          <View style={styles.container}>
            {/* Background Image */}
            <Image
              source={{ uri: 'https://cdn-ai.onspace.ai/onspace/project/image/GcwaZAoxDPxae5em3e5rUK/1000031465.jpg' }}
              style={styles.backgroundImage}
              contentFit="cover"
            />
            
            {/* Content */}
            <View style={styles.contentContainer}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="admin" options={{ headerShown: false }} />
              </Stack>
            </View>
          </View>
        </SkinAnalysisProvider>
      </AuthProvider>
    </SafeAreaProvider>
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
    flex: 1
  }
});