import { toast } from "sonner";

export async function exportResumeToPDF(nodeId: string, fileName: string): Promise<void> {
  const node = document.getElementById(nodeId);
  if (!node) {
    toast.error("Preview not ready");
    return;
  }
  toast.loading("Generating PDF…", { id: "pdf" });
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
    toast.success("PDF downloaded", { id: "pdf" });
  } catch (err) {
    console.error(err);
    toast.error("PDF export failed", { id: "pdf" });
  } finally {
    if (prevStyle === null) node.removeAttribute("style");
    else node.setAttribute("style", prevStyle);
    if (wasHidden) node.classList.add("hidden");
    else node.classList.remove("hidden");
    document.documentElement.classList.remove("pdf-export-mode");
  }
}
