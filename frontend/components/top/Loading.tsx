import { Loader2 } from "lucide-react";

const Loading: React.FC = () => (
  <div className="flex min-h-screen w-full items-center justify-center">
    <div className="basis-[calc(1/20*100%)]">
      <Loader2 className="h-full w-full animate-spin" />
    </div>
  </div>
);

export default Loading;
