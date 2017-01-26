function loading(state = 0, action) {
  switch (action.type) {
    case 'START_LOADING':
    case 'LOGIN_REQUEST':
      return state + 1;
    case 'STOP_LOADING':
    case 'LOGIN_REQUEST_COMPLETE':
      return state - 1;
    default:
      return state;
  }
}

export default loading;
