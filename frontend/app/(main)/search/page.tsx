import PageHead from "@/components/top/PageHead";
import SearchPage from "@/components/pages/SearchPage/SearchPage";
import Loading from "@/components/top/Loading";
import { Suspense } from "react";

export default function Search() {
  return (
    <PageHead>
      <Suspense fallback={<Loading />}>
        <SearchPage />
      </Suspense>
    </PageHead>
  );
}
