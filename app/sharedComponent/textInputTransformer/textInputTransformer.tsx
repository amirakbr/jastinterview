import { Ref, useRef, useState } from "react";
import { ITextToInputTransformerProps } from "./interface";
import style from "./styles.module.scss"
const TextInputTransformer = ({
  initialValue,
  wrapper,
  className
}: ITextToInputTransformerProps) => {
  const [value, setValue] = useState(initialValue);
  const [isInputMode, setIsInputMode] = useState(false);
  const inputRef = useRef<HTMLInputElement | any>(undefined);
  return (
    <>
      <div
        onClick={() => {
          setIsInputMode(true);
          setTimeout(() => {
            inputRef?.current?.focus?.();
          }, 100);
        }}
        className={!isInputMode ? style.wrapper : ''}
      >
        {isInputMode ? (
          <input
            value={value}
            onChange={({ currentTarget }) => {
              setValue(currentTarget?.value);
            }}
            ref={inputRef}
            onBlur={() => {
              setIsInputMode(false);
            }}
            onKeyUp={({ key }) => {
              if (key === "Enter" || key === "esc") {
                setIsInputMode(false);
              }
            }}
            className={`${style.input} ${className}`}
          />
        ) : (
          wrapper({ children: value })
        )}
      </div>
    </>
  );
};

export default TextInputTransformer;
