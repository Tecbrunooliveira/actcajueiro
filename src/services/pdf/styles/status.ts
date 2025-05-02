
import { StyleSheet } from "@react-pdf/renderer";

export const statusStyles = StyleSheet.create({
  statusBadge: {
    fontSize: 7,
    padding: "1 3",
    borderRadius: 3,
    textAlign: "center",
    width: "90%",
  },
  statusActive: {
    backgroundColor: "#C6F6D5",
    color: "#22543D",
    borderWidth: 1,
    borderColor: "#10b981",
  },
  statusInactive: {
    backgroundColor: "#FED7D7",
    color: "#822727",
    borderWidth: 1,
    borderColor: "#F56565",
  },
  statusWarning: {
    backgroundColor: "#FEEBC8",
    color: "#744210",
    borderWidth: 1,
    borderColor: "#F6AD55",
  },
  statusPending: {
    backgroundColor: "#E9E9E9",
    color: "#4A5568",
    borderWidth: 1,
    borderColor: "#A0AEC0",
  },
  statusSuspenso: {
    backgroundColor: "#FDE1D3",
    color: "#9C4221",
    borderWidth: 1,
    borderColor: "#F97316",
  },
  statusLicenciado: {
    backgroundColor: "#FEF7CD",
    color: "#723B13",
    borderWidth: 1,
    borderColor: "#ECC94B",
  },
});
