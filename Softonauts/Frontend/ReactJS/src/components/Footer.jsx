import React from "react";
import { FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const address = "Living in Alpha Centuri, 4.2465 light years away";
  const email = "softonauts@lightyear.com";

  return (
    <footer>
      <div className="social-links">
        <a
          href="https://www.linkedin.com/in/codeavi"
          target="_blank"
          rel="noopener noreferrer" className="icon" style={{ color: 'white' }} onMouseOver={e => e.currentTarget.style.color = '#1389fd'} onMouseOut={e => e.currentTarget.style.color = 'white'}
        >
          <FaLinkedin />
        </a>
        <a
          href="https://www.twitter.com/FixersPro"
          target="_blank"
          rel="noopener noreferrer"
          className="icon" style={{ color: 'white' }} onMouseOver={e => e.currentTarget.style.color = '#1389fd'} onMouseOut={e => e.currentTarget.style.color = 'white'}>
          <FaTwitter />
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="icon" style={{ color: 'white' }} onMouseOver={e => e.currentTarget.style.color = '#1389fd'} onMouseOut={e => e.currentTarget.style.color = 'white'} >
          <FaInstagram />
        </a>
      </div>
      <div className="personal-bio"  style={{ color: 'white' }} onMouseOver={e => e.currentTarget.style.color = '#1389fd'} onMouseOut={e => e.currentTarget.style.color = 'white'}>
        <p>Address: {address}</p>
        <p>Email: {email}</p>
      </div>
    </footer>
  );
};

export default Footer;