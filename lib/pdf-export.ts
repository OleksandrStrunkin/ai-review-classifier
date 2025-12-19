import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

export const generateProfessionalPDF = async (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const dataUrl = await htmlToImage.toPng(element, {
      quality: 0.95,
      backgroundColor: "#111827",
      pixelRatio: 2,
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`feedback-analysis-${Date.now()}.pdf`);
  } catch (error) {
    console.error("Помилка при створенні PDF:", error);
  }
};
