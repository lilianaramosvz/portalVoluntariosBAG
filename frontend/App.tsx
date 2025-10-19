// frontend/App.tsx

import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/AppNavigator";

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Your splash screen logic is fine, no changes needed here
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => setShowSplash(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require("./assets/Loading.jpg")}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </View>
    );
  }

  // This is the correct structure
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  splashImage: {
    width: "100%",
    height: "100%",
  },
});