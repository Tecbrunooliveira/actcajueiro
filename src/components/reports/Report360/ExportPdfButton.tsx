
import React from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

type ExportPdfButtonProps = {
  generatingPdf: boolean;
  handleGeneratePdfReport: () => void;
};

export const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({
  generatingPdf,
  handleGeneratePdfReport,
}) => (
  <Button
    size="sm"
    onClick={handleGeneratePdfReport}
    disabled={generatingPdf}
    className="ml-auto gradient-bg hover:bg-gradient-to-r hover:from-club-600 hover:via-club-500 hover:to-club-400 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
  >
    {generatingPdf ? (
      <>
        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
        Gerando...
      </>
    ) : (
      <>
        <FileDown className="mr-2 h-4 w-4" />
        Exportar PDF
      </>
    )}
  </Button>
);
