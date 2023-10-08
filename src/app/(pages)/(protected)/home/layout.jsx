import MainNavbar from "@/components/navbar";
import React from "react";

function HomeLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "rgb(17,17,17)",
        background:
          "linear-gradient(90deg, rgba(17,17,17,1) 0%, rgba(18,18,24,1) 45%, rgba(22,22,22,1) 100%)",
      }}
    >
      <MainNavbar />
      {children}
    </div>
  );
}

export default HomeLayout;
