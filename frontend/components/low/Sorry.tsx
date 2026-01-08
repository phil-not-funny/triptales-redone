import { PropsWithClassNameAndChildren } from "@/types/ComponentTypes";
import { useTranslations } from 'next-intl';

type SorryProps = {
  includeTryAgain?: boolean;
} & PropsWithClassNameAndChildren;

const Sorry: React.FC<SorryProps> = ({
  children,
  className,
  includeTryAgain = true,
}) => {

  const t = useTranslations("Sorry");

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
            {t("error")}
          </>
        )}
      </p>
    </div>
  );
};

export default Sorry;
