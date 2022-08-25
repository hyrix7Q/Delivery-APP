import { FETCH_ORDERS, GET_JOB } from "../actions/orders";

const initialState = {
  orders: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ORDERS:
      return {
        orders: action.orders,
      };
  }
  return state;
};
