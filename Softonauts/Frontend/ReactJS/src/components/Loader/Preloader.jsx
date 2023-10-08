import React from "react";
import "../../css/loading-animation.css";
import LoadingAnimation from "./LoadingAnimation";

const Preloader = () => {
	return (
		<div
			id="preloader"
			className="w-full h-full fixed top-0 z-50 bg-black"
		>
			<LoadingAnimation />
		</div>
	);
};

export default Preloader;