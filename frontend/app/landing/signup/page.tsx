import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Signup() {
  return (
    <div className="z-20 flex h-full w-full items-center justify-center">
      <Card className="flex basis-1/2 items-center justify-center bg-neutral-100 p-4 py-8">
        <CardHeader className="w-full">
          <CardTitle className="font-title !text-primary-saturated border-primary-light border-b text-center text-3xl uppercase">
            Register a new account
          </CardTitle>
          <CardDescription className="text-center">
            Register a new TripTales account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex w-full justify-center gap-4">
          <Link href={"/landing"}>
            <Button variant={"outline"}>
              <ArrowLeftIcon /> Back
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
