import { useState } from "react";
import DialogLayout from "./common/DialogLayout";

type Props = {
  onSuccess: () => void;
  question: string;
  options: string[];
  answer: string;
  hasCompleted: boolean;
  loading: boolean;
};

function QuizDialog({
  onSuccess,
  question,
  answer,
  options,
  hasCompleted,
  loading,
}: Props) {
  console.log("hasCompleted", hasCompleted);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [error, setError] = useState("");

  return (
    <DialogLayout
      onSuccess={() => {
        onSuccess();
      }}
      loading={loading}
      hasCompleted={hasCompleted}
      title={
        "Have you completed the lesson? Please complete the quiz to continue."
      }
      error={error}
    >
      <div className="font-noto text-black text-lg mb-4 mt-3">{question}</div>

      <div className="quiz">
        <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
          {options.map((option) => {
            return (
              <li
                key={option}
                className="w-full border-b border-gray-200 rounded-t-lg "
                style={{ listStyleType: "none !important" }}
              >
                <div className="flex items-center pl-3">
                  <input
                    id="list-radio-license"
                    type="radio"
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={() => {
                      setSelectedAnswer(option);
                    }}
                    name="list-radio"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <label
                    htmlFor="list-radio-license"
                    className="w-full py-3 ml-2 text-sm font-medium text-black"
                  >
                    {option}
                  </label>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </DialogLayout>
  );
}

export default QuizDialog;
