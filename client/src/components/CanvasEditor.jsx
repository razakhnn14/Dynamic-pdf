import React, { useRef, useEffect } from 'react'
import { Stage, Layer, Image as KImage, Rect, Text, Transformer } from 'react-konva'
import useImage from 'use-image'
import { useTemplate } from '../context/TemplateContext'

function FieldShape({ field, isSelected }) {
  const { updateField, selectField } = useTemplate()
  const shapeRef = useRef()
  const trRef = useRef()

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  return (
    <>
      <Rect
        x={field.x}
        y={field.y}
        width={field.width}
        height={field.height}
        stroke={isSelected ? '#2563eb' : 'rgba(0,0,0,0.2)'}
        strokeWidth={isSelected ? 2 : 1}
        ref={shapeRef}
        rotation={field.rotation || 0}
        draggable
        onClick={() => selectField(field.id)}
        onTap={() => selectField(field.id)}
        onDragEnd={(e) => updateField({ ...field, x: e.target.x(), y: e.target.y() })}
        onTransformEnd={() => {
          const node = shapeRef.current
          const scaleX = node.scaleX()
          const scaleY = node.scaleY()
          node.scaleX(1); node.scaleY(1)
          updateField({
            ...field,
            x: node.x(),
            y: node.y(),
            width: Math.max(10, node.width() * scaleX),
            height: Math.max(10, node.height() * scaleY),
            rotation: node.rotation()
          })
        }}
      />
      <Text text={field.text || field.type} x={field.x + 6} y={field.y + 6} fontSize={field.fontSize || 14} />
      {isSelected && <Transformer ref={trRef} rotateEnabled enabledAnchors={['top-left','top-right','bottom-left','bottom-right']} />}
    </>
  )
}

export default function CanvasEditor({ page, fields, pageIndex, selectedFieldId }) {
  const { updateField } = useTemplate()
  const [img] = useImage(page?.imageDataUrl || '')
  const stageW = page?.width || 595
  const stageH = page?.height || 842

  return (
    <div style={{ width: stageW, height: stageH }} className="shadow bg-white">
      <Stage width={stageW} height={stageH}>
        <Layer>
          {img && <KImage image={img} x={0} y={0} width={stageW} height={stageH} />}
          {fields.filter(f => f.pageIndex === pageIndex).map(f => (
            <FieldShape key={f.id} field={f} isSelected={selectedFieldId === f.id} />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}