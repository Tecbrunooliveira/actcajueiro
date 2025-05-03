
import { Font } from "@react-pdf/renderer";

// Flag to track initialization status
let initialized = false;

// Register fonts for PDF
const registerFonts = () => {
  Font.register({
    family: 'Roboto',
    fonts: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
    ]
  });
};

// Initialize PDF utilities
export const initializePdfUtils = () => {
  if (initialized) {
    return;
  }
  
  try {
    registerFonts();
    initialized = true;
    console.log("PDF utilities initialized successfully");
  } catch (error) {
    console.error("Failed to initialize PDF utilities:", error);
  }
};

// Helper function to download PDF
export const downloadPdf = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName.replace(/\s+/g, "_")}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // Clean up the URL object
};
