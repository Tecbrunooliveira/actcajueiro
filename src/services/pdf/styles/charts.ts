
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
  }
};
