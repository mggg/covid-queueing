import React from 'react'
import Alert from 'react-bootstrap/Alert'
import { VictoryChart, VictoryLabel, VictoryLegend, VictoryGroup, VictoryContainer,
        VictoryLine, VictoryArea, VictoryAxis, VictoryScatter } from 'victory'
import memoize from 'fast-memoize'
import { histPercentiles, smooth } from './queue'

/* Styling */
const BLUE = '#4198c8'; // official MGGG blue
const RED = '#d1352b';  // red from Districtr
const GREEN = '#87ca3f'; // lightish green modified from Districtr
const STROKE_WIDTH = 4;
const FONT = "'HK Grotesk', Helvetica, sans-serif";
const MOBILE_WIDTH = 300;

const PERCENTILES = [1, 5, 20, 50, 80, 95, 99];
const BAND_ALPHAS = [0.2, 0.35, 0.52, 0.52, 0.35, 0.2];
const SMOOTH_WINDOW = 15;
const MIN_WAIT = 10;
const MAX_WAIT = 120;

class WaitTimeChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0
        };
        this.getTicks = this.getTicks.bind(this);
        this.updateWidth = this.updateWidth.bind(this);
    }

    bandsData = memoize((hists) => {
        let percentileBands = [];
        let medianXY = [];
        let offset = Math.floor(SMOOTH_WINDOW / 2);
        let maxTime = 0;
        let maxMedianTime = 0;
        let steps = 0;
        let maxStep = 0;
        if (hists !== undefined) {
            let percentiles = hists.map(h => histPercentiles(h, PERCENTILES));
            let percentilesSmoothed = Array(PERCENTILES.length);
            for (let idx = 0; idx < PERCENTILES.length; idx++) {
                let percentileData = percentiles.map(p => p === null ? null : p[idx]);
                let smoothed = smooth(percentileData, SMOOTH_WINDOW);
                percentilesSmoothed[idx] = smoothed;
                if (PERCENTILES[idx] === 50) {
                    steps = smoothed.length;
                    for (let ts = 0; ts < smoothed.length; ts++) {
                        medianXY.push({'x': ts + offset, 'y': smoothed[ts]});
                        maxMedianTime = Math.max(smoothed[ts], maxMedianTime);
                    }
                    maxStep = smoothed.length + offset - 1;
                }
            }
            for (let idx = 0; idx < BAND_ALPHAS.length; idx++) {
                let y0 = percentilesSmoothed[idx];
                let y = percentilesSmoothed[idx + 1];
                let xy = Array(y.length);
                for (let ts = 0; ts < y.length; ts++) {
                    xy[ts] = {'x': ts + offset, 'y': y[ts], 'y0': y0[ts]};
                    maxTime = Math.max(y[ts], maxTime);
                }
                percentileBands.push({'xy': xy, 'alpha': BAND_ALPHAS[idx]});
            }
        }
        return {
            'median': medianXY,
            'percentiles': percentileBands,
            'maxStep': maxStep,
            'steps': steps,
            'maxTime': maxTime,
            'maxMedianTime': maxMedianTime
        };
    }, {cacheLimit: 256});

    getStyles() {
        return {
            timeAxis: {
                axis: { stroke: "black", strokeWidth: 1 },
                ticks: {
                    size: ({ tick }) => {
                        if (this.state.width > MOBILE_WIDTH) {
                            if (tick % 60 === 0) {
                                return 10;
                            } else if (tick % 15 === 0) {
                                return 5;
                            }
                        } else {
                            if (tick % 120 === 0) {
                                return 10;
                            } else if (tick % 30 === 0) {
                                return 5;
                            }
                        }
                        return 0;
                    },
                    stroke: "black",
                    strokeWidth: 1
                },
                tickLabels: {
                    fill: "black",
                    fontFamily: FONT,
                    fontSize: 9
                }
            },
            minutesAxis: {
                axis: { stroke: "black", strokeWidth: 1 },
                ticks: {
                    size: 3,
                    stroke: "black",
                    strokeWidth: 1
                },
                tickLabels: {
                    fill: "black",
                    fontFamily: FONT,
                    fontSize: 9
                }
            },
            maxMedianTimeLine: {
                data: {
                    stroke: "#999",
                    strokeWidth: 0.8,
                    strokeDasharray: "1, 2",
                    strokeLinecap: "round"
                }
            },
            maxMedianTimeLabel: [
                {
                    fill: "black",
                    fontFamily: FONT,
                    fontSize: 7.25
                },
                {
                    fill: "black",
                    fontFamily: FONT,
                    fontSize: 7.25,
                    fontWeight: 500
                }
            ],
            maxMedianTimeScatter: {
                data: {
                    fill: "#f9f9f9"
                }
            },
            axisLabel: {
                fill: "black",
                fontFamily: FONT,
                fontSize: 10,
                fontWeight: 500
            },
            legend: {
                labels: {
                    fill: "black",
                    fontFamily: FONT,
                    fontSize: 10
                }
            }
        };
    }

    updateWidth() {
        let chartWidth = MOBILE_WIDTH;
        if (window.innerWidth >= 992) {
            chartWidth = 625;
        } else if (window.innerWidth >= 768) {
            chartWidth = 475;
        }
        this.setState({'width': chartWidth});
    }

    componentDidMount() {
        this.updateWidth();
        window.addEventListener('resize', this.updateWidth);
    }

    getTicks() {
        if (this.props.startTime !== undefined && this.props.endTime !== undefined) {
            let resMs = 60 * 1000;
            let steps = Math.ceil((this.props.endTime - this.props.startTime) / resMs);
            return [...Array(steps + 10).keys()].map(x => x - 5);
        }
        return [];
    }

    shouldComponentUpdate(nextProps, nextState) {
        return ((this.props.separateStudentsStaff !== nextProps.separateStudentsStaff) ||
                (this.props.peopleHists !== nextProps.peopleHists) ||
                (this.props.studentHists !== nextProps.studentHists) ||
                (this.props.staffHists !== nextProps.staffHists) ||
                (this.state.width !== nextState.width));
    }

    render() {
        const styles = this.getStyles();
        const ticks = this.getTicks();

        // FIXME: 😤😩 This is crying out to be replaced with a reusable 
        // `WaitTimeLine` component that wraps the percentile calculations
        // and the rendering of the error bands. However, it seems that
        // Victory has some weird binding stuff that I don't entirely
        // understand which makes custom components very fragile.
        // This works for now but should be patched up if things
        // get more complicated.
        let peopleData, peopleMedian, peoplePercentiles;
        let studentData, studentMedian, studentPercentiles;
        let staffData, staffMedian, staffPercentiles;
        let maxTime, maxMedianTime, maxStep, steps, unstable;
        if (this.props.separateStudentsStaff === true) {
            studentData = this.bandsData(this.props.studentHists);
            studentMedian = studentData['median'];
            studentPercentiles = studentData['percentiles'];

            staffData = this.bandsData(this.props.staffHists);
            staffMedian = staffData['median'];
            staffPercentiles = staffData['percentiles'];
            maxTime = Math.max(studentData['maxTime'], staffData['maxTime']);
            maxMedianTime = Math.max(studentData['maxMedianTime'],
                                     staffData['maxMedianTime']);
            steps = staffData['steps'];
            maxStep = staffData['maxStep'];
        } else {
            peopleData = this.bandsData(this.props.peopleHists);
            peopleMedian = peopleData['median'];
            peoplePercentiles = peopleData['percentiles'];
            maxTime = peopleData['maxTime'];
            maxMedianTime = peopleData['maxMedianTime'];
            steps = peopleData['steps'];
            maxStep = peopleData['maxStep'];
        }
        maxTime = Math.min(Math.max(maxTime, MIN_WAIT), MAX_WAIT);
        unstable = (maxTime >= MAX_WAIT);
        let maxMedianFormatted = Math.round(maxMedianTime);
        if (maxMedianFormatted === 1) {
            maxMedianFormatted += " minute";
        } else {
            maxMedianFormatted += " minutes";
        }

        // scrolling on mobile:
        // https://github.com/FormidableLabs/victory/issues/1037#issuecomment-623048143
        return (
            <>
            <VictoryChart
                width={this.state.width}
                height={250}
                domain={{y: [0, maxTime]}}
                containerComponent={
                    <VictoryContainer
                      style={{
                        pointerEvents: "auto",
                        userSelect: "auto",
                        touchAction: "auto"
                      }}
                    />
                }
            >
                {(() => {
                    if (this.props.separateStudentsStaff === true) {
                        return [(
                            <VictoryGroup
                              style={{
                                data: { strokeWidth: 3.5 }
                              }}
                            >
                              <VictoryLine
                                style={{
                                  data: { stroke: RED }
                                }}
                                data={studentMedian}
                              />
                            </VictoryGroup>
                        ),
                        studentPercentiles.map(xy => {
                                return (
                                    <VictoryGroup
                                      style={{
                                        data: { strokeWidth: 0, fillOpacity: xy['alpha'] }
                                      }}
                                    >
                                      <VictoryArea
                                        style={{
                                          data: { fill: RED, stroke: RED }
                                        }}
                                        data={xy['xy']}
                                      />
                                    </VictoryGroup>
                                );
                            }),
                         (<VictoryGroup
                              style={{
                                data: { strokeWidth: STROKE_WIDTH }
                              }}
                            >
                              <VictoryLine
                                style={{
                                  data: { stroke: GREEN }
                                }}
                                data={staffMedian}
                              />
                            </VictoryGroup>
                        ),
                        staffPercentiles.map(xy => {
                                return (
                                    <VictoryGroup
                                      style={{
                                        data: { strokeWidth: 0, fillOpacity: xy['alpha'] }
                                      }}
                                    >
                                      <VictoryArea
                                        style={{
                                          data: { fill: GREEN, stroke: GREEN }
                                        }}
                                        data={xy['xy']}
                                      />
                                    </VictoryGroup>
                                );
                            }),
                            (<VictoryLegend x={this.state.width / 2 - 60} y={14}
                              orientation="horizontal"
                              gutter={20}
                              style={styles.legend}
                              colorScale={[ RED, GREEN ]}
                              data={[
                                { name: "Students" }, { name: "Staff" }
                              ]}
                            />)
                        ]

                    } else {
                        return [(
                            <VictoryGroup
                              style={{
                                data: { strokeWidth: STROKE_WIDTH }
                              }}
                            >
                              <VictoryLine
                                style={{
                                  data: { stroke: BLUE }
                                }}
                                data={peopleMedian}
                              />
                            </VictoryGroup>
                        ),
                        peoplePercentiles.map(xy => {
                                return (
                                    <VictoryGroup
                                      style={{
                                        data: { strokeWidth: 0, fillOpacity: xy['alpha'] }
                                      }}
                                    >
                                      <VictoryArea
                                        style={{
                                          data: { fill: BLUE, stroke: BLUE }
                                        }}
                                        data={xy['xy']}
                                      />
                                    </VictoryGroup>
                                );
                            })]
                        }
                })()}
                <VictoryLine style={styles.maxMedianTimeLine}
                             data={[
                                    {x: 0, y: maxMedianTime},
                                    {x: maxStep, y: maxMedianTime}
                             ]}
                />
                <VictoryScatter
                  size={0}
                  data={[{ x: steps + 10, y: maxMedianTime }]}
                  style={styles.maxMedianTimeScatter}
                  labels={() => [
                      this.state.width > MOBILE_WIDTH ? "maximum wait" : "max. wait",
                      maxMedianFormatted
                  ]}
                  labelComponent={
                    <VictoryLabel
                        textAnchor="start"
                        style={styles.maxMedianTimeLabel}
                        dx={9}
                        dy={11}
                    />
                  }
                />
                <VictoryLabel x={this.state.width / 2 - 24} y={240}
                              text="Arrival time"
                              style={styles.axisLabel}
                />
                <VictoryLabel x={42} y={24}
                              text="Wait"
                              style={styles.axisLabel}
                />
                <VictoryLabel x={33} y={36}
                              text="(minutes)"
                              style={styles.axisLabel}
                />
                <VictoryAxis
                    standalone={false}
                    style={styles.timeAxis}
                    tickValues={ticks}
                    tickFormat={
                      (x) => {
                          if ((x % 60 === 0 && this.state.width > MOBILE_WIDTH) ||
                              (x % 120 === 0)) {
                              let date = new Date(new Date(this.props.startTime).getTime() +
                                                  (x * 60 * 1000));
                              let formatted = date.toLocaleTimeString('en-US',
                                  { hour: '2-digit', minute: '2-digit', 'hour12': false });
                              // strip leading zeros: https://stackoverflow.com/a/8276474
                              return formatted.replace(/^0+/, '');
                          }
                          return '';
                      }
                    }
              />
              <VictoryAxis dependentAxis
                orientation="left"
                standalone={false}
                style={styles.minutesAxis}
              />
            </VictoryChart>
            {(() => {
                if (unstable) {
                    return (
                        <Alert key="unstable" variant="danger">
                            <strong>This queue is unstable (wait times exceed {MAX_WAIT / 60} hours).</strong> Add more testing lines or reduce the number of people.
                        </Alert>
                    );
                }
            })()}
            </>
        );
    }
}

export default WaitTimeChart;
