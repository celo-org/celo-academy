import { useState } from "react";
import DialogLayout from "./common/DialogLayout";

type Props = {
  onSuccess: () => void;
  hasCompleted: boolean;
  loading: boolean;
};

export default function AddressDialog({
  onSuccess,
  hasCompleted,
  loading,
}: Props) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  return (
    <DialogLayout
      loading={loading}
      hasCompleted={hasCompleted}
      title={
        "Have you completed the lesson? Please add the address of the deployed contract"
      }
      error={error}
      onSuccess={() => {
        const re = new RegExp("^0x[a-fA-F0-9]{40}$");
        if (hasCompleted) {
          onSuccess();
        } else if (re.test(input)) {
          setInput("");
          onSuccess();
        } else {
          setError("* Please type the contract address to continue.");
        }
      }}
    >
      {!hasCompleted && (
        <input
          type="email"
          id="email"
          className="font-noto bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          placeholder="Enter address to continue"
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
