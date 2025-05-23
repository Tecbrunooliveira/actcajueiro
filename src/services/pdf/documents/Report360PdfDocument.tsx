
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
}) => {
  // Extract the payment status values - ensure we handle undefined gracefully
  const paidMembersCount = paymentStatusData.find(item => item.name === 'Em Dia')?.value || 0;
  const unpaidMembersCount = paymentStatusData.find(item => item.name === 'Inadimplentes')?.value || 0;
  
  // For debugging
  console.log("PDF Payment Status Data:", JSON.stringify(paymentStatusData));
  console.log("Paid members count:", paidMembersCount);
  console.log("Unpaid members count:", unpaidMembersCount);
  
  return (
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

        {/* Members Summary Section */}
        <View style={styles.report360Section}>
          <Text style={styles.report360SectionTitle}>Resumo de Sócios</Text>
          <View style={styles.summaryTableContainer}>
            <View style={styles.summaryTableHeader}>
              <Text style={styles.summaryTableHeaderText}>Status</Text>
              <Text style={styles.summaryTableHeaderText}>Quantidade</Text>
            </View>
            {paymentStatusData.map((item, index) => (
              <View key={index} style={styles.summaryTableRow}>
                <Text style={styles.summaryTableCell}>{item.name}</Text>
                <Text style={styles.summaryTableCellValue}>{item.value}</Text>
              </View>
            ))}
            <View style={styles.summaryTableRow}>
              <Text style={styles.summaryTableCellTotal}>Total</Text>
              <Text style={styles.summaryTableCellTotalValue}>
                {paymentStatusData.reduce((acc, curr) => acc + curr.value, 0)}
              </Text>
            </View>
          </View>
          
          {/* Add a more explicit breakdown of paid vs unpaid */}
          <View style={{...styles.summaryTableContainer, marginTop: 10}}>
            <View style={styles.summaryTableHeader}>
              <Text style={styles.summaryTableHeaderText}>Detalhamento</Text>
              <Text style={styles.summaryTableHeaderText}>Quantidade</Text>
            </View>
            <View style={styles.summaryTableRow}>
              <Text style={styles.summaryTableCell}>Sócios em Dia</Text>
              <Text style={styles.summaryTableCellValue}>{paidMembersCount}</Text>
            </View>
            <View style={styles.summaryTableRow}>
              <Text style={styles.summaryTableCell}>Sócios Inadimplentes</Text>
              <Text style={styles.summaryTableCellValue}>{unpaidMembersCount}</Text>
            </View>
          </View>
        </View>

        {/* Expenses Summary Section */}
        <View style={styles.report360Section}>
          <Text style={styles.report360SectionTitle}>Resumo de Despesas por Categoria</Text>
          <View style={styles.chartContainer}>
            <PieChartLegend data={expensesData} />
            {expensesData.length === 0 && (
              <Text style={styles.noDataText}>Nenhuma despesa registrada para este período</Text>
            )}
          </View>
        </View>
        
        <Text style={styles.footer}>
          Relatório gerado em {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR")}
        </Text>
      </Page>
    </Document>
  );
};
