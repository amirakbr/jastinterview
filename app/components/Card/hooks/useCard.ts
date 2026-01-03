import { useContext } from "react"
import { KanbanContext } from "../../store/KanbanProvider"
import { Card } from "../../../types"
import { handleReaderResponse } from "../../../utils/handleReader"

export const useCard = (card: Card) => {
  const {  addCardImage,editCardTitle, editCardDescription, editCardIsCover, deleteCard } = useContext(KanbanContext)


  const handleTitleChange = (newTitle: string) => {
    editCardTitle(newTitle, card.id)
  }

  const handleDescriptionChange = (newDescription: string) => {
    editCardDescription(newDescription, card.id)
  }

  const handleDeleteCard = () => {
    deleteCard(card.id)
  }

  return {
    handleTitleChange,
    handleDescriptionChange,
    handleDeleteCard,
  }
}