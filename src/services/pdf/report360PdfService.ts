
import React from 'react';
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
    React.createElement(Report360PdfDocument, {
      title,
      period,
      memberStatusData,
      paymentStatusData,
      expensesData,
      financialSummary
    })
  ).toBlob();
  
  downloadPdf(blob, title);
};
