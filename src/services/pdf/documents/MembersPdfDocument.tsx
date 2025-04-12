
import React from 'react';
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { Member } from "@/types";
import { StatusBadge } from "../components/StatusBadge";
import { styles } from "../styles";
import { getStatusLabel } from "@/services/formatters";

// Members PDF Document component
export const MembersPdfDocument = ({ 
  members, 
  title, 
  period 
}: { 
  members: Member[]; 
  title: string; 
  period: string 
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Período: {period}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>{members.length}</Text>
          </View>
          
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Gerado em</Text>
            <Text style={styles.statValue}>{new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.tableHeader}>
          <Text style={styles.memberPhoto}>Foto</Text>
          <Text style={styles.memberName}>Nome</Text>
          <Text style={styles.memberStatus}>Status</Text>
        </View>
        
        {members.map((member) => (
          <View key={member.id} style={styles.memberRow}>
            <View style={styles.memberPhoto}>
              {member.photo ? (
                <Image 
                  src={member.photo} 
                  style={styles.memberPhotoImage} 
                />
              ) : (
                <View style={styles.memberPhotoPlaceholder}>
                  <Text style={styles.memberPhotoInitial}>
                    {member.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.memberName}>{member.name}</Text>
            <View style={styles.memberStatus}>
              <StatusBadge status={getStatusLabel(member.status)} />
            </View>
          </View>
        ))}
      </View>
      
      <Text style={styles.footer}>
        Relatório gerado em {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR")}
      </Text>
    </Page>
  </Document>
);
