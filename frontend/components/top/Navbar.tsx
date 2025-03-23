"use client";

import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Bars4Icon,
  GlobeAmericasIcon,
  NewspaperIcon,
  PhoneIcon,
  RectangleGroupIcon,
  SquaresPlusIcon,
  SunIcon,
  TagIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

const navListMenuItems = [
  {
    title: "Products",
    description: "Find the perfect solution for your needs.",
    icon: SquaresPlusIcon,
    href: "/",
  },
  {
    title: "About Us",
    description: "Meet and learn about our dedication",
    icon: UserGroupIcon,
    href: "/about",
  },
  {
    title: "Blog",
    description: "Find the perfect solution for your needs.",
    icon: Bars4Icon,
    href: "/",
  },
  {
    title: "Services",
    description: "Learn how we can help you achieve your goals.",
    icon: SunIcon,
    href: "/",
  },
  {
    title: "Support",
    description: "Reach out to us for assistance or inquiries",
    icon: GlobeAmericasIcon,
    href: "/",
  },
  {
    title: "Contact",
    description: "Find the perfect solution for your needs.",
    icon: PhoneIcon,
    href: "/contact",
  },
  {
    title: "News",
    description: "Read insightful articles, tips, and expert opinions.",
    icon: NewspaperIcon,
    href: "/",
  },
  {
    title: "Products",
    description: "Find the perfect solution for your needs.",
    icon: RectangleGroupIcon,
    href: "/",
  },
  {
    title: "Special Offers",
    description: "Explore limited-time deals and bundles",
    icon: TagIcon,
    href: "/",
  },
];

const NavListMenu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const renderItems: React.ReactElement[] = navListMenuItems.map(
    ({ icon, title, description, href }, key) => (
      <Link href={href} key={key}>
        <MenuItem className="hover:bg mr-2 flex items-center gap-3 rounded-lg shadow-none transition-all duration-100 ease-in-out hover:bg-pink-800 hover:shadow-lg">
          <div className="flex items-center justify-center rounded-lg p-2">
            {" "}
            {React.createElement(icon, {
              strokeWidth: 2,
              className: "h-6 text-neutral-300 w-6",
            })}
          </div>
          <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="flex items-center text-sm font-bold"
            >
              {title}
            </Typography>
            <Typography
              variant="paragraph"
              className="text-xs !font-medium text-neutral-400"
            >
              {description}
            </Typography>
          </div>
        </MenuItem>
      </Link>
    ),
  );

  return (
    <React.Fragment>
      <Menu
        open={isMenuOpen}
        handler={setIsMenuOpen}
        offset={{ mainAxis: 20 }}
        placement="bottom"
        allowHover={true}
      >
        <MenuHandler>
          <Typography
            as="div"
            variant="small"
            className="font-medium hover:!text-pink-700"
          >
            <ListItem
              className="flex items-center gap-2 py-2 pr-4 font-medium text-neutral-300"
              selected={isMenuOpen || isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((cur) => !cur)}
            >
              Resources
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`hidden h-3 w-3 transition-transform lg:block ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`block h-3 w-3 transition-transform lg:hidden ${
                  isMobileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </ListItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden max-w-screen-xl rounded-xl bg-zinc-800 p-4 shadow-md lg:block">
          <ul className="grid grid-cols-3 gap-y-2 outline-0 outline-none">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <div className="block lg:hidden">
        {isMobileMenuOpen && (
          <Collapse open={isMobileMenuOpen} className="rounded">
            {renderItems}
          </Collapse>
        )}
      </div>
    </React.Fragment>
  );
};

const NavList: React.FC = () => {
  return (
    <List className="mt-4 mb-6 flex-col p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:items-center lg:p-1">
      <Link href="/" className="text-sm font-medium hover:text-pink-600">
        <ListItem className="flex items-center gap-2 py-2 pr-4">Home</ListItem>
      </Link>
      <NavListMenu />
      <Link href="/about" className="text-sm font-medium hover:text-pink-600">
        <ListItem className="flex items-center gap-2 py-2 pr-4">About</ListItem>
      </Link>
      <Link href="/contact" className="text-sm font-medium hover:text-pink-600">
        <ListItem className="flex items-center gap-2 py-2 pr-4">
          Contact
        </ListItem>
      </Link>
    </List>
  );
};

const NavbarWithMegaMenu: React.FC = () => {
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  return (
    <Navbar className="w-full !rounded-none border-b border-zinc-900 border-b-zinc-800 bg-zinc-900 px-4 py-2 !shadow-none">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between">
        <Link
          href="/"
          className="mr-4 cursor-pointer py-1.5 font-semibold transition-all duration-75 ease-in-out hover:!text-xl hover:text-pink-600 hover:uppercase lg:ml-2"
        >
          Proxreal
        </Link>
        <div className="hidden lg:block">
          <NavList />
        </div>
        <div className="hidden gap-2 lg:flex">
          <Button
            variant="text"
            size="sm"
            className="bg-neutral-800 hover:bg-pink-600"
          >
            Log In
          </Button>
          <Button
            variant="gradient"
            size="sm"
            className="bg-neutral-800 hover:bg-pink-600"
          >
            Sign In
          </Button>
        </div>
        <IconButton
          variant="text"
          color="blue-gray"
          className="lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      {openNav && (
        <Collapse open={openNav}>
          <NavList />
          <div className="flex w-full flex-nowrap items-center gap-2 lg:hidden">
            <Button
              variant="outlined"
              size="sm"
              fullWidth
              className="bg-neutral-800 hover:bg-pink-600"
            >
              Log In
            </Button>
            <Button
              variant="gradient"
              size="sm"
              fullWidth
              className="bg-neutral-800 hover:bg-pink-600"
            >
              Sign In
            </Button>
          </div>
        </Collapse>
      )}
    </Navbar>
  );
};

export default NavbarWithMegaMenu;
