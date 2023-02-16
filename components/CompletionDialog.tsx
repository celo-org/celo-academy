import { useState } from "react";
import DialogLayout from "./common/DialogLayout";

type Props = {
  onSuccess: () => void;
  hasCompleted: boolean;
  loading: boolean;
};

export default function CompletionDialog({
  onSuccess,
  hasCompleted,
  loading,
}: Props) {
  const [error, setError] = useState("");

  return (
    <DialogLayout
      loading={loading}
      onSuccess={onSuccess}
      hasCompleted={hasCompleted}
      title={"Congratulations! You have completed the Pathway!"}
      error={error}
      btnTitle="Complete the Pathway"
    >
      <div></div>
    </DialogLayout>
  );
}
