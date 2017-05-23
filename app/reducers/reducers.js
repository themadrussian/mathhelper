import createReducer from '../lib/createReducer'
import * as types from '../actions/types'

export const scoreCount = createReducer(0, {
  [types.PROBLEM_SOLVED](state, action){
    return state + 1;
  },

  [types.PROBLEM_NOT_SOLVED](state, action){
    return ( state ? state - 1 : state );
  },

});

export const problem = createReducer({}, {
  [types.PROBLEM_CREATED](state, action){
    return action.problem;
  }
});

export const answers = createReducer({}, {
  [types.ANSWERS_CREATED](state, action){
    return action.answers;
  }
});

export const solved = createReducer(0, {
  [types.PROBLEM_SOLVED](state, action){
    return state + 1;
  }
});

export const missed = createReducer(0, {
  [types.PROBLEM_NOT_SOLVED](state, action){
    return state + 1;
  }
});

export const seed = createReducer(10, {
  [types.SEED_INCREASED](state, action){
    return state + 10;
  }
});

export const variance = createReducer(10, {

});

export const levelSteps = createReducer(2, {

});

export const dadJoke = createReducer({}, {
  [types.JOKE_FETCHED](state, action){
    console.log(" ===> reducer dadJoke. state: ", state, "action: ", action);
    return action.joke;
  }
});
