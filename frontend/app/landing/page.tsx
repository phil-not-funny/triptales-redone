import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="flex h-full w-full items-center justify-center z-20">
      <Card className="basis-1/2 p-4 py-8">
        <CardHeader>
          <CardTitle className="text-2xl font-title-inter uppercase">Welcome back</CardTitle>
          <CardDescription>Choose whether to log in or register</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}
