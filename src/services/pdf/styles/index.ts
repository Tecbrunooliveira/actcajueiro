
import { StyleSheet } from "@react-pdf/renderer";
import { baseStyles } from "./base";
import { tableStyles } from "./table";
import { statusStyles } from "./status";
import { statsStyles } from "./stats";
import { chartStyles } from "./charts";

// Export the merged styles
export const styles = StyleSheet.create({
  ...baseStyles,
  ...tableStyles,
  ...statusStyles,
  ...statsStyles,
  ...chartStyles,
});
