import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import ModelParam from './ModelParam'
import { VictoryChart, VictoryGroup, VictoryArea } from 'victory'
import { simulateMdc, histPercentiles } from './queue'

/* --- Start constants --- */
/* Monte Carlo parameters */
const N_RUNS = 200; // number of Monte Carlo simulations
const RES = 1;      // Simulation resolution (minutes per timestep)

/* Day lengths */
const DAYS = {
    8: {
        start: new Date(2020, 1, 1, 8, 0, 0),
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
const MIN_TIME = new Date(Math.min.apply(Object.values(DAYS).map(x => x['start'])));
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
};
const DEFAULT_SCENARIO = 'Uniform demand';
/* --- End constants --- */

class WaitTimeChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numPeople: 5000,
            numStudents: 4000,
            numStaff: 1000,
            numPeopleTestingStations: 10,
            numStudentTestingStations: 8,
            numStaffTestingStations: 2,
            minutesPerTest: 5,
            peopleScenario: DEFAULT_SCENARIO,
            studentScenario: DEFAULT_SCENARIO,
            staffScenario: DEFAULT_SCENARIO,
            dayLength: DEFAULT_DAY,
            separateStudentsStaff: false
        };
    }

    /*
     * generic `onChange` handler:
     * https://medium.com/front-end-weekly/react-quick-tip-easy-data-
     * binding-with-a-generic-onchange-handler-fb0254a7094e
     */
    onCheckChange = e => this.setState({ [e.target.name]: e.target.checked });
    onParamChange = e => this.setState({ [e.target.controlId]: Math.round(e.target.value) });
    onSelectChange = e => this.setState({ [e.target.controlId]: e.target.value });


    updateChart() {
        alert("ello");
    }

    scenarioOptions() {
        let scenarios = Object.keys(SCENARIOS).sort().reverse();
        return scenarios.map(s => {
            return <option key={s} value={s}>{s}</option>;
        });
    }

    render() {
        console.log(simulateMdc(Array(100).fill(30),
                                this.state.numPeopleTestingStations,
                                this.state.minutesPerTest,
                                N_RUNS));

        return (
            <Container className="wait-time-interactive">
                <div className="wait-time-chart">
                   <VictoryChart width={800} height={400}>
                        <VictoryGroup
                          style={{
                            data: { strokeWidth: 3, fillOpacity: 0.4 }
                          }}
                        >
                          <VictoryArea
                            style={{
                              data: { fill: "cyan", stroke: "cyan" }
                            }}
                            data={[
                              { x: 1, y: 2 },
                              { x: 2, y: 3 },
                              { x: 3, y: 5 },
                              { x: 4, y: 4 },
                              { x: 5, y: 7 }
                            ]}
                          />
                          <VictoryArea
                            style={{
                              data: { fill: "magenta", stroke: "magenta" }
                            }}
                            data={[
                              { x: 1, y: 3 },
                              { x: 2, y: 2 },
                              { x: 3, y: 6 },
                              { x: 4, y: 2 },
                              { x: 5, y: 6 }
                            ]}
                          />
                        </VictoryGroup>
                    </VictoryChart>
                </div>

                <div className="wait-time-params">
                    <Form>
                        <Form.Group as={Row} className="justify-content-center" controlId="separateStudentsStaff">
                            <Col sm={4}>
                                <Form.Check type="checkbox"
                                            name="separateStudentsStaff"
                                            label="Separate students and staff"
                                            checked={this.state.separateStudentsStaff}
                                            onChange={this.onCheckChange} />
                            </Col>
                        </Form.Group>
                        {(() => {
                            if (this.state.separateStudentsStaff) {
                                return (
                                    <>
                                    <ModelParam controlId="numStudents"
                                                defaultValue={this.state.numStudents}
                                                onChange={this.onParamChange}
                                                label="students" />
                                    <ModelParam controlId="numStaff"
                                                defaultValue={this.state.numStaff}
                                                onChange={this.onParamChange}
                                                label="staff" />
                                    <ModelParam controlId="numStudentTestingStations"
                                                defaultValue={this.state.numStudentTestingStations}
                                                onChange={this.onParamChange}
                                                label="student testing stations" />
                                    <ModelParam controlId="numStaffTestingStations"
                                                defaultValue={this.state.numStaffTestingStations}
                                                onChange={this.onParamChange}
                                                label="staff testing stations" />
                                    </>
                                );
                            } else {
                                return (
                                    <>
                                    <ModelParam controlId="numPeople"
                                                defaultValue={this.state.numStudents}
                                                onChange={this.onParamChange}
                                                label="people" />
                                    <ModelParam controlId="numPeopleTestingStations"
                                                defaultValue={this.state.numPeopleTestingStations}
                                                onChange={this.onParamChange}
                                                label="testing stations" />
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
                                    <Form.Group as={Row} controlId="studentScenario" onChange={this.onSelectChange}>
                                        <Col sm={4} />
                                        <Col sm={4}>
                                            <FormControl as="select" defaultValue={this.state.studentScenario}>
                                                {this.scenarioOptions()}
                                            </FormControl>
                                        </Col>
                                        <Form.Label column sm={3}>(students)</Form.Label>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="staffScenario">
                                        <Col sm={4} />
                                        <Col sm={4}>
                                            <FormControl as="select" defaultValue={this.state.staffScenario}>
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
                                            <FormControl as="select" defaultValue={this.state.peopleScenario}>
                                                {this.scenarioOptions()}
                                            </FormControl>
                                        </Col>
                                    </Form.Group>
                                );
                            }
                        })()}

                        <Form.Group as={Row} className="justify-content-center" controlId="dayLength">
                            <Col sm={4}>
                                <FormControl as="select" defaultValue={this.state.dayLength}>
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
                                        type="submit"
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

export default WaitTimeChart;
