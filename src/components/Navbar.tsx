import NavLink from "./NavLink";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Fragment, useState } from "react";
import SideNav from "./SideNav";
import { SignedIn, UserButton, SignedOut } from "@clerk/tanstack-react-start";
import { MenuItem } from "~/lib/types";
import LoginButton from "./LoginButton";
import logo from "~/assets/ducc_hed.png";
import { Link } from "@tanstack/react-router";

export const navItems: MenuItem[] = [
  {
    href: "/",
    label: "Home",
    protected: false,
  },
  // {
  //   href: "/tools/bg-remover",
  //   label: "BG Remover",
  //   protected: false,
  //   group: "tools",
  // },
  {
    href: "/tools/bingo",
    label: "Bingo",
    protected: false,
    group: "tools",
  },
  {
    href: "/tools/copium",
    label: "Copium",
    protected: true,
    group: "tools",
  },
  {
    href: "/tests",
    label: "Tests",
    protected: true,
  },
];

export default function Navbar() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const visibleNavItems = navItems.filter(
    (item) => !item.protected || process.env.NODE_ENV === "development"
  );
  return (
    <Fragment>
      <div className="flex shrink-0 items-center justify-between h-12 px-4 bg-card/60 backdrop-blur-sm sticky top-0 z-30 border-b">
        <div className="flex items-center gap-4 h-full">
          <Link
            to="/"
            className="display size-10 flex items-center justify-center overflow-hidden
                                 hover:scale-110 hover:rotate-5 active:scale-110 active:rotate-5 transition duration-200"
          >
            <img
              src={logo}
              width={44}
              alt="icon"
              className="text-xs"
            />
          </Link>
          <div className="hidden md:flex items-center h-full">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className="font-semibold text-white hover:text-primary"
                activeClassName="border-b-1 border-primary text-primary"
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Clerk */}
          <div className="hidden md:block">
            <SignedOut>
              <LoginButton />
            </SignedOut>
            <SignedIn>
              <UserButton></UserButton>
            </SignedIn>
          </div>

          {/* Menu */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSideNavOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <SideNav
        menuItems={visibleNavItems}
        isOpen={isSideNavOpen}
        onClose={() => setIsSideNavOpen(false)}
      />
    </Fragment>
  );
}
