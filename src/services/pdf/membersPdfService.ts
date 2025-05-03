
import React from 'react';
import { Member } from "@/types";
import { pdf } from "@react-pdf/renderer";
import { MembersPdfDocument } from "./documents/MembersPdfDocument";
import { downloadPdf, initializePdfUtils } from "./utils";

// Function to generate and download the members PDF report
export const generateMembersPdfReport = async (
  members: Member[], 
  title: string, 
  period: string
) => {
  // Inicializar utilitários PDF antes de usá-los
  initializePdfUtils();
  
  const blob = await pdf(
    React.createElement(MembersPdfDocument, { members, title, period })
  ).toBlob();
  
  downloadPdf(blob, title);
};
