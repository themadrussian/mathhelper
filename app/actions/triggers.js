import * as Actions from './actions'

export function fetchJoke() {
  return (dispatch) => {
    fetch('https://icanhazdadjoke.com/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      // console.log("my joke", responseJson);
      dispatch(Actions.jokeFetched(responseJson));
    })
    .catch((error) => {
      console.error("Joke fetch error:", error);
    });
  }
}

export function fetchCatJoke() {
  // console.log("===> inside fetchCatJoke");
  return (dispatch) => {
    fetch('https://catfact.ninja/fact?max_length=140', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      // console.log("my cat fact", responseJson);
      // if (responseJson.success) {
        dispatch(Actions.catFactFetched(responseJson));
      // }
    })
    .catch((error) => {
      console.error("Cat fact fetch error:", error);
    });
  }
}

export function showReward(apppress = 0) {
  return (dispatch, getState ) => {
    if (apppress) {// this came from the ToolBar, simple repeat
      if (getState().enableCatFact || getState().enableDadJokes) {
        //if one of them is true -- show the reward
        dispatch(Actions.rewardToggled());
      }

    } else {
      // decide whather to show the reward or not
      if (getState().stepsCount%getState().rewardFrequency === 0
         || (getState().solved > 0
            && getState().solved%getState().levelSteps === 0
            && getState().previousStepSolved)) {
        // first display a reward.
        dispatch(Actions.rewardToggled());
        dispatch(Actions.nextRewardSet());
        dispatch(Actions.jokeFetched());
        dispatch(Actions.catFactFetched());

        // // then fetch the next one
        // if (getState().jokeOrFact) {
        //   // true is joke
        //   if (getState().enableDadJokes) dispatch(Actions.jokeFetched());
        // } else {
        //   // false is a cat fact
        //   if (getState().enableCatFact) dispatch(Actions.catFactFetched());
        // }
      }
    }
  }
}

export function createProblem() {
  return (dispatch, getState ) => {
    // first run -- pre-fetch both rewards
    if (getState().stepsCount === 0) {
      // console.log("===> First run. Fetching both");
      dispatch(Actions.jokeFetched());
      dispatch(Actions.catFactFetched());
    };

    // increase seed every 'levelSteps' solved problems
    // make sure previousStepSolved is true (to stop perpetual jokes)
    if ( getState().solved > 0
      && getState().solved%getState().levelSteps === 0
      && getState().previousStepSolved) {

      dispatch(Actions.seedIncreased());
      // console.log("increasing seed to: ", getState().seed);
      // getState().jokeOrFact ? dispatch(Actions.jokeFetched()) : dispatch(Actions.catFactFetched());
      // dispatch(Actions.rewardToggled());
    }

    // _this.showReward();

    let antiLoop = 0;

    function uniqueNumber(seed = 100,variance = 100) {
      antiLoop++;
      if (antiLoop > 30 ) {
        antiLoop = 0;
        variance++;
        console.log("Got stuck. increasing variance by 1 to:", variance);
      }

      let newNumber = seed - variance + Math.floor((Math.random()*variance) + 1);

      if (newNumber < 0 ) {
        // console.log("Caught a negative. Fixing. :", newNumber);
        newNumber = Math.abs(newNumber);
      }

      if (getState().allNumbers.indexOf(newNumber) === -1 ) {
        // console.log("newNumber: ", newNumber, "index: ", getState().allNumbers.indexOf(newNumber));
        // not there, yes newNumber is unique
        getState().allNumbers.push(newNumber);
      } else {
        // hit! we already have newNumber in allNumbers array. Get a new one.
        // console.log("got a duplicate! ", newNumber, " already exists!");
        newNumber = uniqueNumber(seed, variance);
      }
      // console.log("Generated unique number:", newNumber);
      return newNumber;
    }

    function correctAnswer(myProblem){
      let myString = myProblem.members[0] + "  " + myProblem.operation[0] + " " + myProblem.members[1];
      if (getState().allNumbers.indexOf(eval(myString)) === -1) {
        // don't push answer into allNumbers more than once
        getState().allNumbers.push(eval(myString));
      }
      return eval(myString);
    }

    let myProblem = {
      operation: [ "+" ],
      members: [
        //uniqueNumber (staring, variance), controls how large the numbers are
        //heuristic tests showed that the first two members need
        //both variance and seed to be the same number for better problems.
        uniqueNumber(getState().seed,getState().seed),
        uniqueNumber(getState().seed,getState().seed)
      ],
    };

    let myAnswers = [
      {
        value: correctAnswer(myProblem),
        correct: true
      },
      {
        value: uniqueNumber(correctAnswer(myProblem),getState().variance),
        correct: false
      },
      {
        value: uniqueNumber(correctAnswer(myProblem),getState().variance),
        correct: false
      }
    ]

    console.log("correct answer: ", myAnswers[0].value);

    // randomize answers positions
    myAnswers.sort( () => Math.random()*2 - 1 );

    // console.log("===> getState.scoreCount", getState().scoreCount);
    dispatch(Actions.problemCreated(myProblem));
    dispatch(Actions.answersCreated(myAnswers));
  }
}
