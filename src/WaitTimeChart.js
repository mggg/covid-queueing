import React from 'react'
import Alert from 'react-bootstrap/Alert'
import { VictoryChart, VictoryLabel, VictoryLegend, VictoryGroup,
        VictoryLine, VictoryArea, VictoryAxis } from 'victory'
import { histPercentiles, smooth } from './queue'

/* Styling */
const BLUE = '#4198c8'; // official MGGG blue
const RED = '#d1352b';  // red from Districtr
const GREEN = '#87ca3f'; // lightish green modified from Districtr
const STROKE_WIDTH = 4;
const FONT = "'HK Grotesk', Helvetica, sans-serif";

const PERCENTILES = [1, 5, 20, 50, 80, 95, 99];
const MAX_P = 99;
const BAND_ALPHAS = [0.2, 0.35, 0.52, 0.52, 0.35, 0.2];
const SMOOTH_WINDOW = 15;
const MIN_WAIT = 10;
const MAX_WAIT = 120;

class WaitTimeChart extends React.Component {
    constructor(props) {
        super(props);
        this.getTicks = this.getTicks.bind(this);
    }

    bandsData(hists) {
        let percentileBands = [];
        let medianXY = [];
        let offset = Math.floor(SMOOTH_WINDOW / 2);
        let maxTime = 0;
        if (hists !== undefined) {
            let percentiles = hists.map(h => histPercentiles(h, PERCENTILES));
            let percentilesSmoothed = Array(PERCENTILES.length);
            for (let idx = 0; idx < PERCENTILES.length; idx++) {
                let percentileData = percentiles.map(p => p[idx]);
                let smoothed = smooth(percentileData, SMOOTH_WINDOW);
                percentilesSmoothed[idx] = smoothed;
                if (PERCENTILES[idx] === 50) {
                    for (let ts = 0; ts < smoothed.length; ts++) {
                        medianXY.push({'x': ts + offset, 'y': smoothed[ts]});
                    }
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
            'maxTime': maxTime
        };
    }

    getStyles() {
        return {
            timeAxis: {
                axis: { stroke: "black", strokeWidth: 1 },
                ticks: {
                    size: ({ tick }) => {
                        if (tick % 60 === 0) {
                            return 10;
                        } else if (tick % 15 === 0) {
                            return 5;
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

    getTicks() {
        if (this.props.startTime !== undefined && this.props.endTime !== undefined) {
            let resMs = 60 * 1000;
            let steps = Math.ceil((this.props.endTime - this.props.startTime) / resMs);
            return [...Array(steps + 10).keys()].map(x => x - 5);
        }
        return [];
    }

    render() {
        const styles = this.getStyles();
        const ticks = this.getTicks();
        console.log("timeAxis:",  styles.timeAxis);

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
        let maxTime, unstable;
        if (this.props.separateStudentsStaff === true) {
            studentData = this.bandsData(this.props.studentHists);
            studentMedian = studentData['median'];
            studentPercentiles = studentData['percentiles'];

            staffData = this.bandsData(this.props.staffHists);
            staffMedian = staffData['median'];
            staffPercentiles = staffData['percentiles'];
            maxTime = Math.max(studentData['maxTime'], staffData['maxTime']);
        } else {
            peopleData = this.bandsData(this.props.peopleHists);
            peopleMedian = peopleData['median'];
            peoplePercentiles = peopleData['percentiles'];
            maxTime = peopleData['maxTime'];
        }
        maxTime = Math.min(Math.max(maxTime, MIN_WAIT), MAX_WAIT);
        unstable = (maxTime >= MAX_WAIT);

        return (
            <>
            {(() => {
                if (unstable) {
                    return (
                        <Alert key="unstable" variant="danger">
                            <strong>This queue is unstable (wait times exceed {MAX_WAIT / 60} hours).</strong> Add more testing lines or reduce the number of people.
                        </Alert>
                    );
                }
            })()}
            <VictoryChart width={600} height={250} domain={{y: [0, maxTime]}}>
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
                            (<VictoryLegend x={235} y={10}
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
                <VictoryLabel x={275} y={240}
                              text="Arrival time"
                              style={styles.axisLabel}
                />
                <VictoryLabel x={42} y={26}
                              text="Wait"
                              style={styles.axisLabel}
                />
                <VictoryLabel x={33} y={38}
                              text="(minutes)"
                              style={styles.axisLabel}
                />
                <VictoryAxis
                    standalone={false}
                    style={styles.timeAxis}
                    tickValues={ticks}
                    tickFormat={
                      (x) => {
                          if (x % 60 === 0) {
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
            </>
        );
    }
}

export default WaitTimeChart;
