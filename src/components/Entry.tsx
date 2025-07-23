import { BsThreeDotsVertical } from "react-icons/bs";
import { GoGrabber } from "react-icons/go";
import type { EntryData, Id } from "../lib/data/types";
import { useContext, useRef, useState } from "react";
import { BoardContext } from "./Board";
import OptionsModal from "./OptionsModal";
import { useSortable } from "@dnd-kit/sortable";

const Entry = ({ columnId, entry }: { columnId: Id; entry: EntryData }) => {
  const ENTRY_OPTIONS = [
    "Delete",
    entry.status ? "Mark as Uncomplete" : "Mark as Complete",
  ];
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

  if (!context) {
    throw new Error("Entry must be used within a BoardContext.Provider");
  }

  const { removeEntry, editEntry, updateEntryStatus } = context;

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

    if (option === "Mark as Complete") {
      updateEntryStatus(columnId, entry.id, true);
      return;
    }

    if (option === "Mark as Uncomplete") {
      updateEntryStatus(columnId, entry.id, false);
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

  const customStyle = `
    p-3 rounded-md shadow-sm  border-1
    ${entry.status ? "bg-gradient-to-br from-emerald-500 to-emerald-300 text-slate-800" : "bg-slate-700"}
    ${entry.status ? "border-emerald-500" : (isEditing ? "border-indigo-400" : "border-slate-600")}
    ${isDragging ? "opacity-0" : "opacity-100"}
    transition-all duration-300
  `;

  const dragStyle = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition: transition,
  };

  return (
    <div className="relative w-full h-full">
      <div className={customStyle} ref={setNodeRef} style={dragStyle}>
        <div className="absolute top-2 right-2 cursor-pointer pt-1 pb-1 rounded-full hover:bg-slate-600 transition-all duration-200">
          <BsThreeDotsVertical onClick={() => setModalOpen(!modalOpen)} />
        </div>
        <div
          className={`absolute text-lg top-4 left-1 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
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
          onFocus={() => entry.status && setIsEditing(true)}
          onBlur={onBlur}
          onKeyDown={onKeyboardDown}
          {...(entry.status ? { readOnly: true } : {})}
        />
      </div>
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
