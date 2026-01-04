export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Card = {
  id: Id;
  title: string;
  columnId: Id;
  commentList?:{id:Id,comment:string}[]
};

export type ActiveCard = Card & { columnId: Id };

export interface IKanbanProps {
  boardTitle: string;
}