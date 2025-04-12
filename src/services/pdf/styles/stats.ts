
import { StyleSheet } from "@react-pdf/renderer";

export const statsStyles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 6,
    gap: 10,
  },
  stat: {
    padding: 5,
    borderRadius: 4,
    backgroundColor: "#F0FFF4",
    width: 60,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#008c9e",
    borderStyle: "solid",
  },
  statLabel: {
    fontSize: 7,
    color: "#4A5568",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 9,
    fontWeight: 700,
    color: "#008c9e",
  },
});
