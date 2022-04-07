import Lottie from 'lottie-react'
import animationData from './pillanim.json'
//https://lottiefiles.com/91145-health-insurance
//https://lottiefiles.com/9234-medicine-icon
//https://lottiefiles.com/2649-patient-successfully-added
//https://lottiefiles.com/61069-medicine-pills
//https://lottiefiles.com/38255-medicine-service

function Home() {
    return (
        <>
            <div className="primary mb-5" style={{ height: '78%'}}> 
                <div className="container h-100">
                    <div className="row h-100">
                        <div className="col-md-5 my-auto">
                            <h1 className="mb-3">Ensuring medication adherence</h1>
                            <p>
                                Our device works to provide an easy and modular solution
                                to medication adherence issues for elderly patients
                            </p>
                        </div>
                        <div className="offset-md-1 col-md-6 my-auto">
                            <Lottie animationData={animationData} loop={ true }/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="HDTW">
                <div className="text-center">
                    <h3>How does this work?</h3>
                    <p>We're glad you asked</p>
                </div>
            </div>
            <div className="about">
                <div class="row">
                    <div class="col-4">
                        <h3 class="aboutTitle">Rack and Pinion</h3>
                        <p>Our rack and pinion system allows the RxMinder to adjust its height based on the height of the pill being dispensed. The container must be at the optimal height or it risks pills being dropped through the system.</p>
                        <img src={require('./croppedGear.gif')} className='img-fluid' alt="loading..." />
                    </div>
                    <div class="col-4">
                        <h3 class="aboutTitle">Telescoping Chute</h3>
                        <p>The telescoping chute allows the user to adjust the width of the chute to the width of the pill being dispensed. This allows the pills to be perfectly stacked vertically to drop into the rotating drop mechanism.</p>
                        <img src={require('./croppedTelescope.gif')} className='img-fluid' alt="loading..." />
                    </div>
                    <div class="col-4">
                        <h3 class="aboutTitle">Rotating Drop Mechanism</h3>
                        <p>The rotating drop mechanism first has a pill fall into its collection chamber, then as it rotates, it blocks the next pill from dropping down, drops the pill onto the ramp and returns back to its original position where a pill will drop into its chamber again.</p>
                        <img src={require('./croppedTurn.gif')} className='img-fluid' alt="loading..." />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
