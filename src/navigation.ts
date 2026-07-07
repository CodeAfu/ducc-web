import { MenuItem } from "./lib/types";

export const navItems: MenuItem[] = [
  {
    href: "/",
    label: "Home",
    cardTitle: "Home",
    protected: false,
  },
  // {
  //   href: "/bg-remover",
  //   label: "BG Remover",
  //   protected: false,
  //   group: "tools",
  // },
  {
    href: "/bingo",
    label: "Bingo",
    cardTitle: "Bingo Card",
    protected: false,
    group: "tools",
  },
  {
    href: "/genshin",
    label: "Genshin",
    cardTitle: "Genshin Stuff",
    protected: false,
    group: "tools",
  },
  {
    href: "/hyl",
    label: "HoyoLab",
    cardTitle: "HoyoLab Scraper",
    protected: true,
    group: "tools",
  },
  {
    href: "/agreement-generator",
    cardTitle: "Agreement Generator",
    label: "Agreement",
    protected: false,
  },
  {
    href: "/tests",
    label: "Tests",
    cardTitle: "Tests",
    protected: true,
  },
];
