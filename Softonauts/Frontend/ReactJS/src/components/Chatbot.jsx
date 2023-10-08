import React, { useEffect } from 'react';

const ChatBot = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
      const url = 'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=AIzaSyAmMtufl_TPyWdLbuCFD5Lh8IEpJWrEXYo';
      const headers = {
          'Content-Type': 'application/json',
      };

      let chatStr = 'Sir: hi \\nPluto: Hello, I am Pluto,the nasa chatbot \\nSir: You are nasa chatbot which strictly only knows about Nasa,Space and satellites.Other than you will always say "I am pluto and i only know about Space.You will answer strictly in less than 50 words not more than that." \\nPluto: Ok i am pluto, nasa robot and i only know about Space.I will answer you in less than 50 words not more than that.';

      const synth = window.speechSynthesis;
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      const startButton = document.getElementById('startButton');

      startButton.addEventListener('click', () => {
          recognition.start();
          startButton.classList.add('listening');
      });

      recognition.addEventListener('result', (event) => {
          const speechResult = event.results[0][0].transcript;
          document.getElementById('inputField').value = speechResult;
          document.getElementById('inputForm').dispatchEvent(new Event('submit'));
          startButton.classList.remove('listening');
      });

      document.getElementById('inputForm').addEventListener('submit', async (event) => {
          event.preventDefault();
          const inputField = document.getElementById('inputField');
          const prompt = inputField.value;
          inputField.value = '';

          chatStr += \`Sir: \${prompt}\\nPluto: \`;

          const data = {
              "prompt": {
                  "text": chatStr
              }
          };

          try {
              const response = await fetch(url, {
                  method: 'POST',
                  headers: headers,
                  body: JSON.stringify(data)
              });

              if (!response.ok) {
                  throw new Error(\`HTTP error! status: \${response.status}\`);
              }

              const responseJson = await response.json();
              const output = responseJson['candidates'][0]['output'];

              chatStr += \`\${output}\\n\`;
              // Display only the latest user and assistant messages in the chatbox
              document.getElementById('chatbox').innerHTML = \`<p>User: \${prompt}</p><p>Assistant: \${output}</p>\`;
          } catch (error) {
              console.error(error);
          }
      });
    `;
    document.body.appendChild(script);
  }, []);


  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '50px', 
      left: '0', 
      width: '300px', 
      height: '200px', 
      marginLeft: '800px',
      background: 'linear-gradient(0deg, rgba(34,60,195,1) 9%, rgba(45,229,253,1) 100%)',
      border: '2px solid #000000',
      borderRadius: '15px',
      boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
      transition: '0.5s',
      overflow: 'hidden'
    }}>
      <div id="chatbox" style={{ 
        fontSize: '18px',
        width: '100%', 
        height: 'calc(100% - 50px)',
        overflowY: 'auto',
        padding: '15px'
      }}>
        {/* Chat messages will be added here */}
      </div>
      <form id="inputForm" style={{ 
        width: '100%', 
        height: '50px',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '15px',
        borderTop: '2px solid #000000',
        backgroundColor: '#F8F8FF'
      }}>
          <input 
            type="text" 
            id="inputField" 
            placeholder="Type your message..." 
            style={{ 
              flex: 1, 
              borderRadius: '15px',
              borderColor: '#000000',
              borderWidth: '2px',
              backgroundColor: '#F8F8FF',
              color: '#000000',
              padding: '10px',
              fontSize: '10px',
              transition: '0.3s'
            }} 
          />
          <button 
  type="submit" 
  style={{
    marginLeft: '10px',
    backgroundColor: '#0000FF', // Blue background
    color: '#FFFFFF', // White text
    borderRadius: '15px', // Rounded corners
    padding: '10px 20px' // Padding for better spacing
  }}
>
  Send
</button>
<button 
  id="startButton" 
  style={{ 
    backgroundImage: "url('https://www.pinclipart.com/picdir/big/32-322562_microphone-clip-art.png')", 
    backgroundSize: 'cover', 
    width: '25px', 
    height: '35px',
    marginLeft: '10px',
    borderRadius: '15px', // Rounded corners
    border: 'none' // Remove default button border
  }}
/>

      </form>
    </div>
    
  );
};

export default ChatBot;
