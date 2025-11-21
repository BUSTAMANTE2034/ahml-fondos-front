import React, {
  FC,
  ReactNode,
  MouseEvent,
  useRef,
  useEffect,
  ReactElement,
} from "react";
import { Tooltip } from "@mui/material";

type PlacementType =
  | "right"
  | "bottom-end"
  | "bottom-start"
  | "bottom"
  | "left-end"
  | "left-start"
  | "left"
  | "right-end"
  | "right-start"
  | "top-end"
  | "top-start"
  | "top"
  | undefined;

type IconButtonProps = {
  children: ReactNode;
  tooltip?: string;
  tooltipPoss?: PlacementType;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export const IconButton: FC<IconButtonProps> = ({
  children,
  tooltip,
  tooltipPoss,
  onClick,
  disabled,
  className,
  onMouseEnter,
  onMouseLeave,
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;

    const preventDrag = (e: DragEvent) => e.preventDefault();

    // botón
    el.setAttribute("draggable", "false");
    el.addEventListener("dragstart", preventDrag as EventListener);

    // hijos img/svg
    const imgAndSvg = el.querySelectorAll("img, svg");
    imgAndSvg.forEach((node) => {
      const childEl = node as HTMLElement;
      childEl.setAttribute("draggable", "false");
      childEl.addEventListener("dragstart", preventDrag as EventListener);
    });

    return () => {
      el.removeEventListener("dragstart", preventDrag as EventListener);
      imgAndSvg.forEach((node) => {
        const childEl = node as HTMLElement;
        childEl.removeEventListener("dragstart", preventDrag as EventListener);
      });
    };
  }, []);

  const enhancedChildren = React.Children.map(children, (child) => {
    if (
      React.isValidElement(child) &&
      typeof child.type === "string" &&
      child.type === "img"
    ) {
      const imgChild = child as ReactElement<{ className?: string }>;
      return React.cloneElement(imgChild, {
        className: `icon-size ${imgChild.props.className || ""}`,
      });
    }
    return child;
  });

  const button = (
    <button
      ref={btnRef}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`p-1 overflow-hidden hover:bg-gray-0 active:bg-gray-1 rounded-xl cursor-pointer flex items-center ${
        className || ""
      }`}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      style={
        {
          WebkitUserDrag: "none",
          userSelect: "none",
          touchAction: "manipulation",
        } as React.CSSProperties
      }
    >
      {enhancedChildren}
    </button>
  );

  if (!tooltip) return button;

  return (
    <Tooltip
      title={tooltip}
      placement={tooltipPoss || "right"}
      slotProps={{
        tooltip: {
          className:
            "!bg-black-0 !text-white !px-2 !py-1 !rounded-xl !shadow-md !text-[10px] md:!text-xs !border !border-gray-2",
        },
      }}
    >
      <span>{button}</span>
    </Tooltip>
  );
};
