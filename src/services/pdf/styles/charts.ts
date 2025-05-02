
// Styles for charts used in PDF documents
export const chartStyles = {
  chartContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    marginRight: 5,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 10,
  },
  noDataText: {
    fontSize: 11,
    marginTop: 20,
    textAlign: 'center' as const,
    color: '#666',
    fontStyle: 'italic' as const,
  },
  summaryTableContainer: {
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
  },
  summaryTableHeader: {
    flexDirection: 'row' as const,
    backgroundColor: '#f8fafc',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  summaryTableHeaderText: {
    fontSize: 11,
    fontWeight: 'bold' as const,
    flex: 1,
    color: '#334155',
  },
  summaryTableRow: {
    flexDirection: 'row' as const,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 8,
  },
  summaryTableCell: {
    fontSize: 10,
    flex: 1,
    color: '#475569',
  },
  summaryTableCellValue: {
    fontSize: 10,
    flex: 1,
    textAlign: 'right' as const,
    color: '#475569',
  },
  summaryTableCellTotal: {
    fontSize: 10,
    fontWeight: 'bold' as const,
    flex: 1,
    color: '#334155',
  },
  summaryTableCellTotalValue: {
    fontSize: 10,
    fontWeight: 'bold' as const,
    flex: 1,
    textAlign: 'right' as const,
    color: '#334155',
  },
  // Adding the missing styles for the report360 document
  report360Section: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: '1px solid #e0e0e0',
  },
  report360SectionTitle: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    marginBottom: 8,
    color: '#334155',
  },
  summaryItem: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: 'bold' as const,
    color: '#334155',
  },
  summaryValuePositive: {
    fontSize: 10,
    fontWeight: 'bold' as const,
    color: '#10b981',
  },
  summaryValueNegative: {
    fontSize: 10,
    fontWeight: 'bold' as const,
    color: '#ef4444',
  }
};
