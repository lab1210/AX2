"use client";
import html2pdf from "html2pdf.js";

const downloadPdf = (selector, filename = "Document.pdf") => {
  const element = document.querySelector(selector);

  if (!element) {
    console.error(`Element with selector '${selector}' not found.`);
    return;
  }

  const opt = {
    margin: 10,
    filename: filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().from(element).set(opt).save();
};

export default downloadPdf;
