import { useContext } from "react";
import { KanbanContext } from "../../store/KanbanProvider";
import { Card } from "@/app/_components/kanban/types";

export const useCard = (card: Card) => {
  const {
    editCardTitle,
    editCardDescription,
    deleteCard,
  } = useContext(KanbanContext);

  const handleTitleChange = (newTitle: string) => {
    editCardTitle(newTitle, card.id);
  };

  const handleDescriptionChange = (newDescription: string) => {
    editCardDescription(newDescription, card.id);
  };

  const handleDeleteCard = () => {
    deleteCard(card.id);
  };

  return {
    handleTitleChange,
    handleDescriptionChange,
    handleDeleteCard,
  };
};
