import { IInputProps } from "./interface";
import styles from "./input.module.scss"

const Input = ({ ...props }: IInputProps) => {
  return <input {...props} className={`${styles.input} ${props?.className}`}/>;
};

export default Input;
