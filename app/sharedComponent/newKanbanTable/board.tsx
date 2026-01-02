import { useState, useMemo } from "react";
import { Column, DraggableData, Task } from "./interface";
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
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

export default function KanbanBoard() {
  // --- State ---
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "To Do",
      tasks: [
        { id: "t1", content: "Research competitors", tag: "Design" },
        { id: "t2", content: "Draft initial mockups", tag: "Design" },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      tasks: [{ id: "t3", content: "Set up React project", tag: "Dev" }],
    },
    {
      id: "done",
      title: "Done",
      tasks: [{ id: "t4", content: "Define requirements", tag: "Product" }],
    },
    {
      id: "archive",
      title: "Archive",
      tasks: [],
    },
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

  // --- Helper Functions ---

  // Find which column contains a specific task
  const findColumnByTaskId = (taskId: UniqueIdentifier) => {
    return columns.find((col) => col.tasks.some((t) => t.id === taskId));
  };

  // --- Drag Handlers ---

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeData = active.data.current as DraggableData | undefined;
    const overData = over.data.current as DraggableData | undefined;

    // 1. Only handle logic if dragging a TASK
    if (activeData?.type !== "Task") return;

    // 2. Find Source Column
    const sourceColumnIndex = columns.findIndex((col) =>
      col.tasks.some((t) => t.id === activeId)
    );

    if (sourceColumnIndex === -1) return;

    const sourceColumn = columns[sourceColumnIndex];

    // 3. Find Destination Column
    let targetColumnIndex = sourceColumnIndex;

    if (overData?.type === "Column") {
      targetColumnIndex = columns.findIndex((c) => c.id === overId);
    } else if (overData?.type === "Task") {
      targetColumnIndex = columns.findIndex((col) =>
        col.tasks.some((t) => t.id === overId)
      );
    }

    // 4. If dropping in same column, return (reordering handled in DragEnd)
    if (sourceColumnIndex === targetColumnIndex) return;

    // 5. Perform the Move
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns]; // Shallow copy of columns array

      // Clone tasks arrays to ensure immutability
      const newSourceTasks = [...newColumns[sourceColumnIndex].tasks];
      const newTargetTasks = [...newColumns[targetColumnIndex].tasks];

      // Find and remove task from source
      const activeIndex = newSourceTasks.findIndex((t) => t.id === activeId);
      const [movedTask] = newSourceTasks.splice(activeIndex, 1);

      // Add to target
      if (overData?.type === "Column") {
        newTargetTasks.push(movedTask);
      } else {
        // Determine index in target column if hovering over a specific task
        const overIndex = newTargetTasks.findIndex((t) => t.id === overId);
        newTargetTasks.splice(overIndex, 0, movedTask);
      }

      // Update the specific columns in the new array
      newColumns[sourceColumnIndex] = {
        ...newColumns[sourceColumnIndex],
        tasks: newSourceTasks,
      };
      newColumns[targetColumnIndex] = {
        ...newColumns[targetColumnIndex],
        tasks: newTargetTasks,
      };

      return newColumns;
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

    // --- SCENARIO 2: Reordering TASKS (within the same column) ---
    if (activeData?.type === "Task") {
      const activeColumnIndex = columns.findIndex((col) =>
        col.tasks.some((t) => t.id === activeId)
      );
      const overColumnIndex = columns.findIndex((col) =>
        col.tasks.some((t) => t.id === overId)
      );

      // If dropping in the same column
      if (
        activeColumnIndex !== -1 &&
        overColumnIndex !== -1 &&
        activeColumnIndex === overColumnIndex
      ) {
        const column = columns[activeColumnIndex];
        const oldIndex = column.tasks.findIndex((t) => t.id === activeId);
        const newIndex = column.tasks.findIndex((t) => t.id === overId);

        if (oldIndex !== newIndex) {
          setColumns((prevColumns) => {
            const newColumns = [...prevColumns];
            const newTasks = arrayMove(column.tasks, oldIndex, newIndex);

            // Update only the affected column
            newColumns[activeColumnIndex] = {
              ...newColumns[activeColumnIndex],
              tasks: newTasks,
            };

            return newColumns;
          });
        }
      }
    }
  };

  // --- Render Prep ---

  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);

  // Helper to find the active task for the Overlay (needs to search all columns)
  const activeTask = activeId
    ? columns
        .flatMap((col) => col.tasks) // Flatten all tasks into one array
        .find((task) => task.id === activeId)
    : null;

  const activeColumn = activeId
    ? columns.find((col) => col.id === activeId)
    : null;

  return (
    <div className="kanban-container">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToHorizontalAxis]}
      >
        <SortableContext
          items={columnIds}
          strategy={horizontalListSortingStrategy}
        >
          <div className="board">
            {columns.map((col) => (
              // Pass col.tasks directly to the component
              <SortableColumn
                key={col.id}
                column={col}
                onAddTask={() => {
                  console.log("asdas");
                }}
              />
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
        .column-header { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 0 5px; color: #5e6c84; font-weight: 600; cursor: grab; }
        .column-header:active { cursor: grabbing; }
        .count { background: rgba(9, 30, 66, 0.08); border-radius: 12px; padding: 2px 8px; font-size: 12px; }
        .task-list { display: flex; flex-direction: column; gap: 8px; min-height: 100px; }
        .task-card { background: white; padding: 12px; border-radius: 4px; box-shadow: 0 1px 2px rgba(9, 30, 66, 0.25); user-select: none; }
        .task-card.dragging { opacity: 1; box-shadow: 0 10px 20px rgba(9, 30, 66, 0.25); cursor: grabbing; }
        .tag { font-size: 10px; text-transform: uppercase; padding: 2px 6px; border-radius: 3px; font-weight: 700; display: inline-block; margin-bottom: 5px; }
        .Design { background: #eae6ff; color: #403294; }
        .Dev { background: #deebff; color: #0747a6; }
        .Product { background: #e3fcef; color: #006644; }
      `}</style>
    </div>
  );
}
