import { withReducer } from 'react-redux-dynamic-reducer'

import UserPage from './UserPage'
import reducer from './reducer'

export default withReducer(reducer, 'userPage')(UserPage)
