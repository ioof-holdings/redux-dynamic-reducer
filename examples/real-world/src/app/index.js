import { withReducer } from 'react-redux-dynamic-reducer'

import App from './App'
import reducer from './reducer'

export default withReducer(reducer, 'app')(App)
