
import { StyleSheet } from "@react-pdf/renderer";

// Define styles for PDF with visual more modern
export const styles = StyleSheet.create({
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
  chartContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 10,
    color: "#0CA678",
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
    color: "#0CA678",
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
  },
  report360SectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#2C5282",
    marginBottom: 15,
  },
});
