import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import { FC } from "react";

const NotFoundPage: FC = () => {
  return (
    <div className="h-[100svh] w-full flex items-center justify-center gap-2">
      <h1 className="text-3xl">404</h1>
      <p className="text-lg">Page not found</p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
