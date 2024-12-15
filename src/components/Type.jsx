import React from "react";

const Type = ({ type, damageValue }) => {
  const bg = `bg-${type}`;

  return (
    <div
      className={`h-[1.5rem] px-3 rounded-2xl ${bg} font-bold text-zinc-800 text-[0.6rem] leading-[1.5rem] capitalize flex gap-1 justify-center items-center`}
    >
      <span>{type}</span>
      {damageValue && (
        <span className="bg-zinc-200/40 p-[0.125rem] rounded">
          {damageValue}
        </span>
      )}
    </div>
  );
};

export default Type;
