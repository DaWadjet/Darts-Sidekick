"use client";
import { Provider, createStore } from "jotai";
import { FC, PropsWithChildren, useState } from "react";

const JotaiStoreProvider: FC<PropsWithChildren> = ({ children }) => {
  const [store] = useState(() => createStore());
  return <Provider store={store}>{children}</Provider>;
};

export default JotaiStoreProvider;
