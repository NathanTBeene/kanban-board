import { useContext, useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoGrabber } from "react-icons/go";
import { BoardContext } from "../Board";
import type { Id } from "../../lib/data/types";
import OptionsModal from "../OptionsModal";

const OPTIONS = [
  "Delete Column",
  "Mark all as Complete",
  "Mark all as Incomplete",
];

const Header = ({
  id,
  title,
  length,
  sortable,
}: {
  id: Id;
  title: string;
  length: number;
  sortable: { attributes: any; listeners: any; isDragging: boolean };
}) => {
  const TEXT_LIMIT = 25;
  const [titleText, setTitleText] = useState(title);
  const [error, setError] = useState<boolean>(false);

  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("Header must be used within a BoardContext.Provider");
  }

  const { markAllStatus } = context;

  const { updateColumnTitle, removeColumn } = context;
  const [modalOpen, setModalOpen] = useState(false);

  const saveTitle = (newTitle: string) => {
    updateColumnTitle(id, newTitle);
  };

  useEffect(() => {
    if (titleText.length > TEXT_LIMIT) {
      setError(true);
    } else {
      setError(false);
    }
  }, [titleText]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleText(event.currentTarget.value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !error) {
      saveTitle(event.currentTarget.value);
      event.currentTarget.blur();
    }
  };

  const style = {
    cursor: sortable.isDragging ? "grabbing" : "grab",
  };

  const onClose = () => {
    setModalOpen(false);
  };

  const onOptionSelect = (option: string) => {
    setModalOpen(false);
    if (option === "Delete Column") {
      removeColumn(id);
    }

    if (option === "Mark all as Complete") {
      markAllStatus(id, true);
      return;
    }

    if (option === "Mark all as Incomplete") {
      markAllStatus(id, false);
      return;
    }
  };

  return (
    <div className="flex items-center justify-start p-2 gap-2 border-b-1 border-slate-700">
      <div className="pt-1 pb-1 rounded-full hover:bg-slate-600 transition-all duration-200 active:bg-slate-600">
        <GoGrabber
          {...sortable.attributes}
          {...sortable.listeners}
          className="text-xl text-slate-300 focus:outline-none"
          style={style}
        />
      </div>
      <input
        type="text"
        className={`font-bold text-lg rounded-md p-1
          border-1  focus:outline-none
          transition-all duration-200 
          ${error ? "border-red-500" : "border-transparent focus:border-b-indigo-400"}`}
        value={titleText}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <div className="text-md text-gray-300 ml-auto mr-1">{length}</div>
      <div className="relative hover:bg-slate-600 pt-1 pb-1 rounded-full transition-all duration-200 cursor-pointer">
        <BsThreeDotsVertical
          onClick={() => setModalOpen(!modalOpen)}
          className="text-md text-slate-300"
        />
        {modalOpen && (
          <OptionsModal
            options={OPTIONS}
            onClose={onClose}
            onOptionSelect={onOptionSelect}
          />
        )}
      </div>
    </div>
  );
};

export default Header;
