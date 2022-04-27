import { useState, useEffect } from 'react';
import logo from './assets/images/t.jpeg';
import { useParams } from "react-router-dom";
import './QuestionSet.scss';

import ThankYouView
	from './ThankYouView';

export default function QuestionSet(props) {
	const [questions, setQuestions] = useState();
	const [thankYouView, setThankYouView] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [responseAnswers, setResponseAnswers] = useState();

	// const [surveyId, setSurveyId] = useState('');
	let params = useParams();

	useEffect(() => {

		Promise.all([getUserResponses(), getSurveyQuestions()])
			.then(values => {
				values[0].json().then(data => {
					console.log("===data====", data);
					values[1].json().then(item => {
						console.log("===data1====", item);

						let response = item.surveyQuestions.map(ques => {
							if (ques.multiSelect) {
								console.log("===multiselect===");
							} else {
								console.log("===single select====");
							}
							if (data?.statusCode === 404) {
								console.log("===buhahhaa");
								return {
									...ques,
									selectedOption: []
								}
							} else {
								let userSelected = [];
								// if(ques.multiSelect) {
								// 	console.log("===multiselect===");
								// } else {
								const selectedOption = data.filter(option => option.qid === ques.qid);
								//debugger;
								if (selectedOption.length) {
									// userSelected.push(selectedOption[0].oid);
									selectedOption.forEach(soption => {
										userSelected.push(soption.oid);
									})
								}
								// }
								return {
									...ques,
									selectedOption: userSelected
								}
							}

						});

						item.surveyQuestions = response;
						//debugger;
						// data.map(items => {})
						setQuestions(item);

					})
				});
			})
			.catch(error => {
				console.log(error);
			});

		// getUserResponses();

		// getSurveyQuestions();
		// const requestOptions = {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'text/plain' , 'Accept': 'application/json'},
		// 	body: 'b689ab39-3807-4ac8-aea5-638b9f13860c'
		// };
		// fetch(`${process.env.REACT_APP_API_URL}/api/survey`, requestOptions)
		// 	.then(results => results.json())
		// 	.then(data => {
		// 		let response = data.surveyQuestions.map(item => {
		// 			return {
		// 				...item,
		// 				selectedOption :  []
		// 			}

		// 		});

		// 		data.surveyQuestions = response;
		// 		//debugger;
		// 		// data.map(items => {})
		// 		setQuestions(data);
		// 	});
	}, [params]);

	const formValidation = () => {
		const itemsShown = questions && questions?.surveyQuestions.filter(item => item.qid).length;
		const itemsAnswered = questions && questions?.surveyQuestions.filter(item => item.selectedOption).length;

		return itemsShown !== itemsAnswered;
	}

	const setRange = (question_id, value) => {
		let newQues = [...questions];
		const objIndex = questions.findIndex((obj => parseInt(obj.id) === parseInt(question_id)));
		if (objIndex >= 0) {
			newQues[objIndex].selectedOption = value;
			setQuestions(newQues);
		}
	}

	const postSelectedOption = (question_id, option_id) => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify([{
				"custId": params?.id,
				"qid": question_id,
				"oid": option_id,
				"sid": questions?.surveyId
			}])
		};

		fetch(`${process.env.REACT_APP_API_URL}/api/survey/bulkpost`, requestOptions)
			.then(response => response.json())
			.then(data => {
				if (data) {
					// setThankYouView(true);
				}
			})
			.catch((error) => {
				console.error('Something went wrong:', error);
			});
	}

	const getUserResponses = () => {
		const requestOptions = {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		};


		return fetch(`${process.env.REACT_APP_API_URL}/api/survey/responses?custId=${params?.id}`, requestOptions)
		// .then(response => response.json())
		// .then(data => {
		// 	console.log("====data====", data);
		// })
		// .catch((error) => {
		// 	console.error('Something went wrong:', error);
		// });
	}

	const getSurveyQuestions = () => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'text/plain', 'Accept': 'application/json' },
			body: 'b689ab39-3807-4ac8-aea5-638b9f13860c'
		};
		return fetch(`${process.env.REACT_APP_API_URL}/api/survey`, requestOptions)
		// .then(results => results.json())
		// .then(data => {
		// 	let response = data.surveyQuestions.map(item => {
		// 		return {
		// 			...item,
		// 			selectedOption :  []
		// 		}

		// 	});

		// 	data.surveyQuestions = response;
		// 	//debugger;
		// 	// data.map(items => {})
		// 	setQuestions(data);
		// });
	}

	const postSubmit = (url) => {
		const multiplChoiceQuestions = questions?.surveyQuestions.filter(data => data.multiSelect === true);
		const singleChoiceQuestions = questions?.surveyQuestions.filter(data => data.multiSelect === false);
		//debugger;
		const submitReq = singleChoiceQuestions.map(data => ({
			"custId": params.id,
			"qid": data.qid,
			oid: data?.selectedOption?.length ? data.selectedOption[0] : '',
			// oid: data?.selectedOption.join(),
			sid: questions?.surveyId
		}));
		console.log("===submit req===", submitReq);
		let multiReq = [];
		const multipleReq = multiplChoiceQuestions.map(
			data =>
				data?.selectedOption.map(item => {
					multiReq.push(
						{
							"custId": params.id,
							"qid": data.qid,
							oid: item,
							// oid: data?.selectedOption.join(),
							sid: questions?.surveyId
						}
					)

				})

		);
		console.log("===multiple req===", multipleReq);

		const postReq = submitReq.concat(multiReq);
		const submitData = postReq.filter(data => data.oid)

		//debugger;

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(submitData)
		};

		fetch(`${process.env.REACT_APP_API_URL}${url}`, requestOptions)
			.then(response => response.json())
			.then(data => {
				if (data) {
					if (url === '/api/survey/submit') {
						setResponseAnswers(data);
						setThankYouView(true);
					}
				}
			})
			.catch((error) => {
				console.error('Something went wrong:', error);
			});
	}

	const changeDetector = (currentSelected) => {
		const [question_id, option_id] = currentSelected.target.value.split("_");

		// postSelectedOption(question_id, option_id);

		let mappedQuestions;
		let mappedQuestionKeys;
		let question = questions?.surveyQuestions.filter(question => question.qid === question_id);

		let newQues = { ...questions };
		const qstnIndex = newQues?.surveyQuestions.findIndex((obj => obj.qid === question_id));
		// newQues.surveyQuestions[qstnIndex].selectedOption = option_id;
		newQues.surveyQuestions[qstnIndex].selectedOption.push(option_id);
		if (question.length) {
			mappedQuestions = question[0].questionFlowMetadata;
		}

		if (mappedQuestions && Object.keys(mappedQuestions).length) {
			mappedQuestionKeys = Object.keys(mappedQuestions);

			for (let i = 0; i < mappedQuestionKeys.length; i++) {

				if (option_id !== mappedQuestionKeys) {
					const questionOption = mappedQuestions[mappedQuestionKeys[i]];

					for (let j = 0; j < questionOption.length; j++) {
						const objIndex = questions?.surveyQuestions.findIndex((obj => parseInt(obj.qid) === parseInt(questionOption[j])));
						if (parseInt(mappedQuestionKeys[i]) === parseInt(option_id)) {
							// const objIndex = questions.findIndex((obj => obj.id == questionOption[j]));
							console.log(objIndex);
							newQues.surveyQuestions[objIndex].showOnLoad = true;

						}
						else if (mappedQuestions[option_id] && mappedQuestions[option_id].indexOf(questionOption[j]) < 0) {
							// const objIndex = questions.findIndex((obj => obj.id == questionOption[j]));
							newQues.surveyQuestions[objIndex].showOnLoad = false;
						} else {

							newQues.surveyQuestions[objIndex].showOnLoad = false;
						}
					}
				}
			}

			if (mappedQuestions && mappedQuestions[option_id]) {
				for (let i = 0; i < mappedQuestions[option_id].length; i++) {
					const objIndex = questions?.surveyQuestions.findIndex((obj => parseInt(obj.qid) === parseInt(mappedQuestions[option_id][i])));
					newQues.surveyQuestions[objIndex].showOnLoad = true;
				}
			}

		} else {
			const objIndex = questions?.surveyQuestions.findIndex((obj => obj.qid === question_id));
			if (!newQues.surveyQuestions[objIndex]?.multiSelect) {
				newQues.surveyQuestions[objIndex].selectedOption = [option_id];
			} else {
				newQues.surveyQuestions[objIndex].selectedOption.push(option_id);
			}
		}

		postSubmit('/api/survey/bulkpost');
		setQuestions(newQues);
	}

	const addStack = (option_name, option_id, question_id) => {
		// postSelectedOption(question_id, option_id);
		let newQues = { ...questions };
		const objIndex = questions?.surveyQuestions.findIndex((obj => obj.qid === question_id));

		const question = questions?.surveyQuestions[objIndex];

		// if(!question?.selectedOption) {
		// 	question.selectedOption = [];
		// }

		const optionIndex = question?.selectedOption.findIndex(id => id === option_id);

		if (optionIndex < 0) {
			newQues?.surveyQuestions[objIndex].selectedOption.push(option_id);
		} else {
			//debugger;
			if (newQues?.surveyQuestions[objIndex]?.selectedOption) {
				newQues?.surveyQuestions[objIndex].selectedOption.splice(optionIndex, 1);
			} else {

			}
		}

		setQuestions(newQues);

		postSubmit('/api/survey/bulkpost');

	}

	const getTagStatus = (question_id, option_id, data) => {
		const item = questions?.surveyQuestions.filter(question => question.qid === question_id);

		if (item.length && item[0]?.selectedOption && item[0]?.selectedOption?.length && item[0]?.selectedOption.indexOf(option_id) >= 0) {
			return true;
		} else {
			return false;
		}
	}

	const getUserSelectedStatus = (question, option_id) => {
		//debugger;
		if (question?.selectedOption && question?.selectedOption.length) {
			return question?.selectedOption[0] === option_id;
		} else {
			return false;
		}
	}

	const content = questions && questions?.surveyQuestions && questions?.surveyQuestions.map((question) => {
		// if (question.showOnLoad) {
		return <div key={question.qid} className='card'>
			<div key={question.qid} className="card-body">
				<label htmlFor="question" className='questions'>{question.question}</label>
				<>
					{!question?.multiSelect &&
						Object.keys(question.options).map((data) => {
							return <div key={question.qid + '_' + question.options[data]?.oid} className="form-check">
								<input className="form-check-input" onChange={value => changeDetector(value)} required type="radio" value={question.qid + '_' + question.options[data]?.oid} checked={getUserSelectedStatus(question, question.options[data]?.oid)} name={"flexRadio " + question.qid} id={question.qid} />
								<label className="form-check-label" htmlFor="flexRadioDefault1">
									{question.options[data]?.optionstext}
								</label>
							</div>
						})
					}

				</>

				{question.showOnLoad && question.type === 'range' &&
					<>
						<br></br>
						<span className="float-start">{question.options.min}</span>
						<span className="float-end">{question.options.max}</span>
						<input name={question.id} type="range" value={question.selectedOption ? question.selectedOption : question.options.min} onChange={(e) => setRange(question.id, e.target.value)} className="form-range" min={question.options.mix} max={question.options.max} id="customRange2"></input>
						<input type="text" value={question.selectedOption ? question.selectedOption : question.options.min} disabled></input>

					</>
				}

				{question?.multiSelect &&
					<>
						<div className="hstack gap-2" key={question.qid}>
							{
								Object.keys(question.options).map((data) => {
									return <div key={question.qid + '_' + question.options[data]?.oid} onClick={() => addStack(question.options[data], question.options[data]?.oid, question.qid)} value={question.qid + '_' + question.options[data]?.oid} className={`bg-light border ${getTagStatus(question.qid, question.options[data]?.oid, question.options[data]) ? 'active' : ''}`}>{question.options[data]?.optionstext}</div>
								})
							}
						</div>
					</>
				}
			</div>
		</div>
		// } else {
		// return <></>;
		// }
	});

	const handleSubmit = (e) => {
		e.preventDefault();

		setSubmitted(true);
		if (!formValidation()) {
			postSubmit('/api/survey/submit');
			// setThankYouView(true);
		}
	}


	return (
		<>
			{!thankYouView && <div className='container containerQuestion'>
				<nav className="navbar navbar-expand-lg navbar-light bg-light py-0">
					<a className="navbar-brand" href="#">
						<img width={'170px'} src='https://secureservercdn.net/192.169.220.85/2ma.86c.myftpupload.com/wp-content/uploads/2021/05/Fabits-Logo-WT.png?time=1650808259' />
					</a>
					{/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
							<span className="navbar-toggler-icon"></span>
						</button> */}


				</nav>
				<div className='form-wrap'>
					{questions && questions.length === 0 && <div className='loader'>
						<div className="spinner-border text-primary" role="status"></div>
					</div>
					}
					<div className='container'>
						<div className='d-flex'>
							<h2>Investment Box Onboarding</h2>
							{/* <img src={logo} alt="logo" /> */}
						</div>
						<h4>Answer just 4 questions and get a step closer! We will craft a plan thats right got you!</h4>
						<div className='form-section question-padding'>
							{submitted && <span className="text-danger">
								Please answer all the questions.
							</span>}
							<form onSubmit={handleSubmit} noValidate>
								{content}
								<br></br>
								<button type="submit" className="btn btn-primary btn-lg float-end mb-5">Submit</button>
							</form>
						</div>
					</div>
				</div>
			</div>
			}
			{thankYouView && <ThankYouView responseAnswers={responseAnswers}></ThankYouView>}
		</>
	)
}