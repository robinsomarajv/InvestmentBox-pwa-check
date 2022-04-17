import { useState } from 'react';
import './HomeForm.scss';
import logo from './assets/images/t.jpeg';

export default function HomeForm(props) {

	/* eslint-disable */
	const regExp = RegExp(
		/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
	);

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [contact, setContact] = useState('');
	const [dateofbirth, setDateofBirth] = useState('');

	const [showUser, setShowUser] = useState(false);

	const [nameErr, setNameErr] = useState({ error: false });
	const [emailErr, setEmailErr] = useState({ error: false });
	const [contactErr, setContactErr] = useState({ error: false });
	const [dobErr, setDobErr] = useState({ error: false });

	const handleSubmit = (e) => {
		e.preventDefault();
		const isValid = formValidation();
		if (isValid) {
			const user = { name, email, contact, dateofbirth };
			props.onSubmission(user);
		}
	}

	const getDataByPhone = (contact) => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' , 'Accept': 'application/json'},
			body:JSON.stringify(
				{
					custPhone: contact,
				}
			)
		};

		fetch(`${process.env.REACT_APP_API_URL}/api/customer/getbyphorem`, requestOptions)
			.then(response => response.json())
			.then(data => {
				if(data && data.statusCode == 404) {
					setShowUser(true);
					setName('');
					setDateofBirth('');
					setEmail('');
				}
				else if (data) {

					console.log(data);
					setName(data?.custFirstName + ' ' + (data?.custLastName ? data ?.custLastName : ''));
					setDateofBirth(data?.custDob);
					setEmail(data?.custEmail);
					setShowUser(true);
					// navigate("/questions/" + data?.custId);
					// sessionStorage.setItem('custName', user.name);
					// setQuestionView(true);
				}
			})
			.catch((error) => {
				console.error('Something went wrong:', error);
			});
	}

	const changeDetector = (value, fieldName) => {
		if (fieldName === 'name') {
			setName(value);
			setNameErr({ error: false })
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
	}

	const formValidation = () => {
		let isValid = true;
		if (name.trim().length === 0) {
			setNameErr({ error: true });
			isValid = false;
		}

		if (email.trim().length === 0 || !regExp.test(email)) {
			setEmailErr({ error: true });
			isValid = false;
		}

		if (contact.trim().length === 0) {
			setContactErr({ error: true });
			isValid = false;
		}

		if (dateofbirth.trim().length === 0) {
			setDobErr({ error: true });
			isValid = false;
		}

		return isValid;
	}

	return (
		<div className='container'>
			<div className='form-wrap'>
				<div className='d-flex'>
					<h2>Investment Box Onboarding</h2>
					<img src={logo} alt="logo" />
				</div>
				<h4>Answer just 4 questions and get a step closer! We will craft a plan thats right got you!</h4>
				<div className='form-section'>
					<form onSubmit={handleSubmit} className="needs-validation" noValidate>
						<div className="form-group">
							<label htmlFor="contact">Contact No</label>
							<input type="text" required className="form-control" id="name" value={contact} onChange={(e) => changeDetector(e.target.value, 'contact')} onBlur={(e) => getDataByPhone(e.target.value)} placeholder="Enter contact" name="contact" />
							{contactErr.error && <span className="text-danger">
								Please enter a valid contact number.
							</span>}
						</div>
						{showUser && <div className="form-group">
							<label htmlFor="name">Name </label>
							<input type="text" required className="form-control" id="name" value={name} onChange={(e) => changeDetector(e.target.value, 'name')} placeholder="Enter name" name="name" />

						</div>}
						{nameErr.error && <span className="text-danger">
							Please enter a name.
						</span>}
						{showUser && <div className="form-group">
							<label htmlFor="email">Email</label>
							<input type="email" required className="form-control" id="email" value={email} onChange={(e) => changeDetector(e.target.value, 'email')} placeholder="Enter email" name="email" />
							{emailErr.error && <span className="text-danger">
								Please enter a valid email address.
							</span>}
						</div>}
						{showUser && <div className="form-group">
							<label htmlFor="dob">Date of Birth</label>
							<input type="date" required className="form-control" id="dateofbirth" value={dateofbirth} onChange={(e) => changeDetector(e.target.value, 'dob')} name="dateofbirth" />
							{dobErr.error && <span className="text-danger">
								Please enter your date of birth.
							</span>}
						</div>}
						<div className='w-40'>
							<button type="submit" className="btn btn-primary">{!showUser ? 'Proceed' : 'Submit'}</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
