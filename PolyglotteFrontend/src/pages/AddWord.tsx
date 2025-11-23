import React from "react";
import MainLayout from "../layouts/MainLayout/MainLayout";
import { AddWordView } from "../features/addWord/components/AddWordView";
import { useAddWord } from "../features/addWord/hooks/useAddWord";

const AddWord: React.FC = () => {
  const addWordLogic = useAddWord();

  return (
    <MainLayout>
      <AddWordView {...addWordLogic} />
    </MainLayout>
  );
};

export default AddWord;
