import { ReactNode } from 'react'
interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}


interface CardHeaderProps {
  children: ReactNode
  className?: string
}

const CardHeader = ({ children, className = '' }: CardHeaderProps) => {
  return (
    <div
      className={`${className} flex flex-col md:flex-row md:gap-4  pb-1 w-full md:justify-between justify-center items-center  border-gray-2 border-b-2 `}
    >
      {children}
    </div>
  )
}

const CardBody = ({ children, className = "" }:CardBodyProps) => {
  return (
    <div className={`flex flex-col flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden   scroll-t ${className}`}>
      {children}
    </div>
  );
};

const Card= ({ children, className = "" }:CardProps) => {
  return (
    <div className={`flex flex-col flex-1 min-h-0 w-full px-2 py-1 gap-4 overflow-y-hidden   ${className}`}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardBody };
