import { PropsWithChildren } from "react";

type SearchResultSectionProps = PropsWithChildren<{
  title: string;
  count: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}>;

/**
 * Titled block that keeps one kind of search result visually apart from the others.
 */
const SearchResultSection: React.FC<SearchResultSectionProps> = ({
  title,
  count,
  icon: Icon,
  children,
}) => (
  <section className="w-full">
    <h2 className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3 text-xl font-semibold text-gray-800">
      <Icon className="h-5 w-5 text-gray-500" />
      {title}
      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-sm font-medium text-gray-600">
        {count}
      </span>
    </h2>
    {children}
  </section>
);

export default SearchResultSection;
