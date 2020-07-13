import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import FormControl from 'react-bootstrap/FormControl';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ModelParam from './ModelParam';
import WaitTimeChart from './WaitTimeChart';
import { simulateMdc, normalizedLambdas } from './queue';

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
function mealtimes(increase) {
    return [
        // peak breakfast period: 8:30 a.m. – 9:30 a.m.
        {'start': MIN_TIME, 'demand': 1},
        {'start': new Date(2020, 1, 1, 8, 30, 0), 'demand': increase},
        {'start': new Date(2020, 1, 1, 9, 30, 0), 'demand': 1},
        // peak lunch period: 11:30 a.m. – 12:30 a.m.
        {'start': new Date(2020, 1, 1, 11, 30, 0), 'demand': increase},
        {'start': new Date(2020, 1, 1, 12, 30, 0), 'demand': 1},
        // peak dinner period: 5:00 p.m. – 6:00 p.m.
        {'start': new Date(2020, 1, 1, 17, 0, 0), 'demand': increase},
        {'start': new Date(2020, 1, 1, 18, 0, 0), 'demand': 1},
    ]
}

const SCENARIOS = {
    'Uniform demand': [
        {'start': MIN_TIME, 'demand': 1}
    ],
    'Mealtime rush hours (3x increase)': mealtimes(3),
    'Mealtime rush hours (5x increase)': mealtimes(5),
    'Mealtime rush hours (7x increase)': mealtimes(7),
};
const DEFAULT_SCENARIO = 'Mealtime rush hours (3x increase)';

const DEFAULT_PARAMS = {
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
    dayLength: DEFAULT_DAY
};

/* --- End constants --- */

const ParamSchema = Yup.object().shape({
    numStudents: Yup.number()
            .min(25, "Must test at least 25 students.")
            .max(20000, "Only 20,000 students allowed per day.")
            .integer("Number of students must be an integer.")
            .required("Number of students is required."),
    numStaff: Yup.number()
            .min(25, "Must test at least 25 staff members.")
            .max(20000, "Only 20,000 staff members allowed per day.")
            .integer("Number of staff members must be an integer.")
            .required("Number of staff members is required."),
    numPeople: Yup.number()
            .min(50, "Must test at least 50 people.")
            .max(40000, "Only 40,000 people allowed per day.")
            .integer("Number of people must be an integer.")
            .required("Number of people is required."),
    numStudentTestingStations: Yup.number()
            .min(1, "Must have at least one student testing line.")
            .max(500, "Only 500 student testing lines allowed.")
            .integer("Number of student testing lines must be an integer.")
            .required("Number of student testing lines is required."),
    numStaffTestingStations: Yup.number()
            .min(1, "Must have at least one staff testing line.")
            .max(500, "Only 500 staff testing lines allowed.")
            .integer("Number of staff testing lines must be an integer.")
            .required("Number of staff testing lines is required."),
    numPeopleTestingStations: Yup.number()
            .min(1, "Must have at least one testing line.")
            .max(1000, "Only 1,000 testing lines allowed.")
            .integer("Number of testing lines must be an integer.")
            .required("Number of testing lines is required."),
    minutesPerTest: Yup.number()
            .min(1, "A test should take at least one minute.")
            .max(30, "A test should take at most 30 minutes.")
            .round()
            .required("Must specify test length.")
});

class WaitTimeInteractive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...DEFAULT_PARAMS,
            separateStudentsStaff: false,
            simRunning: false
        };
        this.updateChart = this.updateChart.bind(this);
        this.onSeparationChange = this.onSeparationChange.bind(this);
        this.onParamChange = this.onParamChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
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
        this.setState({ [e.target.id]: e.target.value });
    }

    componentDidMount() {
        this.updateChart();
    }

    handleFormSubmit(values, actions) {
        // TODO: The progress bar still doesn't show up. :(
        actions.setSubmitting(true);
        this.setState({...values, 'simRunning': true}, () => {
            this.updateChart().then(() => {
                this.setState({'simRunning': false});
            });
        });
        actions.setSubmitting(false);
    }

    updateChart() {
        return new Promise((resolve, reject) => {
            let dayLength = parseInt(this.state.dayLength);
            let start = DAYS[dayLength]['start'];
            let end = DAYS[dayLength]['end'];
            let testLength = parseInt(this.state.minutesPerTest);
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
            this.setState({'startTime': start, 'endTime': end});
            resolve();
        });
    }

    scenarioOptions() {
        let scenarios = Object.keys(SCENARIOS).sort();
        return scenarios.map(s => {
            return <option key={s} value={s}>{s}</option>;
        });
    }

    render() {
        // NOTE: The state of the separateStudentsStaff checkbox is handled
        // separately from the rest of the form.
        return (
            <Container className="wait-time-interactive">
                <div className="wait-time-chart">
                    {(() => {
                        if (this.state.simRunning) {
                            return (
                                <div className="wait-time-progress">
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
                    <Formik validationSchema={ParamSchema}
                            initialValues={DEFAULT_PARAMS}
                            onSubmit={this.handleFormSubmit}>
                        {({
                            handleSubmit,
                            handleChange,
                            values,
                            touched,
                            isValid,
                            errors,
                            isSubmitting
                        }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group as={Row} className="justify-content-center" controlId="separateStudentsStaff">
                                <Col md={4}>
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
                                        <Row>
                                            <Col md={4} />
                                            <Col md={4} className="demand-label">
                                                <label>Students</label>
                                            </Col>
                                        </Row>
                                        <ModelParam controlId="numStudents"
                                                    value={values.numStudents}
                                                    onChange={handleChange}
                                                    label="per day"
                                                    errors={errors.numStudents}
                                        />
                                        <ModelParam controlId="numStudentTestingStations"
                                                    value={values.numStudentTestingStations}
                                                    onChange={handleChange}
                                                    label="testing lines"
                                                    errors={errors.numStudentTestingStations}
                                        />
                                        <Form.Group as={Row} controlId="studentScenario">
                                            <Col md={4} />
                                            <Col md={4}>
                                                <FormControl as="select"
                                                             key="studentScenario"
                                                             value={values.studentScenario}
                                                             onChange={handleChange}>
                                                    {this.scenarioOptions()}
                                                </FormControl>
                                            </Col>
                                        </Form.Group>

                                        <Row>
                                            <Col md={4} />
                                            <Col md={4} className="demand-label">
                                                <label>Staff</label>
                                            </Col>
                                        </Row>
                                        <ModelParam controlId="numStaff"
                                                    value={values.numStaff}
                                                    onChange={handleChange}
                                                    label="per day"
                                                    errors={errors.numStaff}
                                        />
                                        <ModelParam controlId="numStaffTestingStations"
                                                    value={values.numStaffTestingStations}
                                                    onChange={handleChange}
                                                    label="testing lines"
                                                    errors={errors.numStaffTestingStations}
                                        />
                                        <Form.Group as={Row} controlId="staffScenario">
                                            <Col md={4} />
                                            <Col md={4}>
                                                <FormControl as="select"
                                                             key="staffScenario"
                                                             value={values.staffScenario}
                                                             onChange={handleChange}>
                                                    {this.scenarioOptions()}
                                                </FormControl>
                                            </Col>
                                        </Form.Group>
                                        </>
                                    );
                                } else {
                                    return (
                                        <>
                                        <Row>
                                            <Col md={4} />
                                            <Col md={4} className="demand-label">
                                                <label>Demand</label>
                                            </Col>
                                        </Row>
                                        <ModelParam controlId="numPeople"
                                                    value={values.numPeople}
                                                    onChange={handleChange}
                                                    label="people per day"
                                                    errors={errors.numPeople}
                                        />
                                        <ModelParam controlId="numPeopleTestingStations"
                                                    value={values.numPeopleTestingStations}
                                                    onChange={handleChange}
                                                    label="testing lines"
                                                    errors={errors.numPeopleTestingStations}
                                        />
                                        <Form.Group as={Row} className="justify-content-center" controlId="peopleScenario">
                                            <Col md={4}>
                                                <FormControl as="select"
                                                             key="peopleScenario"
                                                            value={values.peopleScenario}
                                                             onChange={handleChange}>
                                                    {this.scenarioOptions()}
                                                </FormControl>
                                            </Col>
                                        </Form.Group>
                                        </>
                                    );
                                }
                            })()}

                            <Row>
                                <Col md={4} />
                                <Col md={4} className="ops-label">
                                    <label>Operations</label>
                                </Col>
                            </Row>
                            <ModelParam controlId="minutesPerTest"
                                        value={values.minutesPerTest}
                                        onChange={handleChange}
                                        label="minutes per test"
                                        errors={errors.minutesPerTest}
                            />

                            <Form.Group as={Row} className="justify-content-center" controlId="dayLength">
                                <Col md={4}>
                                    <FormControl as="select"
                                                 key="dayLength"
                                                 value={values.dayLength}
                                                 onChange={handleChange}>
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
                                <Col md={4}>
                                    <Button variant="primary"
                                            type="submit"
                                            className="simulate-button"
                                            disabled={Object.entries(errors).length > 0 || isSubmitting || this.state.simRunning}>
                                        {this.state.simRunning ? "Simulating..." : "Simulate"}
                                    </Button>
                                </Col>
                            </Form.Group>
                        </Form>
                        )}
                    </Formik>
                </div>
            </Container>
        );
    }
}

export default WaitTimeInteractive;
