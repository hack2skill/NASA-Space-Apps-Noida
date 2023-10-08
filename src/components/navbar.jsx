"use client";
import { sdk } from "@/conf/Appwrite";
import {
  Avatar,
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Spinner,
} from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect } from "react";
import Buttons from "./Button";
import { useRouter } from "next/navigation";

function MainNavbar() {
  const [avatarUrl, setAvatarUrl] = React.useState("");
  const [name, setName] = React.useState("");
  const router = useRouter();
  const fn = () => {
    sdk.logout();
    router.replace("/");
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = await sdk.getGithubData();
      setAvatarUrl(data.avatar_url);
      setName(data.name);
    };
    fetchData();
  }, []);
  return (
    <div>
      <Navbar className="" isBlurred isBordered shouldHideOnScroll>
        <NavbarBrand>
          <p className="font-bold text-inherit">open-spacelink{"<></>"}</p>
        </NavbarBrand>

        <NavbarContent justify="end">
          <NavbarItem>
            <h1 className="text-md font-medium">
              {name === "" ? "" : `Hi, ${name}`}
            </h1>
          </NavbarItem>
          <NavbarItem>
            {avatarUrl === "" ? (
              <Spinner />
            ) : (
              <Avatar isBordered color="default" src={avatarUrl} />
            )}
          </NavbarItem>
          <NavbarItem>
            <Buttons fn={fn} text={"Logout"} />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </div>
  );
}

export default MainNavbar;
