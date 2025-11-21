import classNames from "classnames";
import { ReactNode } from "react";
import ReactDOM from "react-dom";

interface ModalContainerProps {
  visible?: boolean;
  auto_width?: boolean;
  children?: ReactNode;

  onClose?: () => void;

  // NUEVOS PROPS
  showCloseButton?: boolean;  // ← Muestra botón X
  closeBackdrop?: boolean;    // ← Controla cierre al hacer clic fuera

  className?: string;
  className2?: string;
}

const Modal = ({
  visible = false,
  auto_width = true,
  children,
  onClose,

  showCloseButton = false,     // ← default oculto
  closeBackdrop = true,        // ← default como antes: sí cierra

  className,
  className2,
}: ModalContainerProps) => {

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!closeBackdrop) return; // ← si está desactivado, no hace nada

    if (event.target === event.currentTarget && onClose) {
      onClose();
    }
  };

  const handleModalClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
  };

  if (!visible) return null;

  return ReactDOM.createPortal(
    <div
      className={classNames(
        "fixed inset-0 z-50 flex items-center justify-center overflow-auto",
        "bg-transparent-black"
      )}
      onClick={handleBackdropClick}
    >
      <div
        className={classNames(
          `py-1 relative bg-white shadow-md flex flex-col m-auto max-h-[80%] overflow-hidden border border-dark2-gray rounded-3xl ${className}`,
          { "w-4/5 md:w-3/6 lg:w-3/7 min-h-[120px]": auto_width }
        )}
        onClick={handleModalClick}
      >

        {/* BOTÓN X (solo si showCloseButton=true) */}
        {showCloseButton && (
          <button
            className="close2 absolute top-2 right-3 z-50"
            onClick={() => onClose?.()}
          >
            <span>X</span>
          </button>
        )}

        <div
          className={`overflow-y-auto flex grow p-4 scroll-t flex-col gap-4 ${className2}`}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
