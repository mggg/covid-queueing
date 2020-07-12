import React from 'react';
import logo from './logo.svg'
import Container from 'react-bootstrap/Container'
import Jumbotron from 'react-bootstrap/Jumbotron'
import WaitTimeInteractive from './WaitTimeInteractive'
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="App">
                <header className="site-header">
                    <nav className="site-nav">
                        <a href="https://mggg.org"><img src={logo} alt="MGGG" className="logo" /></a>
                    </nav>
                </header>

                <main>
                    <section className="interactive">
                        <Jumbotron fluid className="lead">
                            <Container>
                                <div className="lead-text">
                                    <h1>Queueing for Campus Coronavirus Testing</h1>
                                    <h2>or how to avoid long lines</h2>
                                    <p>This tool models the impact of planning decisions on projected wait times for coronavirus testing.</p>
                                </div>
                                <div className="model-dropdown">
                                </div>
                            </Container>
                        </Jumbotron>
                        <WaitTimeInteractive />
                    </section>
                    <hr />

                    <section className="info">
                        <h2>How should I use this?</h2>
                        <p>The efficiency of a surveillance testing operation depends both on planning choices and on some behavioral factors that are hard to predict.  This tool lets you experiment with different parameters of demand and operational planning, then performs simulations of participant arrival at testing facilities to predict wait times.  The underlying mathematical model comes from queueing theory, as explained below.</p>
                        <p>The output shows the wait time over the course of the day.  The bold line is the median (50<sup>th</sup> percentile) of 200 simulations, and the shaded bands show the 20<sup>th</sup>-80<sup>th</sup>, 5<sup>th</sup>-95<sup>th</sup>, and 1<sup>st</sup>-99<sup>th</sup> percenties around the median.</p>
                        <p>Use this tool separately for each campus of a university. If testing sites on the same campus are likely to have different levels of demand, consider each site separately.</p>
                        <p>We welcome feedback and suggestions. To discuss this model or any of MGGG&apos;s <a href="https://mggg.github.io/covid-landing-page/index.html">other coronavirus response projects</a>, please reach out at <a href="mailto:contact@mggg.org">contact@mggg.org</a> or to PI Moon Duchin directly at <a href="mailto:Moon.Duchin@tufts.edu">Moon.Duchin@tufts.edu</a>.</p>
                    </section>
                    <hr />

                    <section className="info">
                        <h2>More about the model</h2>
                        <p>This tool uses a <a href="https://en.wikipedia.org/wiki/Monte_Carlo_method">Monte Carlo simulation</a> to approximate the behavior of an <a href="https://en.wikipedia.org/wiki/M/D/c_queue">M/D/c queue</a>, which is a standard model from <a href="https://en.wikipedia.org/wiki/Queueing_theory">queueing theory</a>. This type of queue assumes that arrivals follow a <a href="https://en.wikipedia.org/wiki/Poisson_point_process">Poisson process</a>. In the simplest version of such a process, the average rate of arrival is fixed for the entire day.</p>
                        <p>Our model allows for increased demand during mealtime &ldquo;rush hours&rdquo; (8:30 AM-9:30 AM, 11:30 AM-12:30 AM, and 5 PM–6 PM). In these scenarios, the average rate of arrival is increased by 3x, 5x, or 7x during rush hours relative to normal hours. In all cases, we assume that testing starts at 8 AM and is continuously available until 4 PM, 6 PM, 8 PM, or 10 PM.</p>
                    </section>
                </main>
                
                <footer className='footer mt-auto py-3'>
                    <p>This is a summer 2020 project of <a href="https://mggg.org">MGGG Redistricting Lab</a> at Tufts University&apos;s <a href="https://tischcollege.tufts.edu/">Jonathan M. Tisch College of Civic Life</a> (led by <a href="https://pjrule.github.io/">Parker J. Rule</a>). We are grateful for the major support of the National Science Foundation through the RAPID award OIA-2029788, Campus Coronavirus Response.</p>
                </footer>
            </div>
        );
    }
}

export default App;
