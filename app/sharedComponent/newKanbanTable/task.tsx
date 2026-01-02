import { UniqueIdentifier } from "@dnd-kit/core";
import { Task } from "./interface";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableTaskProps {
  id: UniqueIdentifier;
  task: Task;
}

function SortableTask({ id, task }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: "Task",
      task: task,
      // You can store the parent column ID here if needed for logic,
      // but we are finding it by lookup in board.tsx now.
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
    >
      <span className={`tag ${task.tag}`}>{task.tag}</span>
      <p>{task.content}</p>
    </div>
  );
}

export default SortableTask;
