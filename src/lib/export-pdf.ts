import { toast } from "sonner";
import type { Resume } from "@/lib/resume-types";

async function exportNodeToPDF(
  nodeId: string,
  fileName: string,
  toastId: string,
  loadingMsg: string,
  successMsg: string,
): Promise<void> {
  const node = document.getElementById(nodeId);
  if (!node) {
    toast.error("Preview not ready");
    return;
  }
  toast.loading(loadingMsg, { id: toastId });
  const prevStyle = node.getAttribute("style");
  const wasHidden = node.classList.contains("hidden");
  document.documentElement.classList.add("pdf-export-mode");

  node.setAttribute("style", "position:fixed;left:-10000px;top:0;display:block;background:#fff;");
  node.classList.remove("hidden");

  try {
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);
    const canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: node.scrollWidth,
      windowHeight: node.scrollHeight,
    });
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = 210;
    const pageH = 297;
    const imgH = (canvas.height * pageW) / canvas.width;
    const img = canvas.toDataURL("image/jpeg", 0.95);
    if (imgH <= pageH) {
      pdf.addImage(img, "JPEG", 0, 0, pageW, imgH);
    } else {
      let remaining = imgH;
      let y = 0;
      while (remaining > 0) {
        pdf.addImage(img, "JPEG", 0, y, pageW, imgH);
        remaining -= pageH;
        if (remaining > 0) {
          pdf.addPage();
          y -= pageH;
        }
      }
    }
    pdf.save(fileName);
    toast.success(successMsg, { id: toastId });
  } catch (err) {
    console.error(err);
    toast.error("PDF export failed", { id: toastId });
  } finally {
    if (prevStyle === null) node.removeAttribute("style");
    else node.setAttribute("style", prevStyle);
    if (wasHidden) node.classList.add("hidden");
    else node.classList.remove("hidden");
    document.documentElement.classList.remove("pdf-export-mode");
  }
}

export async function exportResumeToPDF(nodeId: string, fileName: string): Promise<void> {
  return exportNodeToPDF(nodeId, fileName, "pdf", "Generating PDF…", "PDF downloaded");
}

export async function exportCoverLetterToPDF(nodeId: string, fileName: string): Promise<void> {
  return exportNodeToPDF(
    nodeId,
    fileName,
    "cl-pdf",
    "Generating cover letter PDF…",
    "Cover letter PDF downloaded",
  );
}

export async function exportPackagePDF(resume: Resume): Promise<void> {
  const baseName = resume.name.replace(/\s+/g, "_");
  toast.loading("Exporting package (1/2)…", { id: "pkg-pdf" });
  try {
    await exportNodeToPDF(
      "resume-print",
      `${baseName}.pdf`,
      "pkg-inner-1",
      "Generating resume…",
      "Resume done",
    );
    toast.loading("Exporting package (2/2)…", { id: "pkg-pdf" });
    await exportNodeToPDF(
      "cover-letter-print",
      `${baseName}_CoverLetter.pdf`,
      "pkg-inner-2",
      "Generating cover letter…",
      "Cover letter done",
    );
    toast.success("Package exported — 2 PDFs downloaded", { id: "pkg-pdf" });
  } catch (err) {
    console.error(err);
    toast.error("Package export failed", { id: "pkg-pdf" });
  }
}
