import { isSearchResponse, SearchResponse } from "@/types/RequestTypes";
import api from "../api";
import { fetchValidated } from "./requestHelpers";

/**
 * Searches users and posts at once.
 *
 * @param query - The search term; blank terms return no results.
 * @param signal - Aborts the request when a newer search supersedes it.
 * @returns The matches, or `null` if the request failed.
 */
const search = (
  query: string,
  signal?: AbortSignal,
): Promise<SearchResponse | null> =>
  fetchValidated(
    () => api.get("/Search", { params: { query }, signal }),
    isSearchResponse,
  );

const SearchService = {
  search,
};

export default SearchService;
