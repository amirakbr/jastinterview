"use client";

import { useSortable } from "@dnd-kit/sortable";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, MoreVertical } from "lucide-react";
import SortableTask from "./task";

interface ColumnProps {
  column: any;
  onAddTask: (columnId: string) => void;
}

export default function Column({ column, onAddTask }: ColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // const taskIds = column.tasks.map((task: any) => task.id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        w-80
        bg-white 
        rounded-xl
        shadow-lg
        border-t-4
        flex flex-col
        cursor-grab
        active:cursor-grabbing
        transition-all duration-200
        hover:shadow-xl
        ${isDragging ? "opacity-50 rotate-3 shadow-2xl" : ""}
      `}
      // style={{ borderTopColor: column.color }}
      {...attributes}
      {...listeners}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-gray-400 hover:text-blue-500 transition-colors">
            <GripVertical size={20} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {column.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {column.tasks.length} task{column.tasks.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${column.color}20`,
              color: column.color,
            }}
          >
            Drag column
          </span>
          <button className="text-gray-400 hover:text-gray-600 p-1">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Column Content - Tasks */}
      <SortableContext items={["test"]} strategy={verticalListSortingStrategy}>
        <div className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-300px)]"></div>
      </SortableContext>

      {/* Column Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddTask(column.id);
          }}
          className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>
    </div>
  );
}
