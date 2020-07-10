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
                                    <p>Short explainer text here</p>
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
                        <p>99th-percentile events might be important. Or they might not be. Who knows?</p>
                        <p>Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.</p>
                        <p>Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato. Dandelion cucumber earthnut pea peanut soko zucchini.</p>
                        <p>Turnip greens yarrow ricebean rutabaga endive cauliflower sea lettuce kohlrabi amaranth water spinach avocado daikon napa cabbage asparagus winter purslane kale. Celery potato scallion desert raisin horseradish spinach carrot soko. Lotus root water spinach fennel kombu maize bamboo shoot green bean swiss chard seakale pumpkin onion chickpea gram corn pea. Brussels sprout coriander water chestnut gourd swiss chard wakame kohlrabi beetroot carrot watercress. Corn amaranth salsify bunya nuts nori azuki bean chickweed potato bell pepper artichoke.</p>
                    </section>
                    <hr />

                    <section className="info">
                        <h2>More about the model</h2>
                        <p>Queueing theory bla bla bla...</p>
                        <p>Celery quandong swiss chard chicory earthnut pea potato. Salsify taro catsear garlic gram celery bitterleaf wattle seed collard greens nori. Grape wattle seed kombu beetroot horseradish carrot squash brussels sprout chard.</p>
                        <p>Beetroot water spinach okra water chestnut ricebean pea catsear courgette summer purslane. Water spinach arugula pea tatsoi aubergine spring onion bush tomato kale radicchio turnip chicory salsify pea sprouts fava bean. Dandelion zucchini burdock yarrow chickpea dandelion sorrel courgette turnip greens tigernut soybean radish artichoke wattle seed endive groundnut broccoli arugula.</p>
                    </section>
                </main>
                
                <footer className='footer mt-auto py-3'>
                    <p>This is a summer 2020 project of <a href="https://mggg.org">MGGG Redistricting Lab</a> at Tufts University&apos;s <a href="https://tischcollege.tufts.edu/">Jonathan M. Tisch College of Civic Life</a> with assistance from <a href="https://pjrule.github.io/">Parker J. Rule</a>. We are grateful for the major support of the National Science Foundation through the RAPID award OIA-2029788, Campus Coronavirus Response.</p>
                </footer>
            </div>
        );
    }
}

export default App;
