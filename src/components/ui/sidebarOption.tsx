// import { NavLink } from "react-router-dom";

// interface SidebarButtonProps {
//   to?: string;
//   children: React.ReactNode;
//   label: string;
//   onClick?: () => void;
// }

// const SidebarOption= ({ to, children, label, onClick }:SidebarButtonProps) => {

//   if (to) {
//     return (
//       <NavLink
//         to={to}
//         className={({ isActive }) =>
//           `sidebarbutton ${isActive ? 'h-8 border border-gray-4  hover:bg-black-4 active:bg-black-1 font-normal bg-black-2 rounded-3xl' : ''}`
//         }
//       >
//         <span className="h-6 w-6">{children}</span>
//         <span className="text-sm  text-dark-gray">{label}</span>
//       </NavLink>
//     );
//   }
//   return (
//     <div
//       onClick={onClick}
//       className={`sidebarbutton cursor-pointer`}>
//       <span className="h-6 w-6">{children}</span>
//       <span className="text-sm text-dark-gray ">{label}</span>
//     </div>
//   );
// };

// export default SidebarOption;

import { NavLink } from 'react-router-dom'

interface SidebarButtonProps {
  to?: string
  children: React.ReactNode
  label: string
  onClick?: () => void
}

const baseClasses = `
  flex items-center gap-3
  px-4 py-2
  rounded-xl
  text-sm
  transition-all duration-200
`

const SidebarOption = ({
  to,
  children,
  label,
  onClick,
}: SidebarButtonProps) => {
  if (to) {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `
          ${baseClasses}
          ${
            isActive
              ? 'bg-black-2 border border-gray-4 text-white'
              : 'text-dark-gray hover:bg-black-4'
          }
        `
        }
      >
        <span className="h-5 w-5 flex items-center justify-center">
          {children}
        </span>
        <span>{label}</span>
      </NavLink>
    )
  }

  return (
    <div
      onClick={onClick}
      className={`
        ${baseClasses}
        cursor-pointer
        text-dark-gray
        hover:bg-black-4
      `}
    >
      <span className="h-5 w-5 flex items-center justify-center">
        {children}
      </span>
      <span>{label}</span>
    </div>
  )
}

export default SidebarOption
