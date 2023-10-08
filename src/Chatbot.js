import React, { useState } from 'react';
import axios from 'axios';
import "./Chatbot.css"
function Chatbot() {
    const apiKey = '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';
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');
  

  const fetchData = async (inputText) => {
    const fetch = require('node-fetch');

const OPENAI_API_KEY = apiKey; // Replace with your OpenAI API key

const apiUrl = 'https://api.openai.com/v1/chat/completions';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${OPENAI_API_KEY}`
};

const data = {
  model: 'gpt-3.5-turbo-0301',
  messages: [{ role: 'user', content: "Act as a astronomy expert and explain like you are explaining to a 6th standard student"+inputText+"also keep it very short" }],
  temperature: 0.7
};

fetch(apiUrl, {
  method: 'POST',
  headers,
  body: JSON.stringify(data)
})
  .then(response => response.json())
  .then(result => {
    console.log(result);
    setResponse(result.choices[0].message.content)
  })
  .catch(error => {
    console.error('Error:', error);
  });

  };

  const handleSubmit = async () => {
    // Replace 'YOUR_API_KEY' with your actual OpenAPI key
    try {
        const response = await fetchData(inputText);
        console.log("response--->",response);
      } catch (error) {
        console.error(error);
      }
  }

  return (
    <div className='top'>
      <h1>Chatbot</h1>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <button onClick={handleSubmit}>Submit</button>
      
      {/* Display the response from the API */}
      {response && <p>{response}</p>}
    </div>
  );
}

export default Chatbot;
