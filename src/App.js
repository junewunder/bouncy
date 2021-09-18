import { useEffect, useReducer } from 'react';
import { init } from './sim'

const initialState = { count: 0 }

function reducer(state, action) {
  const nextState = {...state}
  switch (action.type) {
    case 'plus':
      nextState.count += 1
      break
    case 'minus':
      nextState.count -= 1
      break
  }
  return nextState
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    init(state, dispatch)
  }, [])

  return (
    <div className="App">
      <div id="overlay">
        <button onClick={() => dispatch({type: 'plus'})}>plus</button>
        <button onClick={() => dispatch({type: 'minus'})}>minus</button>
        <span style={{background: 'white'}}>state: {state.count}</span>
      </div>
      <canvas id="canvas"></canvas>
    </div>
  );
}

export default App;
