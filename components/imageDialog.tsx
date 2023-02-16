import { useState } from "react";
import DialogLayout from "./common/DialogLayout";

type Props = {
  onSuccess: () => void;
  hasCompleted: boolean;
  loading: boolean;
};

function ImageDialog({ onSuccess, hasCompleted, loading }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  return (
    <>
      <DialogLayout
        loading={loading}
        hasCompleted={hasCompleted}
        title={"Have you completed the lesson? Please upload the screenshot."}
        error={error}
        onSuccess={() => {
          onSuccess();
        }}
      >
        {!hasCompleted && (
          <input
            className="p-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            id="file_input"
            type="file"
            onChange={(e) => {
              if (e.target.files) {
                setFile(e.target.files[0]);
              }
            }}
          />
        )}
      </DialogLayout>
    </>
  );
}

export default ImageDialog;
