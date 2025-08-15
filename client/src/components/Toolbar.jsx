import React from 'react'
import { useTemplate,} from '../context/TemplateContext'

export default function Toolbar({ onAddField, onDeleteField, selectedFieldId }) {
  return (
    <div className="flex items-center gap-2">
      <button className="px-3 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-500" onClick={()=> onAddField('text')}>Add Text</button>
      <button className="px-3 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-500" onClick={()=> onAddField('date')}>Add Date</button>
      <button className="px-3 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-500" onClick={()=> onAddField('checkbox')}>Add Checkbox</button>
      <button className="px-3 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-500" onClick={()=> onAddField('image')}>Add Image</button>
      <button className="px-3 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-500" onClick={()=> onAddField('qrcode')}>Add QR</button>

      <div className="flex-1" />
      <button className="px-3 py-2 bg-red-500 hover:bg-red-400  text-white rounded-lg cursor-pointer" onClick={onDeleteField} disabled={!selectedFieldId}>Delete Selected</button>
    </div>
  )
}