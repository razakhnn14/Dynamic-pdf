import React from 'react'

export default function PageThumbnails({ pages, currentIndex, onSelect }) {
  return (
    <div className="flex flex-col gap-2">
      {pages.map((p, i) => (
        <div key={p.id} className={`p-2 border rounded cursor-pointer ${i===currentIndex ? 'border-blue-600' : 'border-gray-200'}`} onClick={()=> onSelect(i)}>
          <div className="text-sm font-medium">Page {i+1}</div>
          <div className="text-xs text-gray-500">{p.imageDataUrl ? 'Image set' : 'Blank'}</div>
        </div>
      ))}
    </div>
  )
}