import { Card, Column, Id } from '../types'
import { CardContainer } from './Card/CardContainer'
import { generateId } from '../utils/generateId'
import { useSortableConf } from '../hooks/useSortableConf'
import { SortableContext } from '@dnd-kit/sortable'
import { useContext, useMemo, useState } from 'react'
import { Trash2, GripVertical } from 'lucide-react'
import DeleteConfirmation from './DeleteConfirmation';
import { filterColumn } from '../utils/filterColumn'
import { KanbanContext } from './store/KanbanProvider'

type Props = {
  column: Column
}

export const ColumnContainer = (props: Props) => {
  const { column } = props
  const { cards, setColumns, addCard, editColumnTitle } = useContext(KanbanContext)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const { isDragging, style, setNodeRef, attributes, listeners } =
    useSortableConf({
      type: 'Column',
      item: column
    })

  const filteredCards = useMemo(() => cards.filter(card => card.columnId === column.id), [cards, column.id])

  const onInputChange = (newTitle: string) => {
    editColumnTitle(newTitle, column.id)
  }

  const addNewCard = () => {
    const newCard: Card = {
      id: generateId(),
      title: 'New card',
      description: '',
      srcImage: '',
      imageCovered: true,
      columnId: column.id
    }
    addCard(newCard)
  }

  const handleConfirmationDelete = () => {
    if (filteredCards.length > 0) {
      setShowDeleteConfirmation(true)
    } else {
      handleDeleteCard()
    }
  };

  const deleteColumn = (id: Id) => {
    setColumns((prev) => filterColumn(prev, id))
  }

  const handleDeleteCard = () => {
    deleteColumn(column.id)
  }


  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className="column-dragging"></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="column"
      {...attributes}
      {...listeners}
    >
      <div className="column-card">
        <label className="flex items-center">
          <div className="flex-1">
            <input
              type="text"
              value={column.title}
              onChange={(e) => onInputChange(e.target.value)}
              className="bg-transparent"
            />
          </div>
        </label>
      </div>

      <div className="column-card--container">
        <SortableContext items={filteredCards.map((el) => el.id)}>
          <div className="column-card--container-list">
            {filteredCards.map((card) => (
              <CardContainer key={card.id} card={card} />
            ))}
          </div>
        </SortableContext>
        <button
          onClick={() => {
            addNewCard();
          }}
          className="column-card--addNewCard"
        >
          + Add Another Card
        </button>
      </div>
    </div>
  );
}
