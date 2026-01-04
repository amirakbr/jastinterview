import { Card, Column, Id } from "@/app/_components/kanban/types";
import { CardContainer } from "./Card/CardContainer";
import { generateId } from "../utils/generateId";
import { useSortableConf } from "../hooks/useSortableConf";
import { SortableContext } from "@dnd-kit/sortable";
import { useContext, useMemo } from "react";
import { filterColumn } from "../utils/filterColumn";
import { KanbanContext } from "./store/KanbanProvider";
import Input from "../../input/input";

type Props = {
  column: Column;
};

export const ColumnContainer = (props: Props) => {
  const { column } = props;
  const { cards, setColumns, addCard, editColumnTitle } =
    useContext(KanbanContext);

  const { isDragging, style, setNodeRef, attributes, listeners } =
    useSortableConf({
      type: "Column",
      item: column,
    });

  const filteredCards = useMemo(
    () => cards.filter((card) => card.columnId === column.id),
    [cards, column.id]
  );

  const onInputChange = (newTitle: string) => {
    editColumnTitle(newTitle, column.id);
  };

  const addNewCard = () => {
    const newCard: Card = {
      id: generateId(),
      title: "New card",
      columnId: column.id,
    };
    addCard(newCard);
  };

  const deleteColumn = (id: Id) => {
    setColumns((prev) => filterColumn(prev, id));
  };

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
        <Input
          type="text"
          value={column.title}
          onChange={(e) => onInputChange(e.target.value)}
          className="column--input-title"
        />
      </div>
      <div className="column-card--container">
        <SortableContext items={filteredCards.map((el) => el.id)}>
          <div className="column-card--container-list">
            {filteredCards.map((card) => (
              <CardContainer key={card.id} card={card} />
            ))}
          </div>
        </SortableContext>
      </div>
      <button
        onClick={() => {
          addNewCard();
        }}
        className="column-card--addNewCard"
      >
        + Add Another Card
      </button>
    </div>
  );
};
