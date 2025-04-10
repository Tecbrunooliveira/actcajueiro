
import React from 'react';
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { PieChartLegend } from "../components/PieChartLegend";
import { styles } from "../styles";

// Report360 PDF Document component
export const Report360PdfDocument = ({ 
  title, 
  period, 
  memberStatusData, 
  paymentStatusData,
  expensesData,
  financialSummary
}: { 
  title: string; 
  period: string;
  memberStatusData: { name: string; value: number; color: string }[];
  paymentStatusData: { name: string; value: number; color: string }[];
  expensesData: { name: string; value: number; color: string }[];
  financialSummary: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  };
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Período: {period}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Gerado em</Text>
            <Text style={styles.statValue}>{new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</Text>
          </View>
        </View>
      </View>
      
      {/* Financial Summary Section */}
      <View style={styles.report360Section}>
        <Text style={styles.report360SectionTitle}>Resumo Financeiro</Text>
        <View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Receita Total</Text>
            <Text style={styles.summaryValue}>
              {financialSummary.totalIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Despesas Totais</Text>
            <Text style={styles.summaryValue}>
              {financialSummary.totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Balanço</Text>
            <Text style={financialSummary.balance >= 0 ? styles.summaryValuePositive : styles.summaryValueNegative}>
              {financialSummary.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>
          </View>
        </View>
      </View>

      {/* Member Status Section */}
      <View style={styles.report360Section}>
        <Text style={styles.report360SectionTitle}>Status dos Sócios</Text>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Distribuição por Status</Text>
          <PieChartLegend data={memberStatusData} />
        </View>
      </View>

      {/* Payment Status Section */}
      <View style={styles.report360Section}>
        <Text style={styles.report360SectionTitle}>Status de Pagamentos</Text>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Sócios Em Dia vs. Inadimplentes</Text>
          <PieChartLegend data={paymentStatusData} />
        </View>
      </View>

      {/* Expenses Section */}
      <View style={styles.report360Section}>
        <Text style={styles.report360SectionTitle}>Despesas por Categoria</Text>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Distribuição de Despesas</Text>
          <PieChartLegend data={expensesData} />
        </View>
      </View>
      
      <Text style={styles.footer}>
        Relatório gerado em {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR")}
      </Text>
    </Page>
  </Document>
);
