
import { StyleSheet } from "@react-pdf/renderer";

export const tableStyles = StyleSheet.create({
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#008c9e",
    borderRadius: 4,
    padding: 3,
    marginBottom: 4,
    color: "white",
    fontWeight: 500,
    alignItems: "center",
  },
  memberPhotoHeader: {
    width: "15%",
    fontSize: 7,
    textAlign: "left",
    paddingLeft: 4,
  },
  memberNameHeader: {
    width: "55%",
    fontSize: 7,
    textAlign: "left",
  },
  memberStatusHeader: {
    width: "30%",
    fontSize: 7,
    textAlign: "right",
    paddingRight: 8,
  },
  memberRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#edf2f7",
    borderBottomStyle: "solid",
    padding: 3,
    marginBottom: 2,
    backgroundColor: "#FAFAFA",
    borderRadius: 3,
    alignItems: "center",
  },
  memberPhoto: {
    width: "15%",
    paddingLeft: 2,
    alignItems: "flex-start",
  },
  memberPhotoImage: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#008c9e",
    objectFit: "cover",
  },
  memberPhotoPlaceholder: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fce138",
    alignItems: "center",
    justifyContent: "center",
  },
  memberPhotoInitial: {
    color: "#333",
    fontSize: 7,
    fontWeight: "bold",
  },
  memberName: {
    width: "55%",
    fontSize: 8,
    fontWeight: 500,
    color: "#2D3748",
    paddingLeft: 4,
  },
  memberStatus: {
    width: "30%",
    textAlign: "right",
    paddingRight: 4,
  },
});
