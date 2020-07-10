import React from 'react'
import { VictoryChart, VictoryLabel, VictoryLegend, VictoryGroup, VictoryLine, VictoryArea } from 'victory'
import { histPercentiles, smooth } from './queue'

/* Styling */
const BLUE = '#4198c8'; // official MGGG blue
const RED = '#d1352b';  // red from Districtr
const GREEN = '#87ca3f'; // lightish green modified from Districtr
const STROKE_WIDTH = 4;

const PERCENTILES = [1, 5, 20, 50, 80, 95, 99];
const BAND_ALPHAS = [0.2, 0.35, 0.52, 0.52, 0.35, 0.2];
const SMOOTH_WINDOW = 15;

class WaitTimeChart extends React.Component {
    bandsData(hists) {
        let percentileBands = [];
        let medianXY = [];
        let offset = Math.floor(SMOOTH_WINDOW / 2);
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
                }
                percentileBands.push({'xy': xy, 'alpha': BAND_ALPHAS[idx]});
            }
        }
        return {'median': medianXY, 'percentiles': percentileBands};
    }

    render() {
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
        if (this.props.separateStudentsStaff === true) {
            studentData = this.bandsData(this.props.studentHists);
            studentMedian = studentData['median'];
            studentPercentiles = studentData['percentiles'];

            staffData = this.bandsData(this.props.staffHists);
            staffMedian = staffData['median'];
            staffPercentiles = staffData['percentiles'];
        } else {
            peopleData = this.bandsData(this.props.peopleHists);
            peopleMedian = peopleData['median'];
            peoplePercentiles = peopleData['percentiles'];
        }

        return (
            <VictoryChart width={600} height={250}>
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
                            (<VictoryLegend x={50} y={10}
                              orientation="horizontal"
                              gutter={20}
                              style={{ border: { stroke: "black" } }}
                              colorScale={[ "navy", "blue", "cyan" ]}
                              data={[
                                { name: "One" }, { name: "Two" }, { name: "Three" }
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
                <VictoryLabel x={355} y={388} text="Arrival time" />
                <VictoryLabel x={5} y={180} angle={270} text="Wait time (minutes)" />
            </VictoryChart>
        );
    }
}

export default WaitTimeChart;
