import { useState } from "react";
import { Column, DraggableData, TasksState } from "./interface";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import SortableColumn from "./column";

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", title: "To Do", tasks: [] },
    { id: "in-progress", title: "In Progress", tasks: [] },
    { id: "done", title: "Done", tasks: [] },
    { id: "archive", title: "Archive", tasks: [] },
  ]);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Identify what we are dragging for the DragOverlay
  const activeTask = activeId
    ? Object.values(columns)
        .flat()
        .find((task) => task.id === activeId)
    : null;

  const activeColumn = activeId
    ? columns.find((col) => col.id === activeId)
    : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // We keep the previous logic for tasks moving between columns in real-time
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeData = active.data.current as DraggableData | undefined;
    const overData = over.data.current as DraggableData | undefined;

    // Only handle logic if dragging a TASK.
    // We don't need complex onDragOver logic for columns (visuals handled by DnD kit)
    if (activeData?.type !== "Task") return;

    const activeColumnId = columns?.find(({ id }) => id === activeId);

    if (!activeColumnId) return;

    let overColumnId = activeColumnId;

    if (overData?.type === "Column" && overData.columnId) {
      overColumnId = overData.columnId;
    } else if (overData?.type === "Task") {
      overColumnId =
        Object.keys(tasks).find((key) =>
          tasks[key].some((t) => t.id === overId)
        ) ?? "";
    }

    if (!overColumnId || activeColumnId === overColumnId) return;

    setTasks((prev) => {
      const activeItems = [...prev[activeColumnId]];
      const overItems = [...prev[overColumnId]];

      const activeIndex = activeItems.findIndex((t) => t.id === activeId);
      const [removedItem] = activeItems.splice(activeIndex, 1);

      if (overData?.type === "Column") {
        overItems.push(removedItem);
      } else {
        const overIndex = overItems.findIndex((t) => t.id === overId);
        overItems.splice(overIndex, 0, removedItem);
      }

      return {
        ...prev,
        [activeColumnId]: activeItems,
        [overColumnId]: overItems,
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeData = active.data.current as DraggableData | undefined;
    const overData = over.data.current as DraggableData | undefined;

    // --- SCENARIO 1: Reordering COLUMNS ---
    if (activeData?.type === "Column" && overData?.type === "Column") {
      const oldIndex = columns.findIndex((c) => c.id === activeId);
      const newIndex = columns.findIndex((c) => c.id === overId);

      if (oldIndex !== newIndex) {
        setColumns((cols) => arrayMove(cols, oldIndex, newIndex));
      }
      return;
    }

    // --- SCENARIO 2: Reordering TASKS ---
    if (activeData?.type === "Task") {
      const activeColumnId = Object.keys(tasks).find((key) =>
        tasks[key].some((t) => t.id === activeId)
      );
      const overColumnId = Object.keys(tasks).find((key) =>
        tasks[key].some((t) => t.id === overId)
      );

      // If dropping in the same column
      if (activeColumnId && overColumnId && activeColumnId === overColumnId) {
        const oldItems = tasks[activeColumnId];
        const oldIndex = oldItems.findIndex((t) => t.id === activeId);
        const newIndex = oldItems.findIndex((t) => t.id === overId);

        if (oldIndex !== newIndex) {
          setTasks((prev) => ({
            ...prev,
            [activeColumnId]: arrayMove(oldItems, oldIndex, newIndex),
          }));
        }
      }
      // Cross-column moves are handled in handleDragOver to be smooth,
      // but technically finalized here if needed.
      // (In this implementation, handleDragOver updates state directly).
    }
  };

  return (
    <div className="kanban-container">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* 1. Outer SortableContext for COLUMNS */}
        <SortableContext
          items={columns.map((c) => c.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="board">
            {columns.map((col) => (
              // 2. Render Column (which contains Inner SortableContext for Tasks)
              <SortableColumn key={col.id} column={col} tasks={tasks[col.id]} />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeTask ? (
            <div className="task-card dragging">
              <span className={`tag ${activeTask.tag}`}>{activeTask.tag}</span>
              <p>{activeTask.content}</p>
            </div>
          ) : activeColumn ? (
            <div className="column dragging">
              <div className="column-header">
                <h3>{activeColumn.title}</h3>
              </div>
              <div className="task-list" style={{ opacity: 0.5 }} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <style>{`
        .kanban-container { padding: 20px; font-family: sans-serif; background-color: #f4f5f7; height: 100vh; overflow: hidden; }
        .board { display: flex; gap: 20px; height: 100%; align-items: flex-start; }
        .column { background: #ebecf0; width: 300px; min-width: 300px; border-radius: 8px; padding: 10px; display: flex; flex-direction: column; flex-shrink: 0; }
        
        .column-header { 
            display: flex; justify-content: space-between; margin-bottom: 10px; padding: 0 5px; 
            color: #5e6c84; font-weight: 600; cursor: grab; 
        }
        .column-header:active { cursor: grabbing; }
        
        .count { background: rgba(9, 30, 66, 0.08); border-radius: 12px; padding: 2px 8px; font-size: 12px; }
        .task-list { display: flex; flex-direction: column; gap: 8px; min-height: 100px; }
        
        .task-card { background: white; padding: 12px; border-radius: 4px; box-shadow: 0 1px 2px rgba(9, 30, 66, 0.25); user-select: none; }
        .task-card:hover { background-color: #fafbfc; }
        .task-card.dragging { opacity: 1; box-shadow: 0 10px 20px rgba(9, 30, 66, 0.25); cursor: grabbing; }
        
        .tag { font-size: 10px; text-transform: uppercase; padding: 2px 6px; border-radius: 3px; font-weight: 700; display: inline-block; margin-bottom: 5px; }
        .Design { background: #eae6ff; color: #403294; }
        .Dev { background: #deebff; color: #0747a6; }
        .Product { background: #e3fcef; color: #006644; }
      `}</style>
    </div>
  );
}
