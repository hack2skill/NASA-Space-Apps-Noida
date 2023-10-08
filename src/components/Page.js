import React from "react";
import "./Page.css";
import bg from "../Resources/bgnasa.webp";
import anime from "../Resources/animation.gif";
import simss from "../Resources/simss.jpg";
import vrss from "../Resources/vrss.png";
import annui from "../Resources/annular.webp";
import toti from "../Resources/total.webp";
import Chatbot from "../Chatbot"
import { Link } from "react-router-dom";
import Quiz from "../components/Quiz/Quiz"
function Page() {
  return (
    <div id="main">
      <div id="page1">
        <div id="navbar">
          <a href="#page1">Home</a>
          <a href="#page2">Vr/Sim</a>
          <a href="#page3">ChatBot</a>
          <a href="#page4">Quiz</a>
        </div>
        <img src={bg} alt="not found" id="bg"></img>
        {/* <img src={anime} id="anime"></img> */}
        <div id="content">
          <div id="header">
            <h1>Eclipedia</h1>
            <p>Discover celestial ballets, embrace eclipse mysteries with Eclipedia's radiant journey.</p>
          </div>
          <div id="btn">
            <a href="#page2"><button>explore</button></a>
          </div>
        </div>
      </div>
      <div id="page2">
        <div id="fact">
          <div id="head">
            <h1>Get ready for upcoming solar eclipse in India</h1>
          </div>
          <div id="annural">
            <div id="annui">
              <img src={annui}></img>
            </div>
            <div id="annut">
              <div id="annubig">
                <h1>2031 Annural Solar Eclipse</h1>
              </div>
              <div id="annusmall">
                <p>
                  The next annular solar eclipse in India is in 2782 days on
                  Wednesday, 05/21/2031.
                </p>
              </div>
            </div>
          </div>
          <div id="total">
            <div id="totali">
              <img src={toti}></img>
            </div>
            <div id="tott">
              <div id="totbig">
                <h1>2034 Total Solar Eclipse</h1>
              </div>
              <div id="totsmall">
                <p>
                  The next total solar eclipse in India is in 3816 days on
                  Monday, 03/20/2034.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div id="ss">
          <div id="vr">
            <h1>Try Virtual Reality</h1>
            <div id="vrh">
              <img src={vrss}></img>
            </div>
          </div>
          <div id="sim">
            <h1>Try Simulator</h1>
            <div id="simh">
            <Link to="/sim"><img src={simss}></img></Link>
            </div>
          </div>
        </div>
      </div>
      <div id="page3">
        <Chatbot />
      </div>
      <div id="page4">
      <Quiz/>
      </div>
    </div>
  );
}

export default Page;
