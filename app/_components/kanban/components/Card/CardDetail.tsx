import { Card } from "@/app/_components/kanban/types";
import { X, Image } from "lucide-react";
import { useCard } from "./hooks/useCard";
import { useState } from "react";

type Props = {
  closeDetails: () => void;
  card: Card;
};

const defaultText = "Click or drag image here to upload";
const defaultTextDrag = "Drop image here";
export const CardDetail = (props: Props) => {
  const { title, srcImage, description, imageCovered } = props.card;
  const [loadFileText, setLoadFileText] = useState(defaultText);
  const { handleTitleChange, handleDescriptionChange } = useCard(props.card);

  const stopDefaults = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div
      id="card-container"
      className="fixed w-screen h-screen flex justify-center items-center inset-1/2 transform -translate-x-1/2 -translate-y-1/2 "
    >
      <div
        className="absolute w-screen h-screen flex justify-center items-center left-0 top-0 bg-[#00000080] cursor-pointer"
        onClick={() => {
          props.closeDetails();
        }}
      />
      <div className="w-fit min-w-[500px] z-[999] flex flex-col gap-y-4 p-4 bg-mainBackgroundColor border-2 border-columnBackgroundColor rounded-md">
        <X
          onClick={() => {
            props.closeDetails();
          }}
          className="text-customWhite cursor-pointer"
        />

        <label className="w-full flex items-center">
          <input
            value={title}
            id="input-name"
            onChange={(e) => handleTitleChange(e.target.value)}
            className="bg-transparent rounded-[4px] mr-2 px-2 pt-2 flex-grow"
          />
        </label>
      </div>
    </div>
  );
};
