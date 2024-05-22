import { Logo } from "@/components/Logo";
import type { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center">
      <Logo loading={false} mobile={false} />
      <div className="mt-12">{children}</div>
    </div>
  );
};

export default layout;
