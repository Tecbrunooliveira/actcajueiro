
import React from 'react';
import { Member } from "@/types";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { getStatusLabel } from "./dataService";

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  memberRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderBottomStyle: "solid",
    paddingVertical: 10,
  },
  memberName: {
    flex: 2,
    fontSize: 12,
  },
  memberStatus: {
    flex: 1,
    fontSize: 12,
  },
  memberContact: {
    flex: 2,
    fontSize: 12,
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    paddingBottom: 5,
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 12,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "grey",
  },
});

// Create PDF Document component with explicit React import
const MembersPdfDocument = ({ members, title, period }: { members: Member[]; title: string; period: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>Período: {period}</Text>
      <Text style={styles.subtitle}>Total: {members.length} sócios</Text>
      
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.memberName}>Nome</Text>
          <Text style={styles.memberStatus}>Status</Text>
          <Text style={styles.memberContact}>Contato</Text>
        </View>
        
        {members.map((member) => (
          <View key={member.id} style={styles.memberRow}>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberStatus}>{getStatusLabel(member.status)}</Text>
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

// Function to generate and download PDF report
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
