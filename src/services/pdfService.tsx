import React from 'react';
import { Member } from "@/types";
import { Document, Page, Text, View, StyleSheet, pdf, Font } from "@react-pdf/renderer";
import { getStatusLabel } from "./formatters";

// Registrando fonte para usar no PDF
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ]
});

// Define styles para PDF com visual mais moderno
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 40,
    fontFamily: 'Roboto',
  },
  headerSection: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '1px solid #e0e0e0',
  },
  title: {
    fontSize: 28,
    marginBottom: 10,
    fontWeight: 700,
    color: "#0CA678",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 6,
    color: "#4A5568",
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    gap: 20,
  },
  stat: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#F7FAFC",
    width: 100,
    textAlign: "center",
  },
  statLabel: {
    fontSize: 10,
    color: "#718096",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 700,
    color: "#2D3748",
  },
  section: {
    margin: 0,
    padding: 0,
    flexGrow: 1,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0CA678",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    color: "white",
    fontWeight: 500,
  },
  memberRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#edf2f7",
    borderBottomStyle: "solid",
    padding: 10,
    marginBottom: 5,
  },
  memberName: {
    flex: 2,
    fontSize: 11,
    fontWeight: 500,
    color: "#2D3748",
  },
  memberStatus: {
    flex: 1,
    fontSize: 11,
    color: "#4A5568",
  },
  memberContact: {
    flex: 2,
    fontSize: 11,
    color: "#4A5568",
  },
  statusBadge: {
    fontSize: 10,
    padding: "3 6",
    borderRadius: 4,
    textAlign: "center",
    width: "80%",
  },
  statusActive: {
    backgroundColor: "#C6F6D5",
    color: "#22543D",
  },
  statusInactive: {
    backgroundColor: "#FED7D7",
    color: "#822727",
  },
  statusPending: {
    backgroundColor: "#FEEBC8",
    color: "#744210",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: "1px solid #E2E8F0",
    paddingTop: 10,
    fontSize: 9,
    color: "#718096",
    textAlign: "center",
  },
});

// Componente para o status com cores
const StatusBadge = ({ status }: { status: string }) => {
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

// Melhorias no componente do Documento PDF
const MembersPdfDocument = ({ members, title, period }: { members: Member[]; title: string; period: string }) => (
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
          <Text style={styles.memberName}>Nome</Text>
          <Text style={styles.memberStatus}>Status</Text>
          <Text style={styles.memberContact}>Contato</Text>
        </View>
        
        {members.map((member) => (
          <View key={member.id} style={styles.memberRow}>
            <Text style={styles.memberName}>{member.name}</Text>
            <View style={styles.memberStatus}>
              <StatusBadge status={getStatusLabel(member.status)} />
            </View>
            <Text style={styles.memberContact}>
              {member.phone || member.email || "Não informado"}
            </Text>
          </View>
        ))}
      </View>
      
      <Text style={styles.footer}>
        Relatório gerado em {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR")}
      </Text>
    </Page>
  </Document>
);

// Função para gerar e baixar o relatório PDF
export const generateMembersPdfReport = async (members: Member[], title: string, period: string) => {
  const blob = await pdf(
    <MembersPdfDocument members={members} title={title} period={period} />
  ).toBlob();
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title.replace(/\s+/g, "_")}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
