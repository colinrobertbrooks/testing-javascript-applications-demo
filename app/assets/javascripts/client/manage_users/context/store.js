const initialState = {
  alert: null,
  isLoading: true,
  hasError: false,
  accessOptions: null,
  users: null
};

const state = { ...initialState };

const getState = () => state;

const setState = newState => Object.assign(state, newState);

export default { initialState, getState, setState };
