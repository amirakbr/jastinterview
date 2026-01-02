import { JSX, ReactNode } from "react";

export interface ITextToInputTransformerProps {
  initialValue: string;
  wrapper: ({ children }: { children: ReactNode }) => JSX.Element;
  className?: string;
}
