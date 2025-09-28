// frontend/src/components/headerTitle.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../styles/colors';
import { typography } from '../styles/typography';

interface HeaderLogoutProps {
  title: string;
  onLogout: () => void;
}

interface HeaderBackProps {
  title: string;
  onBack: () => void;
}

export const HeaderLogout: React.FC<HeaderLogoutProps> = ({ title, onLogout }) => {
  return (
    <View style={styles.headerRow}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onLogout} style={styles.actionButton}>
        <MaterialIcons name="logout" size={25} color={Colors.gray} style={{ paddingTop: 20 }} />
      </TouchableOpacity>
    </View>
  );
};

export const HeaderBack: React.FC<HeaderBackProps> = ({ title, onBack }) => {
  return (
    <View style={styles.headerRow}>
      <TouchableOpacity onPress={onBack} style={styles.actionButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.titleWithBack}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    color: Colors.green,
    textAlign: 'left',
    fontFamily: "Inter_400Regular",
    paddingTop: 20,
  },
  titleWithBack: {
    fontSize: 20,
    color: Colors.green,
    fontFamily: "Inter_400Regular",
    paddingLeft: 10,
  },
  actionButton: {
    borderRadius: 20,
  },
});