import React, { useState } from "react";

function Chatbot() {
  const apiKey = "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";
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState("");
  const fetchData = async (inputText) => {
    const fetch = require("node-fetch");
  };
  return <div>hello</div>;
}

export default Chatbot;
