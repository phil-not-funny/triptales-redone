import { PropsWithClassNameAndChildren } from "@/types/ComponentTypes";

type SorryProps = {
  includeTryAgain?: boolean;
} & PropsWithClassNameAndChildren;

const Sorry: React.FC<SorryProps> = ({
  children,
  className,
  includeTryAgain = true,
}) => {
  return (
    <div
      className={`flex min-h-[200px] flex-col items-center justify-center p-4 text-gray-800 ${className}`}
    >
      <pre className="mb-4 text-4xl">:(</pre>
      <p className="text-center">
        {children}
        {includeTryAgain && (
          <>
            <br />
            Please try again later or contact support if the problem persists.
          </>
        )}
      </p>
    </div>
  );
};

export default Sorry;
