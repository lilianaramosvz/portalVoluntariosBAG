// frontend\App.tsx

import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Image } from "react-native";
import React, { useState } from "react";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from "@react-navigation/native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

import LoginScreen from "./src/screens/auth/LoginScreen";
import AuthNavigator from "./src/navigation/AuthNavigator";
import { useEffect } from "react";

export default function App() {
  //carga de las fuentes
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 1000); // 1 segundo extra
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (showSplash) {
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

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <AuthNavigator />
        <StatusBar style="auto" />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
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
