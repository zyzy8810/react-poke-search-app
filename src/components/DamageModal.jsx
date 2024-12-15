import React, { useRef } from "react";
import useOnClickOutside from "../hooks/useOnClickOutside";
import DamageRelations from "./DamageRelations";

const DamageModal = ({ setIsModalOpen, damages }) => {
  const ref = useRef();
  useOnClickOutside(ref, () => setIsModalOpen(false));

  console.log(ref.current);

  return (
    <div className="flex items-center justify-center w-full h-full z-40 fixed left-0 bottom-0 bg-gray-800">
      <div ref={ref} className="modal bg-white rounded-lg w-[90%]">
        <div className="flex flex-col items-start relative p-4">
          <div className="flex items-center w-full justify-between pb-2">
            <div className="text-gray-900 font-bold text-lg text-center">
              Damage Relations
            </div>
          </div>
          <button
            className="absolute right-5"
            onClick={() => setIsModalOpen(false)}
          >
            <span className="padding-[10px] material-icons text-gray-900 font-bold text-lg cursor-pointer">
              close
            </span>
          </button>
          <DamageRelations damages={damages} />
        </div>
      </div>
    </div>
  );
};

export default DamageModal;
