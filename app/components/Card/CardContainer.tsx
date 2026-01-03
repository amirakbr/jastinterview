import { useState } from 'react'
import { Minus, GripVertical } from 'lucide-react'
import { Card } from '../../types'
import { useSortableConf } from '../../hooks/useSortableConf'
import { CardDetail } from './CardDetail'
import { useCard } from './hooks/useCard'
interface CardProps {
  card: Card
}

export const CardContainer = (props: CardProps) => {
  const { title } = props.card
  const {handleTitleChange, handleDeleteCard} = useCard(props.card)
  const { isDragging, style, setNodeRef, attributes, listeners } =
    useSortableConf({
      type: 'Card',
      item: props.card
    })

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`h-18 w-full opacity-50 p-4 bg-mainBackgroundColor border-2 border-columnBackgroundColor rounded-md`}
      />
    )
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`h-18 w-full gap-y-4 p-x-2 overflow-y-auto bg-mainBackgroundColor border-2 border-columnBackgroundColor rounded-md flex flex-col justify-center text-white cursor-pointer`}
      >
        <label className='w-full flex h-fit items-center gap-2'>
          <input
            value={title}
            id='input-name'
            onChange={e => handleTitleChange(e.target.value)}
            className='bg-transparent rounded-[4px] flex-grow'
          />
          <span className='flex gap-2'>
          <Minus onClick={handleDeleteCard} className='cursor-pointer' />
          <GripVertical  {...attributes} {...listeners} onClick={(e)=>{
            e.stopPropagation()
            e.preventDefault()
          }} />
          </span>
        </label>
      
      </div>
    </>
  )
}
