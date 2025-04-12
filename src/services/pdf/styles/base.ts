
import { StyleSheet } from "@react-pdf/renderer";

export const baseStyles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 24,
    fontFamily: 'Roboto',
  },
  headerSection: {
    marginBottom: 15,
    paddingBottom: 8,
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 700,
    color: "#00b4cc",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 9,
    marginBottom: 3,
    color: "#4A5568",
    textAlign: "center",
  },
  section: {
    margin: 0,
    padding: 0,
    flexGrow: 1,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    borderTop: "1px solid #E2E8F0",
    paddingTop: 8,
    fontSize: 7,
    color: "#718096",
    textAlign: "center",
  },
});
