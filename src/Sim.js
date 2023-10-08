import './Sim.css';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RandomFacts() {
  const facts = [
    'The cycle of eclipse repeats every 18.6 years called as soras.',
    'A lunar eclipse is visible over an entire hemisphere.',
    'Solar eclipses can occur at least two and not more than 5 times a year.',
    'The eclipse shadow moves at 2000 mph at the Earth\'s poles and 1000 mph at the Earth\'s equator.',
    'A lunar eclipse can only occur during a full moon.',
    'A solar eclipse can only occur during a New moon.',
    'The longest duration for a total solar eclipse possible is 7.5 minutes.',
    'Solar eclipses will come to an end in about 600 million years due to tides on Earth, and the slowing down of Earth\'s rotation will cause the Moon to be too far away from the Earth to cover the Sun, thus bringing an end to solar eclipses.',
    'During a total lunar eclipse, the Moon can appear to turn a reddish or copper color. This is often referred to as the blood moon, and it is caused by the Earth\'s atmosphere scattering sunlight and allowing only the longer wavelength red and orange colors to reach the Moon.',
    'A lunar eclipse can have various shades of red, depending on the Earth\'s atmospheric conditions. Factors like volcanic eruptions on Earth can influence the color of the eclipsed Moon.',
    'The Moon\'s orbit is not a perfect circle but slightly elliptical. This means that the apparent size of the Moon during a lunar eclipse can vary. When the Moon is closer to Earth in its orbit (perigee), it may appear larger during a lunar eclipse.',
    'During a penumbral lunar eclipse, the Moon passes through Earth\'s penumbral shadow, causing a subtle shading on the Moon\'s surface that can be challenging to observe without careful observation.',
    'In some cultures, lunar eclipses were historically believed to be omens or signs of significant events, leading to various superstitions and rituals.',
    'There are different types of solar eclipses, including total, partial, and annular eclipses. In a total solar eclipse, the Sun is entirely covered by the Moon, while in a partial eclipse, only a portion of the Sun is obscured.',
    'During a total solar eclipse, the sky can become dark as if it were nighttime, and stars and planets become visible. This phenomenon is often accompanied by a noticeable drop in temperature.',
    'Solar eclipses have played a crucial role in scientific discoveries, such as the verification of Einstein\'s theory of general relativity during the 1919 solar eclipse.',
    'Solar eclipses have been a source of wonder and mythological significance in various cultures throughout history, often associated with gods or mythical creatures.',
    'The phenomenon known as the "diamond ring effect" occurs just before and after a total solar eclipse when a small part of the Sun\'s surface is visible, resembling a bright diamond ring.'
];


  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const handleNextFact = () => {
    setCurrentFactIndex((prevIndex) => (prevIndex + 1) % facts.length);
  };

  const handlePreviousFact = () => {
    setCurrentFactIndex((prevIndex) =>
      prevIndex === 0 ? facts.length - 1 : prevIndex - 1
    );
  };

  return (
    <div id="random-facts">
      <div style={{padding:"10px",textDecoration:"underline"}}><h2>Random Facts</h2></div>
      <p style={{padding:"10px",fontSize:"20px"}}>{facts[currentFactIndex]}</p>
      <div className="buttons">
        <button onClick={handlePreviousFact}>Previous</button>
        <button onClick={handleNextFact}>Next</button>
      </div>
    </div>
  );
}

function Sim() {
  const [earthAngle, setEarthAngle] = useState(0);
  const [moonAngle, setMoonAngle] = useState(0);

  const handleEarthAngleChange = (event) => {
    setEarthAngle(event.target.value);
  };

  const handleMoonAngleChange = (event) => {
    setMoonAngle(event.target.value);
  };

  useEffect(() => {
    const orbit = document.getElementById('orbit');
    const eorbit = document.getElementById('eorbit');
    const moon = document.getElementById('moon');
    const horizon = document.getElementById('horizon');

    const radius = orbit.offsetWidth / 2;
    const centerX = orbit.offsetLeft + radius;
    const centerY = orbit.offsetTop + radius;

    const earthX = centerX + radius * Math.cos((earthAngle * Math.PI) / 180);
    const earthY = centerY + radius * Math.sin((earthAngle * Math.PI) / 180);

    eorbit.style.left = earthX - eorbit.offsetWidth / 2 + 'px';
    eorbit.style.top = earthY - eorbit.offsetHeight / 2 + 'px';

    // Calculate Moon's position relative to Earth's orbit
    const moonRadius = eorbit.offsetWidth / 2 + moon.offsetWidth / 2;
    const moonX =
      earthX +
      moonRadius * Math.cos(((moonAngle*10 + 180) * Math.PI) / 180);
    const moonY =
      earthY +
      moonRadius * Math.sin(((moonAngle*10 + 180) * Math.PI) / 180);

    moon.style.left = moonX - moon.offsetWidth / 2 + 'px';
    moon.style.top = moonY - moon.offsetHeight / 2 + 'px';
    // Calculate the position of the horizon
    const horizonTop = horizon.getBoundingClientRect().top;

    // Check if Earth and Moon centers align with the horizon
    console.log("Y-->",earthAngle,moonAngle,horizonTop)
    // console.log("X-->",earthX,moonX,horizonTop)
    

    if(earthAngle==342){
      if(moonAngle==19 || moonAngle==55){
        toast("LUNAR ECLIPSE!!!!!!!!!!")
      }else if(moonAngle==35 || moonAngle==71){
        toast("SOLAR ECLIPSE !!!!!!!!!!!")
      }
    }

  }, [earthAngle, moonAngle]);

  return (
    <div id="mainn">
      <img src="bg.jpg" alt="bg"></img>
      <div id="orbit">
        <div id="sun">
          <img src="sun.png" alt="sun"></img>
        </div>
      </div>
      <div id="eorbit">
        <div id="earth">
          <img src="earth_2.png" alt="earth"></img>
        </div>
      </div>
      <div id="moon">
        <img src="moon.png" alt="moon"></img>
      </div>
      <div id='sliders'>
        <div id="earth-angle-slider">
          <label>Move earth</label>
          <input
            type="range"
            min="310"
            max="360"
            value={earthAngle}
            onChange={handleEarthAngleChange}
            className="slider"
          />
        </div>
        <div id="moon-angle-slider">
        <label>Move moon</label>
          <input
            type="range"
            min="0"
            max="90"
            value={moonAngle}
            onChange={handleMoonAngleChange}
            className="slider"
          />
        </div>
      </div>
      <div id="horizon"></div>
      <RandomFacts />
      <ToastContainer />
    </div>
  );
}

export default Sim;
