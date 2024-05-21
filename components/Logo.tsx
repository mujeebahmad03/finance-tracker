import { cn } from "@/lib/utils";
import { PiggyBank } from "lucide-react";
import Link from "next/link";

export const Logo = ({
  loading,
  mobile,
}: {
  loading: boolean;
  mobile: boolean;
}) => {
  return (
    <Link href="/" className="flex items-center gap-2">
      {!mobile && (
        <PiggyBank
          className={cn(
            "stroke lg:h-11 h-9 lg:w-11 w-9 stroke-amber-500 stroke-[1.5]",
            loading && "animate-pulse"
          )}
        />
      )}

      <p
        className={cn(
          "bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text lg:text-3xl text-xl font-bold leading-tight tracking-tighter text-transparent",
          loading && "animate-pulse"
        )}
      >
        Finance Tracker
      </p>
    </Link>
  );
};

export const MobileLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-0">
      <p className=" bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-xl font-bold leading-tight tracking-tighter text-transparent">
        Finance Tracker
      </p>
    </Link>
  );
};
