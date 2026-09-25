"use client";

import { Newspaper, Search, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SearchService from "@/lib/services/searchService";
import { SearchResponse } from "@/types/RequestTypes";
import { Input } from "@/components/ui/input";
import Post from "@/components/low/Post";
import Sorry from "@/components/low/Sorry";
import UserSearchCard from "@/components/low/UserSearchCard";
import Loading from "@/components/top/Loading";
import SearchResultSection from "./SearchResultSection";

const DEBOUNCE_MS = 300;

/**
 * Search field plus the matching users and posts. The term is mirrored into
 * the `q` URL parameter so a search can be shared and survives a reload.
 */
const SearchPage: React.FC = () => {
  const t = useTranslations("Search");
  const tToast = useTranslations("Toasts");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [term, setTerm] = useState(searchParams.get("q") ?? "");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = term.trim();
    if (!trimmed) {
      router.replace(pathname);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      router.replace(`${pathname}?q=${encodeURIComponent(trimmed)}`);
      const response = await SearchService.search(trimmed, controller.signal);
      if (controller.signal.aborted) return;
      if (response) setResults(response);
      else toast.error(tToast("searchError"));
      setLoading(false);
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term]);

  const active = term.trim() !== "";
  const noMatches =
    active && results !== null && !results.users.length && !results.posts.length;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-4 py-10">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          autoFocus
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={t("placeholder")}
          aria-label={t("placeholder")}
          className="h-12 rounded-xl border-gray-100 bg-white pl-11 text-base shadow-sm"
        />
      </div>

      {loading ? (
        <Loading />
      ) : noMatches ? (
        <Sorry includeTryAgain={false}>{t("noResults", { term })}</Sorry>
      ) : active && results ? (
        <>
          {results.users.length > 0 && (
            <SearchResultSection
              title={t("users")}
              count={results.users.length}
              icon={Users}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {results.users.map((u) => (
                  <UserSearchCard key={u.guid} user={u} />
                ))}
              </div>
            </SearchResultSection>
          )}
          {results.posts.length > 0 && (
            <SearchResultSection
              title={t("posts")}
              count={results.posts.length}
              icon={Newspaper}
            >
              {results.posts.map((p) => (
                <Post key={p.guid} post={p} embed />
              ))}
            </SearchResultSection>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">{t("hint")}</p>
      )}
    </div>
  );
};

export default SearchPage;
