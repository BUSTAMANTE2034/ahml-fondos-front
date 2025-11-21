import React, { ReactElement, ReactNode } from "react";
import { Tooltip } from "@mui/material";

type ToolTipWrapperProps = {
  title: string;
  children: ReactNode;
};

const ToolTipWrapper: React.FC<ToolTipWrapperProps> = ({ title, children }) => {
  if (!React.isValidElement(children)) {
    return null;
  }

  return (
    <Tooltip
      title={title}
      // arrow
      placement="right"
      slotProps={{
        tooltip: {
                    className: `!bg-black-0 !text-dark-gray !px-2 !py-1 !rounded-xl !shadow-md !text-[10px] md:!text-xs !border dark:!border-black-3 !border-dark-gray`,
        },
        // arrow: {
        //   className: "!text-gray-100",
        // },
      }}
    >
      {children}
    </Tooltip>
  );
};

export default ToolTipWrapper;
