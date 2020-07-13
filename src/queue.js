/**
 * @file Monte Carlo simulation of an M/D/c queue with variable arrival rates.
 * @author Parker J. Rule (@pjrule)
 */

function poisson(lambda) {
    /* Knuth's Poisson sampling algorithm (slow for large λ). */
    let L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    while (p > L) {
        p *= Math.random();
        k++;
    }
    return k - 1;
}

export const smooth = function(signal, win) {
    let offset = Math.floor(win / 2);
    let smoothLength = signal.length - (2 * offset);
    let smoothed = Array(smoothLength);
    for (let ts = 0; ts < smoothLength; ts++) {
        let sub = signal.slice(ts, ts + (2 * offset) + 1).filter(x => x !== null);
        smoothed[ts] = sub.reduce((a, b) => parseInt(a) + parseInt(b)) / sub.length;
    }
    return smoothed;
}

export const normalizedLambdas = function(numPeople, demandSchedule, startTime, endTime, res) {
    let resMs = 60 * 1000 * res;
    let steps = Math.ceil((endTime - startTime) / resMs);
    let currTime = startTime;
    let demand = Array(steps);
    let scheduleIdx = 0;
    for (let ts = 0; ts < steps; ts++) {
        while(scheduleIdx < demandSchedule.length - 1 && 
              demandSchedule[scheduleIdx + 1]['start'] <= currTime) {
            scheduleIdx++;
        }
        demand[ts] = demandSchedule[scheduleIdx]['demand']
        currTime = new Date(new Date(currTime).getTime() + resMs);
    }
    let totalDemand = demand.reduce((a, b) => a + b);
    let scale = numPeople / totalDemand;
    let normalized = demand.map(d => d * scale);
    return normalized;
}

export const histPercentiles = function(hist, p) {
    /**
     * Retrieves the values at (approximately) the specified percentiles
     * in a histogram.
     */
    if (Object.keys(hist).length === 0) {
        return null; // an empty histogram has no percentiles
    } 

    p.sort((a, b) => a - b);
    let results = Array(p.length).fill(0);
    let histKeys = Object.keys(hist).sort((a, b) => a - b);
    let histIdx = 0;
    let binLoRank = 0;
    let binHiRank = hist[histKeys[0]] - 1;
    let histSize = Object.values(hist).reduce((a, b) => a + b);
    for (let idx = 0; idx < p.length; idx++) {
        let nearestRank = Math.max(0, Math.ceil(histSize * p[idx] / 100) - 1);
        while (binHiRank < nearestRank && histIdx < histKeys.length - 1) {
            binLoRank = binHiRank + 1;
            binHiRank = binLoRank + hist[histKeys[histIdx]] - 1;
            histIdx++;
        }
        results[idx] = histKeys[histIdx];
    }
    return results;
}


export const simulateMdc = function(lambdas, numStations, stepsPerTest, runs) {
    /**
     * Simulates an M/D/c queue with variable arrival rates.
     *
     * @param TODO
     * @return TODO
     */
    let steps = lambdas.length;
    let waitTimeHists = Array(steps).fill(null).map((el, i) => new Map());
    for (let run = 0; run < runs; run++) {
        let arrivals = lambdas.map(poisson);
        let arrivalTs = 0;
        let stations = Array(numStations).fill(-1);
        for (let serviceTs = 0; arrivalTs < steps; serviceTs++) {
            for (let s = 0; s < numStations; s++) {
                // Fill as many stations as possible at each timestep.
                while (arrivals[arrivalTs] === 0 && arrivalTs < steps) {
                    // Once all people who have arrived at a particular timestep
                    // have been serviced, move to the people who arrived in the
                    // next timestep.
                    arrivalTs++;
                }
                if (arrivalTs > serviceTs || arrivalTs >= steps) {
                    // Can't fulfill demand before it shows up.
                    break;
                }
                if (stations[s] <= serviceTs) {
                    // The current station is no longer being used.
                    // Add a new person.
                    stations[s] = serviceTs + stepsPerTest;
                    let waitTime = serviceTs - arrivalTs;
                    if (waitTime in waitTimeHists[arrivalTs]) {
                        waitTimeHists[arrivalTs][waitTime] += 1;
                    } else {
                        waitTimeHists[arrivalTs][waitTime] = 1;
                    }
                    arrivals[arrivalTs]--;
                }
            }
        }
    }
    return waitTimeHists;
}
