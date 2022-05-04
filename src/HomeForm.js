import { useState } from 'react';
import './HomeForm.scss';
import logo from './assets/images/t.jpeg';
import banner from './assets/images/banner.png';
import fabitsLogo from './assets/images/logo.png';
import Loader from './loader';
export default function HomeForm(props) {

	/* eslint-disable */
	const regExp = RegExp(
		/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
	);

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [contact, setContact] = useState('');
	const [dateofbirth, setDateofBirth] = useState('');
	const [age, setAge] = useState('');
	const [consent, setConsent] = useState(false);

	const [showUser, setShowUser] = useState(false);

	const [firstNameErr, setFirstNameErr] = useState({ error: false });
	const [lastNameErr, setLastNameErr] = useState({ error: false });

	const [emailErr, setEmailErr] = useState({ error: false });
	const [contactErr, setContactErr] = useState({ error: false });
	const [dobErr, setDobErr] = useState({ error: false });
	const [ageErr, setAgeErr] = useState({ error: false });
	const [loaderShown, setLoaderShown] = useState(false);

	const handleSubmit = (e) => {

		setLoaderShown(true);
		e.preventDefault();
		const isValid = formValidation();
		if (isValid) {
			const user = { firstName, lastName, email, contact, age, consent };
			props.onSubmission(user);
			setLoaderShown(false);
		}
	}

	const handleContactSubmit = (e) => {

		e.preventDefault();
		// const isValid = formValidation();
		// if (isValid) {
		// 	const user = { firstName, lastName, email, contact, age, consent };
		// 	props.onSubmission(user);
		// }

		const isValid = formValidation();
		if (isValid) {
			getDataByPhone(contact);
		}
	}

	const getDataByPhone = (contact) => {
		let phoneregex = /^\d{10}$/;
		if (new String(contact.trim()).match(phoneregex)) {

			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
				body: JSON.stringify(
					{
						custPhone: contact,
					}
				)
			};
			setLoaderShown(true);
			fetch(`${process.env.REACT_APP_API_URL}/api/customer/getbyphorem`, requestOptions)
				.then(response => response.json())
				.then(data => {
					setLoaderShown(false);
					if (data && data.statusCode == 404) {
						setShowUser(true);
						setFirstName('');
						setLastName('');
						setAge('');
						setEmail('');
					}
					else if (data) {

						console.log(data);
						setFirstName(data?.custFirstName);
						setLastName(data?.custLastName)
						setAge(data?.age);
						setEmail(data?.custEmail);
						setShowUser(true);
						// navigate("/questions/" + data?.custId);
						// sessionStorage.setItem('custName', user.name);
						// setQuestionView(true);
					}
				})
				.catch((error) => {

					setLoaderShown(false);
					console.error('Something went wrong:', error);
				});
		}
	}

	const changeDetector = (value, fieldName) => {
		if (fieldName === 'first_name') {
			setFirstName(value);
			setFirstNameErr({ error: false })
		}

		if (fieldName === 'last_name') {
			setLastName(value);
			setLastNameErr({ error: false })
		}

		if (fieldName === 'email') {
			setEmail(value);
			setEmailErr({ error: false })
		}

		if (fieldName === 'contact') {
			// getDataByPhone(value);
			setContact(value);
			setContactErr({ error: false })
		}

		if (fieldName === 'dob') {
			setDateofBirth(value);
			setDobErr({ error: false })
		}

		if (fieldName === 'age') {
			setAge(value);
			setAgeErr({ error: false })
		}
	}

	const formValidation = () => {
		let isValid = true;
		if (showUser && !firstName) {
			setFirstNameErr({ error: true });
			isValid = false;
		}

		if (showUser && !lastName) {
			setLastNameErr({ error: true });
			isValid = false;
		}

		if (showUser && (!email || !regExp.test(email))) {
			setEmailErr({ error: true });
			isValid = false;
		}

		let phoneregex = /^\d{10}$/;
		if (!contact || contact.trim().length === 0 || !new String(contact.trim()).match(phoneregex)) {
			setContactErr({ error: true });
			isValid = false;
		}

		// if (showUser && dateofbirth.trim().length === 0) {
		// 	setDobErr({ error: true });
		// 	isValid = false;
		// }

		if (showUser && !age) {
			setAgeErr({ error: true });
			isValid = false;
		}

		return isValid;
	}

	const toggleCheckbox = (e) => {
		setConsent(!consent);
	}

	return (
		<>
			{loaderShown && <Loader />}
			<nav className="navbar navbar-expand-lg navbar-light bg-light py-0">
				<a className="navbar-brand" href="#">
					<img width={'170px'} src='https://secureservercdn.net/192.169.220.85/2ma.86c.myftpupload.com/wp-content/uploads/2021/05/Fabits-Logo-WT.png?time=1650808259' />
				</a>
			</nav>
			<div className='container'>
				<div className='row'>
					<div className='col-md-6'>
						<div className='form-wrap'>
							<div className='d-flex'>
								<h2>Investment Box Onboarding</h2>
								{/* <img src={logo} alt="logo" /> */}
							</div>
							<h4>Answer just 4 questions and get a step closer! We will craft a plan thats right for you!</h4>
							<div className='form-section'>
								{ !showUser && 
									<form autoComplete='off' onSubmit={handleContactSubmit} className="needs-validation" noValidate>
										<div className="form-group">
											<label htmlFor="contact">Contact No</label>
											<input type="text" required className="form-control" id="name" value={contact} onChange={(e) => changeDetector(e.target.value, 'contact')} placeholder="Enter contact" name="contact" />
											{contactErr.error && <span className="text-danger">
												Please enter a valid contact number.
											</span>}
										</div>
										<div className='w-40'>
										<button type="submit" className="btn btn-primary">Continue</button>
										</div>
									</form>
								}
								{showUser && <form autoComplete='off' onSubmit={handleSubmit} className="needs-validation" noValidate>
									<div className="form-group">
										<label htmlFor="contact">Contact No</label>
										<input type="text" required className="form-control" id="name" value={contact} onChange={(e) => changeDetector(e.target.value, 'contact')} onBlur={(e) => getDataByPhone(e.target.value)} placeholder="Enter contact" name="contact" />
										{contactErr.error && <span className="text-danger">
											Please enter a valid contact number.
										</span>}
									</div>
									{showUser && <div className="form-group">
										<label htmlFor="firstname">First Name </label>
										<input type="text" required className="form-control" id="firstname" value={firstName} onChange={(e) => changeDetector(e.target.value, 'first_name')} placeholder="Enter first name" name="firstname" />

										{firstNameErr.error && <span className="text-danger">
											Please enter the first name.
										</span>}
									</div>}
									{showUser && <div className="form-group">
										<label htmlFor="lastname">Last Name </label>
										<input type="text" required className="form-control" id="lastname" value={lastName} onChange={(e) => changeDetector(e.target.value, 'last_name')} placeholder="Enter last name" name="lastname" />

										{lastNameErr.error && <span className="text-danger">
											Please enter the last name.
										</span>}
									</div>}
									{showUser && <div className="form-group">
										<label htmlFor="email">Email</label>
										<input type="email" required className="form-control" id="email" value={email} onChange={(e) => changeDetector(e.target.value, 'email')} placeholder="Enter email" name="email" />
										{emailErr.error && <span className="text-danger">
											Please enter a valid email address.
										</span>}
									</div>}
									{/* {showUser && <div className="form-group">
							<label htmlFor="dob">Date of Birth</label>
							<input type="date" required className="form-control" id="dateofbirth" value={dateofbirth} onChange={(e) => changeDetector(e.target.value, 'dob')} name="dateofbirth" />
							{dobErr.error && <span className="text-danger">
								Please enter your date of birth.
							</span>}
						</div>} */}
									{showUser && <div className="form-group">
										<label htmlFor="age">Age</label>
										<input type="text" required className="form-control" id="age" value={age} onChange={(e) => changeDetector(e.target.value, 'age')} placeholder="Enter age" name="age" />
										{ageErr.error && <span className="text-danger">
											Please enter your age.
										</span>}
									</div>}
									<div className='w-40'>
										<input type="checkbox" onChange={toggleCheckbox} />
										<span className='tc'> By continuing, you agree to our terms and conditions. </span>
										<button type="submit" className="btn btn-primary">{!showUser ? 'Continue' : 'Submit'}</button>
									</div>
								</form>}
							</div>
						</div>
					</div>
					<div className='col-md-6'>
						<img src={banner} className='img-fluid' />
					</div>
				</div>
			</div>
		</>
	);
}