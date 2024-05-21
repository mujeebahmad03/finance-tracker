"use client";

import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { ThemeSwitcherButton } from "./ThemeSwitcherButton";
import { Button, buttonVariants } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Logo } from "./Logo";
import { useTheme } from "next-themes";

export const Navbar = () => {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <DesktopNavbar theme={resolvedTheme} />
      <MobileNavbar theme={resolvedTheme} />
    </>
  );
};

const items = [
  { label: "Dashboard", link: "/" },
  { label: "Transactions", link: "/transactions" },
  { label: "Manage", link: "/manage" },
];

const MobileNavbar = ({ theme }: { theme: string | undefined }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between sm:px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[300px] sm:w-[540px]" side="left">
            <div className="pt-4">
              <Logo loading={false} mobile={false} />
              <div className="flex flex-col gap-1 pt-4">
                {items.map((item) => (
                  <NavItem
                    link={item.link}
                    key={item.label}
                    label={item.label}
                    clickCallBack={() => setIsOpen((prev) => !prev)}
                  />
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo loading={false} mobile={true} />
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcherButton />
          <UserButton
            afterSignOutUrl="/sign-in"
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
            }}
          />
        </div>
      </nav>
    </div>
  );
};

const DesktopNavbar = ({ theme }: { theme: string | undefined }) => {
  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className="flex container items-center justify-between px-8">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo loading={false} mobile={false} />
          <div className="flex h-full">
            {items.map((item) => (
              <NavItem link={item.link} key={item.label} label={item.label} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherButton />
          <UserButton
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
            }}
            afterSignOutUrl="/sign-in"
          />
        </div>
      </nav>
    </div>
  );
};

const NavItem = ({
  link,
  label,
  clickCallBack,
}: {
  link: string;
  label: string;
  clickCallBack?: () => void;
}) => {
  const pathname = usePathname();

  const isActive = pathname === link;

  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
          isActive && "text-foreground"
        )}
        onClick={() => clickCallBack?.()}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] left-1/2 hidden w-[80%] h-[2px] bg-foreground -translate-x-1/2 rounded-xl md:block" />
      )}
    </div>
  );
};
