import axios from "axios";
import React, { useEffect, useState } from "react";

const NASA_API_KEY = "tUq3diyfcwpqhAA4hSdkSTY98DPHzsg4dRl6Bmeb"; // Replace with your NASA API key

const NasaInfo = () => {
	const [data, setData] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Fetch data from the NASA API
		axios
			.get(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`)
			.then((response) => {
				setData(response.data);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching data from NASA API:", error);
				setIsLoading(false);
			});
	}, []);

	if (isLoading) {
		return (
			<div
				style={{
					fontSize: "2rem",
					fontWeight: "bold",
					marginBottom: "1rem",
					color: "#333",
					textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
					textAlign: "center",
				}}
			>
				Loading...
			</div>
		);
	}

	return (
		<div
			style={{
				width: "100%",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				color: "white",
			}}
		>
			<div
				style={{
					textAlign: "center",
					justifyContent: "center",
					width: "80%",
				}}
			>
				<h1
					style={{
						fontSize: "2rem",
						fontWeight: "bold",
						marginBottom: "1rem",
					}}
				>
					{data.title}
				</h1>
				<div
					style={{
						width: "100%",
						textAlign: "center",
						marginBottom: "1rem",
					}}
				>
					<img
						src={data.url}
						alt={data.title}
						style={{
							display: "block",
							margin: "0 auto", // Center the image horizontally
							maxWidth: "100%",
						}}
					/>
				</div>
				<p style={{ marginBottom: "1rem" }}>
					<strong>Concept:</strong> {data.title}
				</p>
				<p
					style={{
						marginBottom: "1rem",
						lineHeight: "1.5rem",
					}}
				>
					<strong>Explanation:</strong> {data.explanation}
				</p>
			</div>
		</div>
	);
};

export default NasaInfo;
