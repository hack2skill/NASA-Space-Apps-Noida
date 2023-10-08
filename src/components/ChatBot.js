"use client";
import React, { useEffect } from "react";

export default function ChatBot() {
  return (
    <div>
      <KommuniChat />
    </div>
  );
}

function KommuniChat() {
  useEffect(() => {
    (function (d, m) {
      var kommunicateSettings = {
        appId: "530f1e62a0be45c0838845693a3f4c7f",
        popupWidget: true,
        automaticChatOpenOnNavigation: true,
      };
      var s = document.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
      var h = document.getElementsByTagName("head")[0];
      h.appendChild(s);
      window.kommunicate = m;
      m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
  }, []);
  return <div></div>;
}
