import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  className?: string;
}

export default async function PageHead({ children, className }: Props) {
  return (
    <div
      className={`w-full min-h-screen ${className}`}
    >
      {children}
    </div>
  );
};