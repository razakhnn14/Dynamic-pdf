export const A4 = { width: 595.28, height: 841.89 }

export function pxToPdfPoints(px, editorSizePx, pdfSizePt){
  return (px / editorSizePx) * pdfSizePt
}