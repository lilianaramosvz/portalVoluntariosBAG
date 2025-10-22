//frontend/src/components/QrDisplay.tsx

import * as React from "react";
import QRCode from 'react-native-qrcode-svg';
import { View, StyleSheet } from 'react-native';

export default function QrDisplay({ value }: { value: string }) {
  if (!value) return null;
  return (
    <View style={styles.container}>
      <QRCode value={value} size={220} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
