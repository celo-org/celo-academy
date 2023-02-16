import React from "react";
import Loading from "./Loading";

type Props = {
  hasCompleted: boolean;
  title: string;
  btnTitle?: string;
  children: React.ReactNode;
  onSuccess: () => void;
  loading: boolean;
  error: string;
};

function DialogLayout({
  hasCompleted,
  title,
  children,
  onSuccess,
  loading,
  error,
  btnTitle,
}: Props) {
  return (
    <>
      {hasCompleted ? (
        <div className="h-16 mt-8">
          <button
            onClick={() => {
              onSuccess();
            }}
            className="button-full w-full"
          >
            Next Lesson
          </button>
        </div>
      ) : (
        <div className="my-6 px-5 py-5 border-2 border-black rounded-2xl">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-black font-noto"
          >
            {title}
          </label>
          {children}
          <div className="h-16 mt-8">
            {loading ? (
              <Loading />
            ) : (
              <button onClick={onSuccess} className="button-full w-full">
                {btnTitle ? btnTitle : "Next Lesson"}
              </button>
            )}
          </div>
          {error && (
            <div className="font-noto text-red-500 text-sm mt-3">{error}</div>
          )}
        </div>
      )}
    </>
  );
}

export default DialogLayout;
