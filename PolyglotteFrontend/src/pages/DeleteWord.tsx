import React from "react";
import MainLayout from "../layouts/MainLayout/MainLayout";
import { DeleteWordView } from "../features/deleteWord/components/DeleteWordView";
import { useDeleteWord } from "../features/deleteWord/hooks/useDeleteWord";

const DeleteWord: React.FC = () => {
  const deleteWordLogic = useDeleteWord();

  return (
    <MainLayout>
      <DeleteWordView {...deleteWordLogic} />
    </MainLayout>
  );
};

export default DeleteWord;
