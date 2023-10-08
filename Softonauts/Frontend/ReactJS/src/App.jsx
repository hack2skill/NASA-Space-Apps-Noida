import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import DestinationPage from "./DestinationPage";
import HomePage from "./HomePage";
import Layout from "./Layout";
import NasaInfo from "./components/NasaInfo";
function App() {
	return (
		<Routes>
			<Route
				path="/"
				element={<Layout />}
			>
				<Route
					index
					element={<HomePage />}
				/>
				<Route
					path="/destination"
					element={<DestinationPage />}
				/>
				<Route
					path="/nasainfo"
					element={<NasaInfo />}
				/>
			</Route>
		</Routes>
	);
}

export default App;
