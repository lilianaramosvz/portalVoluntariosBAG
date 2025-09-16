//frontend/src/styles/typography.ts

import { StyleSheet } from "react-native";

export const typography = StyleSheet.create({
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    lineHeight: 32,
    paddingBottom: 5,
  },
  subtitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
    lineHeight: 28,
    paddingTop: 5,
  },
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
  },
});
