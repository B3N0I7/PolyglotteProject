import React from "react";
import MainLayout from "../layouts/MainLayout/MainLayout";
import { useMyWords } from "../features/displayWords/hooks/useMyWords";
import { MyWordsView } from "../features/displayWords/components/MyWordsView";

const MyWords: React.FC = () => {
  const myWordsLogic = useMyWords();

  return (
    <MainLayout>
      <MyWordsView {...myWordsLogic} />
    </MainLayout>
  );
};

export default MyWords;
