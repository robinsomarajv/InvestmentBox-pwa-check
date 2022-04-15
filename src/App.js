import { useState } from 'react';
import './App.css';
import HomeForm from './HomeForm';

import {
	useNavigate,
} from "react-router-dom";

function App() {
	let navigate = useNavigate();
	const [questionView, setQuestionView] = useState(false);
	const [latLngVal, setLatLongVal] = useState();

	getLocation();

	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
		} else {
			console.error("Geolocation is not supported by this browser.");
		}
	}

	function geoSuccess(position) {
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		setLatLongVal(lat + ':' + lng);
		console.log("lat:" + lat + " lng:" + lng);
	}

	function geoError() {
		console.error("Geocoder failed.");
	}

	function userFormSubmitted(user) {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' , 'Accept': 'application/json'},
			body:JSON.stringify(
				{
					custFirstName: user?.name.split(" ")[0],
					custLastName: user?.name.split(" ").length > 1 ? user.name.split()[1] : '',
					custEmail: user?.email,
					custPhone: user?.contact,
					custDob: user?.dateofbirth,
					custLocation: latLngVal ? latLngVal : '',
					goal: ""
				}
			)
		};

		fetch(`${process.env.REACT_APP_API_URL}/api/customer`, requestOptions)
			.then(response => response.json())
			.then(data => {
				if (data) {
					navigate("/questions/" + data?.custId);
					sessionStorage.setItem('custName', user.name);
					setQuestionView(true);
				}
			})
			.catch((error) => {
				console.error('Something went wrong:', error);
			});
	}

	return (
		<div className='container'>
			{!questionView && <HomeForm onSubmission={userFormSubmitted}></HomeForm>}
			{/* {questionView && <QuestionSet questions={questions}></QuestionSet>} */}
		</div>
	);
}

export default App;
