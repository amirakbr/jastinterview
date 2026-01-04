import { Card } from "@/app/_components/kanban/types";
import { useSortableConf } from "../../hooks/useSortableConf";
import { useCard } from "./hooks/useCard";
import Input from "@/app/_components/input/input";
interface CardProps {
  card: Card;
}

export const CardContainer = (props: CardProps) => {
  const { title, commentList } = props.card;
  const { handleTitleChange } = useCard(props.card);
  const { isDragging, style, setNodeRef, attributes, listeners } =
    useSortableConf({
      type: "Card",
      item: props.card,
    });

  if (isDragging) {
    return <div ref={setNodeRef} style={style} className={`card-dragging`} />;
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`card-container`}
        {...attributes}
        {...listeners}
      >
        <div className="card-container-box">
          <Input
            value={title}
            id="input-name"
            onChange={(e) => handleTitleChange(e.target.value)}
            className="card--input-title"
          />
          <button className="card-comment-button">Comments ({commentList?.length || 0})</button>
        </div>
      </div>
    </>
  );
};
