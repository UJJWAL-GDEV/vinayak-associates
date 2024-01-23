import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import {store} from './redux/store.js'
import './index.css'

export const BASE_URL = "http://13.200.166.86/backend/api/v1";
// export const BASE_URL = "https://vehicle-node.onrender.com/backend/api/v1";

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App/>
</Provider>
)