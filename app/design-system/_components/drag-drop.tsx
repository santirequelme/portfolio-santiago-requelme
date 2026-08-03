"use client"

import { useState } from "react"
import { GripVertical } from "lucide-react"

const INITIAL = [
  "Define design tokens",
  "Build component primitives",
  "Document usage guidelines",
  "Ship to production",
  "Gather team feedback",
]

export function DragDropDemo() {
  const [items, setItems] = useState(INITIAL)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  function handleDrop(target: number) {
    if (dragIndex === null || dragIndex === target) {
      setDragIndex(null)
      setOverIndex(null)
      return
    }
    setItems((prev) => {
      const next = [...prev]
      const [moved] = next.splice(dragIndex, 1)
      next.splice(target, 0, moved)
      return next
    })
    setDragIndex(null)
    setOverIndex(null)
  }

  return (
    <ul className="dsx-dnd" role="list">
      {items.map((item, i) => (
        <li
          key={item}
          className="dsx-dnd__item"
          draggable
          data-dragging={dragIndex === i}
          data-over={overIndex === i && dragIndex !== i}
          onDragStart={() => setDragIndex(i)}
          onDragEnter={() => setOverIndex(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(i)}
          onDragEnd={() => {
            setDragIndex(null)
            setOverIndex(null)
          }}
        >
          <GripVertical size={16} className="dsx-dnd__grip" />
          <span className="dsx-dnd__idx">{i + 1}</span>
          <span className="dsx-dnd__label">{item}</span>
        </li>
      ))}
    </ul>
  )
}
