import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { pxToPdfPoints, A4 } from './utils'

export async function exportTemplateToPdf(template, options = {}) {
  const pageSize = options.pageSize || A4
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  for (let p = 0; p < template.pages.length; p++) {
    const pageData = template.pages[p]
    const page = pdfDoc.addPage([pageSize.width, pageSize.height])

    if (pageData.imageDataUrl) {
      const matches = pageData.imageDataUrl.match(/^data:(image\/\w+);base64,(.*)$/)
      if (matches) {
        const mime = matches[1]
        const b64 = matches[2]
        const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
        let embedded = (mime === 'image/png') ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes)
        const { width: imgW, height: imgH } = embedded.scale(1)
        const scale = Math.min(pageSize.width / imgW, pageSize.height / imgH)
        const drawW = imgW * scale
        const drawH = imgH * scale
        const x = (pageSize.width - drawW) / 2
        const y = (pageSize.height - drawH) / 2
        page.drawImage(embedded, { x, y, width: drawW, height: drawH })
      }
    }

    const fieldsOnPage = template.fields.filter(f => f.pageIndex === p)
    for (const f of fieldsOnPage) {
      const xPt = pxToPdfPoints(f.x, pageData.width, pageSize.width)
      const yPtFromTop = pxToPdfPoints(f.y, pageData.height, pageSize.height)
      const yPt = pageSize.height - yPtFromTop - pxToPdfPoints(f.height, pageData.height, pageSize.height)
      const wPt = pxToPdfPoints(f.width, pageData.width, pageSize.width)
      const hPt = pxToPdfPoints(f.height, pageData.height, pageSize.height)

      if (f.type === 'text' || f.type === 'date' || f.type === 'signature') {
        const txt = f.text || ''
        const fontSize = f.fontSize || 12
        page.drawText(txt, {
          x: xPt + 2,
          y: yPt + Math.max(2,(hPt - fontSize) / 2),
          size: fontSize,
          font,
          color: rgb(0,0,0),
          maxWidth: Math.max(1, wPt - 4)
        })

        if (options.asAcroForm) {
          const form = pdfDoc.getForm()
          const tf = form.createTextField(`field_${f.id}`)
          tf.setText(txt)
          tf.addToPage(page, { x: xPt, y: yPt, width: wPt, height: hPt })
          if (f.required) tf.enableRequired()
        }
      } else if (f.type === 'checkbox') {
        if (options.asAcroForm) {
          const form = pdfDoc.getForm()
          const cb = form.createCheckBox(`field_${f.id}`)
          if (f.options?.checked) cb.check()
          cb.addToPage(page, { x: xPt, y: yPt, width: wPt, height: hPt })
          if (f.required) cb.enableRequired()
        } else {
          page.drawRectangle({ x: xPt, y: yPt, width: wPt, height: hPt, borderColor: rgb(0,0,0) })
        }
      } else if (f.type === 'image' || f.type === 'qrcode') {
        if (f.options?.imageDataUrl) {
          const matches = f.options.imageDataUrl.match(/^data:(image\/\w+);base64,(.*)$/)
          if (matches) {
            const mime = matches[1], b64 = matches[2]
            const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
            let embedded = (mime === 'image/png') ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes)
            const { width: imgW, height: imgH } = embedded.scale(1)
            const scale = Math.min(wPt / imgW, hPt / imgH)
            const drawW = imgW * scale, drawH = imgH * scale
            page.drawImage(embedded, { x: xPt, y: yPt, width: drawW, height: drawH })
          }
        } else {
          page.drawRectangle({ x: xPt, y: yPt, width: wPt, height: hPt, borderColor: rgb(0.5,0.5,0.5), borderWidth: 1 })
          page.drawText(f.type.toUpperCase(), { x: xPt+4, y: yPt + hPt/2 - 6, size: 10, font, color: rgb(0.4,0.4,0.4) })
        }
      }
    }
  }

  if (options.flatten && options.asAcroForm) {
    const form = pdfDoc.getForm()
    form.flatten()
  }

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}