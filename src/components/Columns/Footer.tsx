import { useContext, useState } from "react";
import { BoardContext } from "../Board";
import type { Id } from "../../lib/data/types";

const Footer = ({ columnId }: { columnId: Id }) => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("Footer must be used within a BoardContext.Provider");
  }

  const { buildEntry, addEntry } = context;
  const [isInput, setIsInput] = useState(false);

  const onClick = () => {
    setIsInput(true);

    // Grab the textarea after it has been rendered
    // This is a workaround to ensure the textarea is focused immediately
    setTimeout(() => {
      const textarea = document.querySelector(
        "#add-entry-input"
      ) as HTMLTextAreaElement | null;
      if (textarea) {
        textarea.focus();
      }
    }, 0);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value) {
        addEntry(columnId, buildEntry(value));
        setIsInput(false);
      }
    }

    if (e.key === "Escape" || e.key === "Tab") {
      setIsInput(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-2 border-t-1 border-slate-700">
      {isInput ? (
        <textarea
          id="add-entry-input"
          className="w-full bg-slate-700 p-2 rounded-md focus:outline-none resize-none field-sizing-content"
          placeholder="Add new item..."
          onBlur={() => setIsInput(false)}
          onKeyDown={onKeyDown}
        />
      ) : (
        <button
          className="text-md text-slate-300 shadow-md w-[100%] border-1 border-slate-700 rounded-sm pt-1 pb-1
          hover:cursor-pointer
          hover:bg-indigo-400
          hover:saturate-80
          hover:text-slate-900
          hover:border-slate-900
          transition-all duration-200 ease-in-out
        "
          onClick={onClick}
        >
          + Add a card
        </button>
      )}
    </div>
  );
};

export default Footer;
