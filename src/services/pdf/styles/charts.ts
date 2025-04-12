
import { StyleSheet } from "@react-pdf/renderer";

export const chartStyles = StyleSheet.create({
  chartContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 10,
    color: "#46b644",
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    marginRight: 8,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 10,
    color: "#4A5568",
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
    borderBottomStyle: 'solid',
  },
  summaryLabel: {
    fontSize: 12,
    color: "#4A5568",
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: "#2D3748",
  },
  summaryValuePositive: {
    fontSize: 12,
    fontWeight: 'bold',
    color: "#46b644",
  },
  summaryValueNegative: {
    fontSize: 12,
    fontWeight: 'bold',
    color: "#E53E3E",
  },
  report360Section: {
    marginTop: 25,
    marginBottom: 15,
    borderTop: '1px solid #e0e0e0',
    paddingTop: 20,
    backgroundColor: "#F9FAFB",
    padding: 20,
    borderRadius: 8,
  },
  report360SectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#46b644",
    marginBottom: 15,
  },
});
