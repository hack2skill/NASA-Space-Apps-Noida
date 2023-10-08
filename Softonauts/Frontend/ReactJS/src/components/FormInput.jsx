import React, { useState } from "react";
import "./css/FormInput.css";

const submitForm = (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    const data = {
        name: name,
        source: source,
        destination: destination
    };

    fetch('https://5c2lhs-5000.csb.app/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => console.error('Error:', error));
};


const FormInput = () => {
	const dropdownStyle = {
		width: "100%",
		height: "2.5rem",
		borderRadius: "4px",
	};

	const [name, setName] = useState("");
	const [source, setSource] = useState("");
	const [destination, setDestination] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	// Define images for each planet
	const planetImages = {
		Mars: "https://th.bing.com/th/id/R.84720f374ff0499a8d10e656b133eb41?rik=r%2bVMCT5K1h62jA&riu=http%3a%2f%2fpngimg.com%2fuploads%2fmars_planet%2fmars_planet_PNG23.png&ehk=UP%2fOf9Ey1idQyrFgiJQGTsPYzmmi1dotHJXgsoevI3M%3d&risl=&pid=ImgRaw&r=0", // Replace with actual image URLs
		Mercury:
			"https://ivantepes.github.io/Space-Facts/assets/images/mercury1.png",
		Venus: "https://th.bing.com/th/id/R.2901e3da973b12e0b3bf2f803d99a22d?rik=XxwCafSwxNivGQ&riu=http%3a%2f%2fwww.pngimagesfree.com%2fNATURE%2fPlanet%2fVenus%2fPNG-Venus-Planet-image.png&ehk=RvpIKBBxH8vh0NvfFJY8Cku362ALZJfzQZAH40gknys%3d&risl=&pid=ImgRaw&r=0",
		Earth: "https://th.bing.com/th/id/R.aba5bdbb6a5985ffdf4a73d1729b609a?rik=Jg0hpvQv2U9ssQ&riu=http%3a%2f%2fpurepng.com%2fpublic%2fuploads%2flarge%2fpurepng.com-earthearthplanetglobethird-planet-from-the-sun-1411526987924uaycc.png&ehk=66BMj2ZEiocMEl9svzvUMa%2fgVKkbWzFehj7o5ktXbH0%3d&risl=1&pid=ImgRaw&r=0",
		Jupiter:
			"https://vignette.wikia.nocookie.net/thesolarsystem6361/images/d/d3/Jupiter_spacepedia.png/revision/latest?cb=20180301165031",
		Saturn: "https://clipground.com/images/saturn-png-4.png",
		Neptune:
			"https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/AW_187527_OUTERPLANETS_Neptune_hx4ioc.png",
	};

	const handleNameChange = (e) => {
		const enteredName = e.target.value;
		setName(enteredName);
	};

	const handleSourceChange = (e) => {
		const selectedSource = e.target.value;
		setSource(selectedSource);
		validateSelections(selectedSource, destination);
	};

	const handleDestinationChange = (e) => {
		const selectedDestination = e.target.value;
		setDestination(selectedDestination);
		validateSelections(source, selectedDestination);
	};

	const validateSelections = (selectedSource, selectedDestination) => {
		if (selectedSource === selectedDestination) {
			setErrorMessage("Source and destination cannot be the same.");
		} else {
			setErrorMessage("");
		}
	};
	const submitForm = (e) => {
		e.preventDefault(); // Prevent the form from refreshing the page
	
		const data = {
			name: name,
			source: source,
			destination: destination
		};
	
		fetch('https://5c2lhs-5000.csb.app', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		.then(response => response.blob())
		.then(blob => {
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = url;
			let s = name;
			a.download = s + " Itinerary.pdf"; // the filename you want
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
		})
		.catch((error) => console.error('Error:', error));
	};
	
	return (
		<div className="container">
			<form className="form" onSubmit={submitForm}>
				<div className="form-title">
					<span>Wonder into the</span>
				</div>
				<div className="title-2">
					<span>SPACE</span>
				</div>
				<div className="input-container">
					<input
						type="text"
						className="input-name"
						placeholder="Your Name"
						value={name}
						onChange={handleNameChange}
					/>
				</div>
				<div className="input-container">
					<select
						className="input-mail"
						style={{
							...dropdownStyle,
							backgroundColor: "transparent", // Set background color
							color: "White", // Set text color
						}}
						value={source}
						onChange={handleSourceChange}
					>
						<option value="">Select Source</option>
						<option value="Mars">Mars</option>
						<option value="Mercury">Mercury</option>
						<option value="Venus">Venus</option>
						<option value="Earth">Earth</option>
						<option value="Jupiter">Jupiter</option>
						<option value="Saturn">Saturn</option>
						<option value="Neptune">Neptune</option>
						{/* Add more planet options as needed */}
					</select>
				</div>

				<section className="bg-stars">
					<span className="star"></span>
					<span className="star"></span>
					<span className="star"></span>
					<span className="star"></span>
				</section>

				<div className="input-container">
					<select
						className="input-pwd"
						style={{
							...dropdownStyle,
							backgroundColor: "transparent", // Set background color
							color: "White", // Set text color
						}}
						value={destination}
						onChange={handleDestinationChange}
					>
						<option value="">Select Destination</option>
						<option value="Mars">Mars</option>
						<option value="Mercury">Mercury</option>
						<option value="Venus">Venus</option>
						<option value="Earth">Earth</option>
						<option value="Jupiter">Jupiter</option>
						<option value="Saturn">Saturn</option>
						<option value="Neptune">Neptune</option>
						{/* Add more planet options as needed */}
					</select>
				</div>
				{errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
				<button
					type="submit"
					className="submit"
					disabled={
						name === "" ||
						source === "" ||
						destination === "" ||
						errorMessage !== ""
					}
				>
					<span className="sign-text">Start</span>
				</button>
			</form>
			<div className="white-div left-div">
				{source && (
					<img
						src={planetImages[source]}
						alt={source}
						className={`planetImageset ${
							source === destination ? "highlighted-edge" : ""
						}`}
					/>
				)}
			</div>
			<div className="white-div right-div">
				{destination && (
					<img
						src={planetImages[destination]}
						alt={destination}
						className={`planetImageset ${
							source === destination ? "highlighted-edge" : ""
						}`}
					/>
				)}
			</div>
		</div>
	);
};

export default FormInput;
