"use client";

import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Card, Column, Id } from "@/app/_components/kanban/types";

interface State {
  columns: Column[];
  cards: Card[];
  setColumns: Dispatch<SetStateAction<Column[]>>;
  setCards: Dispatch<SetStateAction<Card[]>>;
  addColumn: (column: Column) => void;
  editColumnTitle: (title: string, id: Id) => void;
  addCard: (card: Card) => void;
  deleteCard: (cardId: Id) => void;
  editCardTitle: (newTitle: string, cardId: Id) => void;
  boardTitle: string;
  setBoardTitle: (value: string) => void;
}

const getStorage = () => {
  const storage = localStorage?.getItem?.("kanban");
  if (storage) {
    const { columns, cards } = JSON.parse(storage);
    return { columns, cards };
  }
  return { columns: undefined, cards: undefined };
};

export const KanbanContext = React.createContext<State>({
  columns: [],
  cards: [],
  setColumns: () => {},
  setCards: () => {},
  addColumn: () => {},
  editColumnTitle: () => {},
  addCard: () => {},
  deleteCard: () => {},
  editCardTitle: () => {},
  boardTitle: "",
  setBoardTitle: () => {},
});

export const KanbanProvider = ({
  children,
  title,
  initalData,
}: {
  children: ReactNode;
  title: string;
  initalData: { cards: Card[]; column: Column[] };
}) => {
  const [columns, setColumns] = useState<Column[]>(
    getStorage()?.columns || initalData.column
  );
  const [cards, setCards] = useState<Card[]>(
    getStorage()?.cards || initalData.cards
  );
  const [boardTitle, setBoardTitle] = useState(title ?? "");

  const addColumn = (column: Column) => setColumns((prev) => [...prev, column]);
  const editColumnTitle = (title: string, id: Id) =>
    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, title } : col))
    );
  const addCard = (card: Card) => setCards((prev) => [card, ...prev]);
  const deleteCard = (cardId: Id) =>
    setCards((prev) => prev.filter((card) => card.id !== cardId));
  const editCardTitle = (newTitle: string, cardId: Id) =>
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, title: newTitle } : card
      )
    );

  useEffect(() => {
    const storage = {
      columns,
      cards,
    };
    localStorage.setItem("kanban", JSON.stringify(storage));
  }, [columns, cards]);

  return (
    <KanbanContext.Provider
      value={{
        columns,
        cards,
        setColumns,
        setCards,
        addColumn,
        editColumnTitle,
        addCard,
        deleteCard,
        editCardTitle,
        boardTitle,
        setBoardTitle,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};
