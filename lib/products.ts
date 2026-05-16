export type Product = {
  title: string;
  subtitle: string;
  href: string;
  img: string;
  video?: string;
};

export const PRODUCTS: Product[] = [
  {
    title: "Columbus",
    subtitle: "An agentic GIS",
    href: "/products/business",
    img: "/ColumbusNavbarDropdownmenu.png",
  },
  {
    title: "Elio",
    subtitle: "The smart social map",
    href: "/products/mapsgpt",
    img: "/navbardropElio.png",
    video: "/Eliodropdownmenuvid.mp4",
  },
];
