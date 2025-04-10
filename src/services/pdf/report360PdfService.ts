
import { pdf } from "@react-pdf/renderer";
import { Report360PdfDocument } from "./documents/Report360PdfDocument";
import { downloadPdf } from "./utils";

// Function to generate and download the report 360 in PDF
export const generateReport360Pdf = async (
  title: string,
  period: string,
  memberStatusData: { name: string; value: number; color: string }[],
  paymentStatusData: { name: string; value: number; color: string }[],
  expensesData: { name: string; value: number; color: string }[],
  financialSummary: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  }
) => {
  const blob = await pdf(
    <Report360PdfDocument 
      title={title}
      period={period}
      memberStatusData={memberStatusData}
      paymentStatusData={paymentStatusData}
      expensesData={expensesData}
      financialSummary={financialSummary}
    />
  ).toBlob();
  
  downloadPdf(blob, title);
};
