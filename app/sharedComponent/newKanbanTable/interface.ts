import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- Types ---

export interface Task {
  id: string;
  content: string;
  tag: "Design" | "Dev" | "Product" | "Marketing";
}

export interface Column {
  id: string;
  title: string;
  tasks:any[]
}

// This is the structure of the data we attach to every draggable/sortable item.
// This allows TypeScript to know if we are hovering over a Column or a Task.
export interface DraggableData {
  type: "Task" | "Column";
  task?: Task;
  columnId?: string;
}

export type TasksState = Record<string, Task[]>;
