import { useState } from "react";
import DialogLayout from "./common/DialogLayout";

type Props = {
  onSuccess: () => void;
  hasCompleted: boolean;
  loading: boolean;
};

export default function YesDialog({ onSuccess, hasCompleted, loading }: Props) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  return (
    <DialogLayout
      loading={loading}
      onSuccess={() => {
        if (hasCompleted) {
          onSuccess();
        } else if (input.toLowerCase() === "yes") {
          setInput("");
          onSuccess();
        } else {
          setError("* Please type Yes to continue.");
        }
      }}
      hasCompleted={hasCompleted}
      title={"Have you completed the lesson?"}
      error={error}
    >
      {!hasCompleted && (
        <input
          type="email"
          id="email"
          className="bg-white border border-gray-300 text-gray-900 text-sm font-noto rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          placeholder="Type Yes to continue"
          required
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (e.target.value != "") {
              setError("");
            }
          }}
        />
      )}
    </DialogLayout>
  );
}
