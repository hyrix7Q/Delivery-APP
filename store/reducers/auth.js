import { GET_JOB } from "../actions/orders";

const initialState = {
  job: "",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_JOB:
      return {
        job: action.job,
      };
  }
  return state;
};
