
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { styles } from '../styles';

export const StatusBadge = ({ status }: { status: string }) => {
  let badgeStyle;
  let statusText = status;
  
  switch (status.toLowerCase()) {
    case 'ativo':
    case 'frequentante':
      badgeStyle = styles.statusActive;
      break;
    case 'inativo':
    case 'afastado':
      badgeStyle = styles.statusInactive;
      break;
    default:
      badgeStyle = styles.statusPending;
  }
  
  return (
    <View style={{ alignItems: 'flex-end' }}>
      <Text style={[styles.statusBadge, badgeStyle]}>
        {statusText}
      </Text>
    </View>
  );
};
