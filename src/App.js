import { useState } from 'react';
import './App.css';
import HomeForm from './HomeForm';
import Loader from './loader';

import {
	useNavigate,
} from "react-router-dom";

function App() {
	let navigate = useNavigate();
	const [questionView, setQuestionView] = useState(false);
	const [latLngVal, setLatLongVal] = useState();
	const [loaderShown, setLoaderShown] = useState(false);

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
		setLoaderShown(true);
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' , 'Accept': 'application/json'},
			body:JSON.stringify(
				{
					custFirstName: user?.firstName,
					custLastName: user?.lastName,
					custEmail: user?.email,
					custPhone: user?.contact,
					// custDob: user?.dateofbirth,
					custLocation: latLngVal ? latLngVal : '',
					age: user?.age,
					privacyConsent: user?.consent
					// goal: ""
				}
			)
		};

		fetch(`${process.env.REACT_APP_API_URL}/api/customer`, requestOptions)
			.then(response => response.json())
			.then(data => {
				if (data) {
					navigate("/questions/" + data?.custId);
					sessionStorage.setItem('custName', user?.firstName + ' ' + user?.lastName);
					setLoaderShown(false);
					setQuestionView(true);
				}
			})
			.catch((error) => {
				console.error('Something went wrong:', error);
			});
	}

	return (
		<div className='container container-full'>
			{loaderShown && <Loader />}
			{!questionView && <HomeForm onSubmission={userFormSubmitted}></HomeForm>}
			{/* {questionView && <QuestionSet questions={questions}></QuestionSet>} */}
		</div>
	);
}

export default App;
