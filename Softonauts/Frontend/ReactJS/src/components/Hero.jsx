import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ChatBot from "./Chatbot";
import Modal from 'react-modal';
Modal.setAppElement('#root');


const Hero = () => {
	const [text, setText] = useState("");
	const [index, setIndex] = useState(0);
	const fullTexts = [
		"Climb Olympus Mons (21 km high - tallest mountain in the solar system!) Enjoy breathtaking views from the peak.",
		"Explore Valles Marineris (4,000 km long - longest canyon in the solar system!) Go spelunking in its intricate cave systems.",
		"See the ice caps and dune fields of the northern polar region. Experience Martian winters.",
		"Visit ancient riverbeds and lakebeds. Look for signs of past life.",
		"Check out the southern hemisphere and spots where rovers have landed like Gale Crater.",
		"Take a balloon ride in the upper clouds and see Venusian lightning storms up close.",

		"Explore Maxwell Montes, the highest mountain on Venus at 11 km. Withstand the extreme pressures.",

		"See the lava flows and volcanoes that sculpted the surface. Check out Maat Mons, one of the largest volcanoes.",

		"Visit the crater Mead, thought to be the best spot to search for past life due to its mild temperatures.",

		"Fly through the Giant Red Spot, an enormous raging storm larger than Earth.",

		"View the Great Red Spot from nearby and witness its striking color contrast.",

		"Cloudsurf closer to the planet and experience its fast winds and turbulent weather.",

		"Visit the icy moons of Europa, Ganymede, and Callisto and see their cracked surfaces and ocean worlds underneath.",
	];

	useEffect(() => {
		const cursor = document.querySelector(".cursor");

		document.addEventListener("mousemove", (e) => {
			cursor.style.left = e.pageX - 485 + "px";
			cursor.style.top = e.pageY - 225 + "px";
		});
	}, []);
	useEffect(() => {
		const fullText = fullTexts[index];
		const delay = 600 / fullText.length;

		function type() {
			setText((prevText) => fullText.slice(0, prevText.length + 1));
			if (text === fullText) {
				setTimeout(() => {
					setIndex((prevIndex) => (prevIndex + 1) % fullTexts.length);
					setText("");
				}, 5000); // add 5 seconds delay after each text
			} else {
				timerId = setTimeout(type, delay);
			}
		}

		let timerId = setTimeout(type, delay);

		return () => clearTimeout(timerId);
	}, [text, index]);

	useEffect(() => {
		"use strict";

		var canvas = document.getElementById("canvas"),
			ctx = canvas.getContext("2d"),
			w = (canvas.width = window.innerWidth),
			h = (canvas.height = window.innerHeight),
			hue = 217,
			stars = [],
			count = 0,
			maxStars = 1400;

		// Thanks @jackrugile for the performance tip! https://codepen.io/jackrugile/pen/BjBGoM
		// Cache gradient
		var canvas2 = document.createElement("canvas"),
			ctx2 = canvas2.getContext("2d");
		canvas2.width = 100;
		canvas2.height = 100;
		var half = canvas2.width / 2,
			gradient2 = ctx2.createRadialGradient(
				half,
				half,
				0,
				half,
				half,
				half
			);
		gradient2.addColorStop(0.025, "#fff");
		gradient2.addColorStop(0.1, "hsl(" + hue + ", 61%, 33%)");
		gradient2.addColorStop(0.25, "hsl(" + hue + ", 64%, 6%)");
		gradient2.addColorStop(1, "transparent");

		ctx2.fillStyle = gradient2;
		ctx2.beginPath();
		ctx2.arc(half, half, half, 0, Math.PI * 2);
		ctx2.fill();

		// End cache

		function random(min, max) {
			if (arguments.length < 2) {
				max = min;
				min = 0;
			}

			if (min > max) {
				var hold = max;
				max = min;
				min = hold;
			}

			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		function maxOrbit(x, y) {
			var max = Math.max(x, y),
				diameter = Math.round(Math.sqrt(max * max + max * max));
			return diameter / 2;
		}

		var Star = function () {
			this.orbitRadius = random(maxOrbit(w, h));
			this.radius = random(60, this.orbitRadius) / 12;
			this.orbitX = w / 2;
			this.orbitY = h / 2;
			this.timePassed = random(0, maxStars);
			this.speed = random(this.orbitRadius) / 300000;
			this.alpha = random(2, 10) / 10;

			count++;
			stars[count] = this;
		};

		Star.prototype.draw = function () {
			var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
				y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
				twinkle = random(10);

			if (twinkle === 1 && this.alpha > 0) {
				this.alpha -= 0.05;
			} else if (twinkle === 2 && this.alpha < 1) {
				this.alpha += 0.05;
			}

			ctx.globalAlpha = this.alpha;
			ctx.drawImage(
				canvas2,
				x - this.radius / 2,
				y - this.radius / 2,
				this.radius,
				this.radius
			);
			this.timePassed += this.speed;
		};

		for (var i = 0; i < maxStars; i++) {
			new Star();
		}

		function animation() {
			ctx.globalCompositeOperation = "source-over";
			ctx.globalAlpha = 0.8;
			ctx.fillStyle = "hsla(" + hue + ", 64%, 6%, 1)";
			ctx.fillRect(0, 0, w, h);

			ctx.globalCompositeOperation = "lighter";
			for (var i = 1, l = stars.length; i < l; i++) {
				stars[i].draw();
			}

			window.requestAnimationFrame(animation);
		}

		animation();

		animation();
	}, []);

	return (
		<div
			className="middle-content"
			style={{ position: "relative" }}
		>
			<canvas
				id="canvas"
				style={{
					zIndex: "-1",
					height: "90vh",
					width: "100vw",
				}}
			></canvas>
			<div
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					color: "white",
					fontSize: "5em",
					fontfamily: "monospace, sans-serif",
				}}
			>
				<p> So, You want to travel to Space 🌌</p>
				<div className="cursor"></div>
				<p
					style={{
						fontSize: "0.5em",
						textAlign: "center",
						background:
							"linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(45,122,253,1) 100%)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
					}}
				>
					If you want to go to space, you might as well genuinely go
					to outer space and not hover kind of on the edge of it. Well
					sit back, and relax because we'll give you a truly out of
					this world experience.
				</p>

				<div>
					<p
						style={{
							fontSize: "0.25em",
							textAlign: "left",
							color: "#22c1c3",
							marginTop: "1rem",
						}}
						onMouseOver={(e) =>
							(e.currentTarget.style.color = "#50fa7b")
						}
						onMouseOut={(e) =>
							(e.currentTarget.style.color = "#22c1c3")
						}
					>
						{text}
					</p>
				</div>
				<ChatBot />
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						gap: "1rem",
					}}
				>
					<Link
						to="https://exploreplanets.netlify.app/"
						target="_blank"
					>
						<button className="startpage">Explore</button>
					</Link>
					<Link to="/destination">
						<button className="startpage">
							Choose Your Adventure
						</button>
					</Link>
					
				</div>
			</div>
		</div>
	);
};

export default Hero;
