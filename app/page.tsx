"use client";

import { KanbanBoard } from "./_components/kanban/components/KanbanBoard";
import { KanbanProvider } from "./_components/kanban/components/store/KanbanProvider";

export default function Home() {
  const initialData = [
    {
      id: "column-1",
      title: "test",
      cards: [{ title: "task-card1", id: "task-1", columnId: "column-1" }],
    },
  ];
  const initalColumnData = [
    {
      id: "column-1",
      title: "Demo Column",
    },
  ];
  const initalCardData = [
    {
      columnId: "column-1",
      id: "task-1",
      title: "Demo Task",
      commentList: undefined,
    },
  ];
  return (
    <KanbanProvider
      title="Demo Board"
      initalData={{ column: initalColumnData, cards: initalCardData }}
    >
      <KanbanBoard />
    </KanbanProvider>
  );
}
