import React from "react";
import MainLayout from "../layouts/MainLayout/MainLayout";
import { UpdateWordView } from "../features/updateWord/components/UpdateWordView";
import { useUpdateWord } from "../features/updateWord/hooks/useUpdateWord";

const UpdateWord: React.FC = () => {
  const updateWordLogic = useUpdateWord();

  return (
    <MainLayout>
      <UpdateWordView {...updateWordLogic} />
    </MainLayout>
  );
};

export default UpdateWord;
