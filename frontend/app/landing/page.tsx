import { MotionDiv } from "@/components/Motion";
import { AnimatedButton, Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Landing() {
  return (
    <div className="z-20 flex h-full w-full items-center justify-center">
      <Card className="flex items-center justify-center bg-neutral-100 p-4 py-8 md:basis-1/2">
        <CardHeader className="w-full">
          <CardTitle className="font-title !text-primary-saturated border-primary-light border-b text-center text-3xl uppercase">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Choose whether to log in or register
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center gap-3">
          <Link href={"/landing/login"}>
            <AnimatedButton variant={"default"}>Log In</AnimatedButton>
          </Link>
          <Link href={"/landing/signup"}>
            <AnimatedButton variant={"outline"}>Sign Up</AnimatedButton>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
