import banner from './assets/images/sidebanner.jpeg';
import google from './assets/images/google.jpeg';
import apple from './assets/images/apple.png';
import './ThankYou.scss';
export default function ThankYouView(props) {
	return (
		<div className="thanks_wrap">
			<div className='container'>
				<div className='row'>
					<div className='col-md-8'>
						<div className='main_head'>
							<h2 className='d-inline-block'>Effortless Investing.</h2>
							<h2 className='bg-transparent py-0'>Crafted For You</h2>
							<p className='mb-0'>We help you achieve your investment goals by making the process effortless,<br></br>and more accessible.</p>
						</div>

					</div>
				</div>
				<div className='row'>
					<div className='col-md-9'>
						<p className='content'>Congratulations {sessionStorage.custName} ! We thank you for your
							valuable time for taking the survey.
							Based on your initial investment profiling, we
							recommend below Fabits Investment boxes.
						</p>
						<p className='content blue-color-dark'>
							{
								props.responseAnswers.map(data => {
									return <a key={data?.id} href={data?.link}>{data?.name}</a>
								})
							}
						</p>
						<p className='content'>
							Login to Fabits app and start investing!

						</p>
						<h5 className='font-garamond mt-big'>
							<span>	New customer? </span><a target='_blank' className='blue-color-light' href='https://onboard.fabits.app/signup'>Get Onboarded</a>
						</h5>

						<h5 className='font-garamond'>
							<span>Already have an account? </span><a target='_blank' className='blue-color-light' href='https://fabits.app/login'>Sign in here</a>
						</h5>
					</div>
					<div className='col-md-3'>
						<img src={banner} className="w-100" />
					</div>
					<div className='col-md-12'>
						<div className='button_wrap'>
							<h6>Stay Invested on the Go!
							</h6>
							<p>Download our Mobile App Now!
							</p>
							<a target='_blank' href='https://play.google.com/store/apps/details?id=com fabits.app
'><img src={google} /></a>
							<a target='_blank' href='https://apps.apple.com/us/app/fabits/id1600230367
'><img src={apple} /></a>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}