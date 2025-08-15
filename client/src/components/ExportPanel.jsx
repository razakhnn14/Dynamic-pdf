import React from 'react'
import { exportTemplateToPdf } from '../libs/pdfExport'

export default function ExportPanel({ getTemplate }) {
  return (
    <div className="flex flex-col gap-2">
      <button className="px-3 py-2 bg-green-600 cursor-pointer hover:bg-green-500 text-white rounded-lg" onClick={async ()=>{
        const tpl = getTemplate()
        if(!tpl) return
        const bytes = await exportTemplateToPdf(tpl, { asAcroForm: true, flatten: false })
        const blob = new Blob([bytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = 'output-acroform.pdf'; a.click(); URL.revokeObjectURL(url)
      }}>Export (AcroForm)</button>

      <button className="px-3 py-2 bg-green-600 cursor-pointer hover:bg-green-500 text-white rounded-lg" onClick={async ()=>{
        const tpl = getTemplate(); const bytes = await exportTemplateToPdf(tpl, { asAcroForm: true, flatten: true })
        const blob = new Blob([bytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = 'output-flattened.pdf'; a.click(); URL.revokeObjectURL(url)
      }}>Export (Flattened)</button>

      <button className="px-3 py-2 bg-green-600 cursor-pointer hover:bg-green-500 text-white rounded-lg" onClick={async ()=>{
        const tpl = getTemplate(); const bytes = await exportTemplateToPdf(tpl, { asAcroForm: false, flatten: false })
        const blob = new Blob([bytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = 'output.pdf'; a.click(); URL.revokeObjectURL(url)
      }}>Export (No form)</button>
    </div>
  )
}