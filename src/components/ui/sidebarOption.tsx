import { NavLink } from "react-router-dom";

interface SidebarButtonProps {
  to?: string;
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const SidebarOption= ({ to, children, label, onClick }:SidebarButtonProps) => {

  if (to) {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `sidebarbutton ${isActive ? 'h-8 border border-gray-4  hover:bg-black-4 active:bg-black-1 font-normal bg-black-2 rounded-3xl' : ''}`
        }
      >
        <span className="h-6 w-6">{children}</span>
        <span className="text-sm  text-dark-gray">{label}</span>
      </NavLink>
    );
  }
  return (
    <div
      onClick={onClick}
      className={`sidebarbutton cursor-pointer`}>
      <span className="h-6 w-6">{children}</span>
      <span className="text-sm text-dark-gray ">{label}</span>
    </div>
  );
};

export default SidebarOption;
