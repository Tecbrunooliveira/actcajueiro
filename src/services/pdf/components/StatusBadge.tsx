
import React from 'react';
import { Text } from "@react-pdf/renderer";
import { styles } from "../styles";

// Componente para o status com cores
export const StatusBadge = ({ status }: { status: string }) => {
  let badgeStyle;
  
  switch (status) {
    case "Ativo":
      badgeStyle = styles.statusActive;
      break;
    case "Inativo":
      badgeStyle = styles.statusInactive;
      break;
    default:
      badgeStyle = styles.statusPending;
  }
  
  return (
    <Text style={[styles.statusBadge, badgeStyle]}>
      {status}
    </Text>
  );
};
