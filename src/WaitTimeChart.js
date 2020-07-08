import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import ModelParam from './ModelParam'
import { VictoryChart, VictoryGroup, VictoryArea } from 'victory'

const N_RUNS = 500; /* number of Monte Carlo simulations */
const RES = 1;      /* Simulation resolution in minutes */
const SCENARIOS = {
};

class WaitTimeChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numStudents: 4000,
            numStaff: 1000,
            numUnifiedTestingStations: 10,
            numStudentTestingStations: 8,
            numStaffTestingStations: 2,
            minutesPerTest: 5,
            separateStudentsStaff: false
        };
    }

    /*
     * generic `onChange` handler:
     * https://medium.com/front-end-weekly/react-quick-tip-easy-data-
     * binding-with-a-generic-onchange-handler-fb0254a7094e
     */
    onCheckChange = e => this.setState({ [e.target.name]: e.target.checked })
    onFormChange = e => this.setState({ [e.target.controlId]: e.target.value })

    simulate() {
    }

    updateChart() {
        alert("ello");
    }

    render() {
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
                        <ModelParam controlId="numStudents"
                                    defaultValue={this.state.numStudents}
                                    onChange={this.onFormChange}
                                    label="students" />
                        <ModelParam controlId="numStaff"
                                    defaultValue={this.state.numStaff}
                                    onChange={this.onFormChange}
                                    label="staff" />

                        {(() => {
                            if (this.state.separateStudentsStaff) {
                                return (
                                    <>
                                    <ModelParam controlId="numStudentTestingStations"
                                                defaultValue={this.state.numStudentTestingStations}
                                                onChange={this.onFormChange}
                                                label="student testing stations" />
                                    <ModelParam controlId="numStaffTestingStations"
                                                defaultValue={this.state.numStaffTestingStations}
                                                onChange={this.onFormChange}
                                                label="staff testing stations" />
                                    </>
                                );
                            } else {
                                return (
                                    <ModelParam controlId="numUnifiedTestingStations"
                                                defaultValue={this.state.numUnifiedTestingStations}
                                                onChange={this.onFormChange}
                                                label="testing stations" />
                                );
                            }
                        })()}

                        <ModelParam controlId="minutesPerTest"
                                    defaultValue={this.state.minutesPerTest}
                                    onChange={this.onFormChange}
                                    label="minutes per test" />
                        <Form.Group as={Row} className="justify-content-center" controlId="scenario">
                            <Col sm={4}>
                                <FormControl as="select">
                                    <option>Uniform demand</option>
                                    <option>Spikes around mealtimes</option>
                                </FormControl>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="justify-content-center" controlId="dayLength">
                            <Col sm={4}>
                                <FormControl as="select">
                                    <option>8-hour day</option>
                                    <option>10-hour day</option>
                                    <option>12-hour day</option>
                                    <option>14-hour day</option>
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
