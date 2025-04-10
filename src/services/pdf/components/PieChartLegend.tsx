
import React from 'react';
import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";

// Component for creating pie chart legends in PDF (simplified for 360 report)
export const PieChartLegend = ({ data }: { 
  data: { name: string; value: number; color: string }[] 
}) => (
  <View style={{ flexDirection: 'column', marginTop: 10 }}>
    {data.map((item, index) => (
      <View key={index} style={styles.legendItem}>
        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
        <Text style={styles.legendText}>
          {item.name}: {item.value} ({item.value > 0 ? Math.round((item.value / data.reduce((acc, curr) => acc + curr.value, 0)) * 100) : 0}%)
        </Text>
      </View>
    ))}
  </View>
);
