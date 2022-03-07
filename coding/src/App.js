import './App.css';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const App = () => {
  return (
    <div>Code Breaker React App Hello World</div>
  )
}

export default App;
