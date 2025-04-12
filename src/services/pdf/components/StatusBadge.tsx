
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { styles } from '../styles';

export const StatusBadge = ({ status }: { status: string }) => {
  let badgeStyle;
  
  switch (status.toLowerCase()) {
    case 'ativo':
      badgeStyle = styles.statusActive;
      break;
    case 'inativo':
      badgeStyle = styles.statusInactive;
      break;
    default:
      badgeStyle = styles.statusPending;
  }
  
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={[styles.statusBadge, badgeStyle]}>
        {status}
      </Text>
    </View>
  );
};
