// utils/usePdfDownloader.js
import { useRef } from "react";
import { usePDF } from "react-to-pdf";

const usePdfDownloader = (filename = "document.pdf") => {
  const targetRef = useRef(null);
  const { toPDF, ...rest } = usePDF({
    targetRef,
    filename,
  });

  const download = () => {
    if (targetRef.current) {
      toPDF();
    } else {
      console.error("Target ref is not set.");
    }
  };

  return { targetRef, download, ...rest };
};

export default usePdfDownloader;
