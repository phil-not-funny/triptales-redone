import Sorry from "@/components/low/Sorry";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NotFound() {
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4">
      <Sorry includeTryAgain={false}>
        The page you are looking for does not exist.
      </Sorry>
      <Link href={"/"}>
        <Button>
          <ArrowLeft />
          To Homepage
        </Button>
      </Link>
    </div>
  );
}
