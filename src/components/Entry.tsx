import { BsThreeDotsVertical } from "react-icons/bs";
import { GoGrabber } from "react-icons/go";
import type { EntryData, Id } from "../lib/data/types";
import { useContext, useRef, useState } from "react";
import { BoardContext } from "./Board";
import OptionsModal from "./OptionsModal";
import { useSortable } from "@dnd-kit/sortable";

const ENTRY_OPTIONS = ["Delete"];

const Entry = ({ columnId, entry }: { columnId: Id; entry: EntryData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [entryText, setEntryText] = useState(entry.description);
  const context = useContext(BoardContext);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const shouldSaveOnBlur = useRef(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: entry.id,
  });

  const style = {
    opacity: isDragging ? 0 : 1,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition: transition,
  };

  if (!context) {
    throw new Error("Entry must be used within a BoardContext.Provider");
  }

  const { removeEntry, editEntry } = context;

  const saveEntry = (newDescription: string) => {
    editEntry(columnId, entry.id, newDescription);
  };

  const onClose = () => {
    setModalOpen(false);
  };

  const onOptionSelect = (option: string) => {
    setModalOpen(false);

    if (option === "Delete") {
      removeEntry(columnId, entry.id);
      return;
    }
  };

  const onKeyboardDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveEntry(entryText);

      shouldSaveOnBlur.current = true; // Set the flag to save on blur
      textAreaRef.current?.blur(); // Trigger blur to save
    }
  };

  // Triggered when the textarea loses focus
  const onBlur = () => {
    setIsEditing(false);

    if (shouldSaveOnBlur.current) {
      shouldSaveOnBlur.current = false; // Reset the flag
      return;
    }

    setEntryText(entry.description); // Reset to original text
  };

  return (
    <div
      className={`bg-slate-700 p-3 rounded-md shadow-sm relative border-1 ${
        isEditing ? "border-indigo-400" : "border-slate-600"
      } transition-all duration-200`}
      ref={setNodeRef}
      style={style}
    >
      <div className="absolute top-2 right-2 cursor-pointer pt-1 pb-1 rounded-full hover:bg-slate-600 transition-all duration-200">
        <BsThreeDotsVertical
          onClick={() => setModalOpen(!modalOpen)}
        />
      </div>
      <div className={`absolute text-lg top-3 left-1 ${isDragging ? "cursor-grabbing" : "cursor-grab"} pt-1 pb-1 rounded-full hover:bg-slate-600 transition-all duration-200`}>
        <GoGrabber
          {...attributes}
          {...listeners}
          className={`focus:outline-none`}
        />
      </div>
      <textarea
        ref={textAreaRef}
        className="pl-4 w-[94%] focus:outline-none resize-none field-sizing-content"
        value={entryText}
        onChange={(e) => setEntryText(e.target.value)}
        onFocus={() => setIsEditing(true)}
        onBlur={onBlur}
        onKeyDown={onKeyboardDown}
      />
      {modalOpen && (
        <OptionsModal
          options={ENTRY_OPTIONS}
          onClose={onClose}
          onOptionSelect={onOptionSelect}
        />
      )}
    </div>
  );
};

export default Entry;
