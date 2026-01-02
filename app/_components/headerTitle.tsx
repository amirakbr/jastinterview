"use client";
import TextInputTransformer from "../sharedComponent/textInputTransformer/textInputTransformer";
import style from './style.module.scss'
const HeaderTitle = () => {
  return (
    <TextInputTransformer
      initialValue="te"
      wrapper={({ children }) => (
        <h1 className={style.headerTitle}>{children}</h1>
      )}
      className={style.headerTitle}
    />
  );
};

export default HeaderTitle;
