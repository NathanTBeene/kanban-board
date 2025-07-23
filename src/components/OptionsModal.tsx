import { useEffect } from "react";

interface OptionsModalProps {
  options: string[];
  onClose: () => void;
  onOptionSelect: (option: string) => void;
}

const OptionsModal = ({ options, onClose, onOptionSelect }: OptionsModalProps) => {

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#options-modal')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <>
      <div id="options-modal" className="absolute top-0 left-full translate-x-[5px] h-fit bg-slate-700 border-1 border-slate-600 shadow-md rounded-md z-50 flex flex-col items-start">
        {options.map((option, index) => (
          <button
            key={option}
            className={`whitespace-nowrap w-full text-left p-1 pl-2 pr-2 border-1 border-transparent hover:bg-slate-600 cursor-pointer ${index < options.length - 1 ? 'border-b-slate-600' : ''}`}
            onClick={() => onOptionSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </>
  )
}

export default OptionsModal