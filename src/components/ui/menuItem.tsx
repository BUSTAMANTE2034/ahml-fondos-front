import React, { ReactNode } from "react";

interface MyMenuItemProps {
  icon: ReactNode;
  text: string;
  onClick: () => void;
  className?: string;
}

const MyMenuItem: React.FC<MyMenuItemProps> = ({
  icon,
  text,
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 px-2 py-1 cursor-pointer hover:bg-gray-1 active:bg-gray-2  rounded-3xl text-xs md:text-sm ${
        className || ""
      }`}
    >
      <div className="flex flex-row items-center justify-center gap-1">
        <span className="w-5 h-5 flex items-center">{icon}</span>
        <span className="text-xs">{text}</span>
      </div>
    </div>
  );
};

export default MyMenuItem;
