"use client";

import { KanbanBoard } from "./components/KanbanBoard";
import { KanbanProvider } from "./components/store/KanbanProvider";

export default function Home() {
  const initialData = [
    {
      id: "column-1",
      columnTitle: "test",
      cards: [{ title: "task-card1", id: "task-1" }],
    },
    {
      id: "column-2",
      columnTitle: "test",
      cards: [
        { title: "task-card2", id: "task-2" },
        { title: "task-card3", id: "task-3" },
        { title: "task-card4", id: "task-4" },
        { title: "task-card", id: "task-5" },
      ],
    },
  ];

  return (
    <KanbanProvider>
      <KanbanBoard />
    </KanbanProvider>
  );
}
