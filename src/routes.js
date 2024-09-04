import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
} from "react-icons/md";

// Admin Imports
import UserDashboard from "views/admin/default";
import Explore from "views/admin/marketplace";
import Profile from "views/admin/profile";
import EventPage from "views/admin/dataTables";
import Organise from "views/admin/rtl";

// Auth Imports
import SignInCentered from "views/auth/signIn";

const routes = [
  {
    name: "Home",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: Profile,
  },
  {
    name: "Explore Events",
    layout: "/admin",
    path: "/explore",
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width='20px'
        height='20px'
        color='inherit'
      />
    ),
    component: Explore,
    secondary: true,
  },
  {
    name: "Event Page",
    layout: "/admin",
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    path: "/gameEvent/:eventId",
    component: EventPage,
  },
  {
    name: "User Dashboard",
    layout: "/admin",
    path: "/profile/:userId",
    icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
    component: UserDashboard,
  },
  {
    name: "About Us",
    layout: "/aboutUs",
    path: "/",
    icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
    component: SignInCentered,
  },
  {
    name: "Organise",
    layout: "/rtl",
    path: "/rtl-default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: Organise,
  },
];

export default routes;
