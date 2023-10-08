"use client";
import React, { useEffect } from "react";
import Image from "@/components/Image";
import Button from "@/components/Button";
import { AiFillGithub } from "react-icons/ai";
import { BsGoogle } from "react-icons/bs";
import { sdk } from "@/conf/Appwrite";
import { useRouter } from "next/navigation";

export default function Login() {
  const redirectUrl = process.env.NEXT_PUBLIC_WEBSITE_DOMAIN + "home";
  const failureUrl = process.env.NEXT_PUBLIC_WEBSITE_DOMAIN + "login";
  const handleLoginGithub = () => {
    sdk.register(redirectUrl, failureUrl);
  };
  return (
    <div
      className=""
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
      }}
    >
      <div
        className="
        bg-zinc-900 bg-opacity-50 
      "
      >
        <div className="container h-screen w-full p-6 over">
          <div className=" flex h-full justify-between items-center">
            <div className="grid grid-cols-2 gap-10">
              <div className="flex justify-center items-center">
                <div className="flex flex-col gap-3">
                  <h2 className="text-5xl font-bold">Open-SpaceLink</h2>
                  <h2 className="text-2xl">
                    Open Source Marketplace - Empowering Innovation
                  </h2>
                  <div>
                    <Button
                      icon={<BsGoogle />}
                      text="Log in with Google"
                      color="secondary"
                      variant="shadow"
                      onClick={() => {
                        //login with google
                      }}
                    />
                    <Button
                      icon={<AiFillGithub />}
                      text="Log in with Github"
                      color="primary"
                      variant="shadow"
                      fn={handleLoginGithub}
                    />
                  </div>
                </div>
              </div>
              <Image image_url="/Login_graphic.png" alt="login" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
