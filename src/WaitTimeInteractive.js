import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ProgressBar from 'react-bootstrap/ProgressBar'
import FormControl from 'react-bootstrap/FormControl'
import ModelParam from './ModelParam'
import WaitTimeChart from './WaitTimeChart'
import { simulateMdc, normalizedLambdas } from './queue'

/* --- Start constants --- */
/* Monte Carlo parameters */

// TODO: this could be adaptive
// (figure out time per sim and do N seconds' worth of simulation)
const N_RUNS = 200; // number of Monte Carlo simulations

/* Day lengths */
const DAYS = {
    8: {
        'start': new Date(2020, 1, 1, 8, 0, 0),
        'end': new Date(2020, 1, 1, 16, 0, 0)
    }, // 8-hour day (8 a.m. – 4 p.m.)
    10: {
        'start': new Date(2020, 1, 1, 8, 0, 0),
        'end': new Date(2020, 1, 1, 18, 0, 0)
    }, // 10-hour day (8 a.m. – 6 p.m.)
    12: {
        'start': new Date(2020, 1, 1, 8, 0, 0),
        'end': new Date(2020, 1, 1, 20, 0, 0)
    }, // 12-hour day (8 a.m. – 8 p.m.)
    14: {
        'start': new Date(2020, 1, 1, 8, 0, 0),
        'end': new Date(2020, 1, 1, 22, 0, 0)
    } // 14-hour day (8 a.m. – 10 p.m.)
};
const DEFAULT_DAY = 12; // Use 12-hour day by default
const MIN_TIME = new Date(2020, 1, 1, 8, 0, 0);

/* Demand scenarios */
const SCENARIOS = {
    'Uniform demand': [
        {'start': MIN_TIME, 'demand': 1}
    ],
    'Peak usage around mealtimes': [
        // peak breakfast period: 8:30 a.m. – 9:30 a.m.
        {'start': MIN_TIME, 'demand': 1},
        {'start': new Date(2020, 1, 1, 8, 30, 0), 'demand': 5},
        {'start': new Date(2020, 1, 1, 9, 30, 0), 'demand': 1},
        // peak lunch period: 11:30 a.m. – 12:30 a.m.
        {'start': new Date(2020, 1, 1, 11, 30, 0), 'demand': 5},
        {'start': new Date(2020, 1, 1, 12, 30, 0), 'demand': 1},
        // peak dinner period: 5:00 p.m. – 6:00 p.m.
        {'start': new Date(2020, 1, 1, 17, 0, 0), 'demand': 5},
        {'start': new Date(2020, 1, 1, 18, 0, 0), 'demand': 1},
   ]
}
const DEFAULT_SCENARIO = 'Peak usage around mealtimes';
/* --- End constants --- */

class WaitTimeInteractive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numPeople: 1500,
            numStudents: 1200,
            numStaff: 300,
            numPeopleTestingStations: 30,
            numStudentTestingStations: 22,
            numStaffTestingStations: 8,
            minutesPerTest: 8,
            peopleScenario: DEFAULT_SCENARIO,
            studentScenario: DEFAULT_SCENARIO,
            staffScenario: DEFAULT_SCENARIO,
            dayLength: DEFAULT_DAY,
            separateStudentsStaff: false,
            simRunning: false
        };
        this.updateChart = this.updateChart.bind(this);
        this.onSeparationChange = this.onSeparationChange.bind(this);
        this.onParamChange = this.onParamChange.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
    }

    /*
     * generic `onChange` handler:
     * https://medium.com/front-end-weekly/react-quick-tip-easy-data-
     * binding-with-a-generic-onchange-handler-fb0254a7094e
     */
    onSeparationChange(e) {
        this.setState({ [e.target.name]: e.target.checked },
            function() {
                if (this.state.studentHists === undefined ||
                    this.state.staffHists === undefined ||
                    this.state.peopleHists === undefined) {
                    this.updateChart();
                }
            }
        );
    }

    onParamChange(e)  {
        console.log("id:", e.target.id);
        console.log("value:", e.target.value);
        this.setState({ [e.target.id]: e.target.value });
    }

    onSelectChange(e) {
        this.setState({ [e.target.id]: e.target.value });
    } 

    componentDidMount() {
        this.updateChart();
    }

    updateChart() {
        this.setState({ 'simRunning': true });
        let start = DAYS[this.state.dayLength]['start'];
        let end = DAYS[this.state.dayLength]['end'];
        let testLength = this.state.minutesPerTest;
        if (this.state.separateStudentsStaff === true) {
            let nStudents = parseInt(this.state.numStudents);
            let nStaff = parseInt(this.state.numStaff);
            let scStudents = SCENARIOS[this.state.studentScenario];
            let scStaff = SCENARIOS[this.state.staffScenario];
            let nStudentStations = parseInt(this.state.numStudentTestingStations);
            let nStaffStations = parseInt(this.state.numStaffTestingStations);

            let studentLambdas = normalizedLambdas(nStudents, scStudents, start, end, 1);
            let staffLambdas = normalizedLambdas(nStaff, scStaff, start, end, 1);
            let studentHists = simulateMdc(studentLambdas, nStudentStations, testLength, N_RUNS);
            let staffHists = simulateMdc(staffLambdas, nStaffStations, testLength, N_RUNS);
            this.setState({'studentHists': studentHists, 'staffHists': staffHists});
        } else {
            let nPeople = parseInt(this.state.numPeople);
            let nPeopleStations = parseInt(this.state.numPeopleTestingStations);
            let scPeople = SCENARIOS[this.state.peopleScenario];
            let peopleLambdas = normalizedLambdas(nPeople, scPeople, start, end, 1);
            let peopleHists = simulateMdc(peopleLambdas, nPeopleStations, testLength, N_RUNS);
            this.setState({'peopleHists': peopleHists});
        }
        this.setState({'startTime': start, 'endTime': end, 'simRunning': false});
    }

    scenarioOptions() {
        let scenarios = Object.keys(SCENARIOS).sort();
        return scenarios.map(s => {
            return <option key={s} value={s}>{s}</option>;
        });
    }

    render() {
        return (
            <Container className="wait-time-interactive">
                <div className="wait-time-chart">
                    {(() => {
                        if (this.state.simRunning) {
                            return (
                                <div class="wait-time-progress">
                                    <ProgressBar animated now={100} />
                                </div>
                            );
                        } else {
                            return (
                                <WaitTimeChart separateStudentsStaff={this.state.separateStudentsStaff}
                                               peopleHists={this.state.peopleHists}
                                               studentHists={this.state.studentHists} 
                                               staffHists={this.state.staffHists}
                                               startTime={this.state.startTime}
                                               endTime={this.state.endTime}
                                />
                            );
                        }
                    })()}
                </div>
                <div className="wait-time-params">
                    <Form>
                        <Form.Group as={Row} className="justify-content-center" controlId="separateStudentsStaff">
                            <Col sm={4}>
                                <Form.Check type="checkbox"
                                            name="separateStudentsStaff"
                                            label="Separate students and staff"
                                            checked={this.state.separateStudentsStaff}
                                            onChange={this.onSeparationChange} />
                            </Col>
                        </Form.Group>
                        {(() => {
                            if (this.state.separateStudentsStaff) {
                                return (
                                    <>
                                    <ModelParam controlId="numStudents"
                                                defaultValue={this.state.numStudents}
                                                onChange={this.onParamChange}
                                                label="students per day" />
                                    <ModelParam controlId="numStaff"
                                                defaultValue={this.state.numStaff}
                                                onChange={this.onParamChange}
                                                label="staff per day" />
                                    <ModelParam controlId="numStudentTestingStations"
                                                defaultValue={this.state.numStudentTestingStations}
                                                onChange={this.onParamChange}
                                                label="student testing lines" />
                                    <ModelParam controlId="numStaffTestingStations"
                                                defaultValue={this.state.numStaffTestingStations}
                                                onChange={this.onParamChange}
                                                label="staff testing lines" />
                                    </>
                                );
                            } else {
                                return (
                                    <>
                                    <ModelParam controlId="numPeople"
                                                defaultValue={this.state.numPeople}
                                                onChange={this.onParamChange}
                                                label="people per day" />
                                    <ModelParam controlId="numPeopleTestingStations"
                                                defaultValue={this.state.numPeopleTestingStations}
                                                onChange={this.onParamChange}
                                                label="testing lines" />
                                    </>
                                );
                            }
                        })()}

                        <ModelParam controlId="minutesPerTest"
                                    defaultValue={this.state.minutesPerTest}
                                    onChange={this.onParamChange}
                                    label="minutes per test" />


                        {(() => {
                            if (this.state.separateStudentsStaff) {
                                // TODO: turn this into a proper component if it gets reused again
                                return (
                                    <>
                                    <Form.Group as={Row} controlId="studentScenario">
                                        <Col sm={4} />
                                        <Col sm={4}>
                                            <FormControl as="select"
                                                         key="studentScenario"
                                                         defaultValue={this.state.studentScenario}
                                                         onChange={this.onSelectChange}>
                                                {this.scenarioOptions()}
                                            </FormControl>
                                        </Col>
                                        <Form.Label column sm={3}>(students)</Form.Label>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="staffScenario">
                                        <Col sm={4} />
                                        <Col sm={4}>
                                            <FormControl as="select"
                                                         key="staffScenario"
                                                         defaultValue={this.state.staffScenario}
                                                         onChange={this.onSelectChange}>
                                                {this.scenarioOptions()}
                                            </FormControl>
                                        </Col>
                                        <Form.Label column sm={3}>(staff)</Form.Label>
                                    </Form.Group>
                                    </>
                                );
                            } else {
                                return (
                                    <Form.Group as={Row} className="justify-content-center" controlId="peopleScenario">
                                        <Col sm={4}>
                                            <FormControl as="select"
                                                         key="peopleScenario"
                                                         defaultValue={this.state.peopleScenario}
                                                         onChange={this.onSelectChange}>
                                                {this.scenarioOptions()}
                                            </FormControl>
                                        </Col>
                                    </Form.Group>
                                );
                            }
                        })()}

                        <Form.Group as={Row} className="justify-content-center" controlId="dayLength">
                            <Col sm={4}>
                                <FormControl as="select"
                                             key="dayLength"
                                             defaultValue={this.state.dayLength}
                                             onChange={this.onSelectChange}>
                                    {(() => {
                                        let hours = Object.keys(DAYS).map(s => parseInt(s));
                                        hours = hours.sort((a, b) => a - b);
                                        return hours.map(hr => {
                                            return <option key={hr} value={hr}>{hr}-hour day</option>;
                                        });
                                    })()}
                                </FormControl>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="justify-content-center" controlId="simulateButton">
                            <Col sm={4}>
                                <Button variant="primary"
                                        type="button"
                                        className="simulate-button"
                                        onClick={this.updateChart}>Simulate</Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </div>
            </Container>
        );
    }
}

export default WaitTimeInteractive;
