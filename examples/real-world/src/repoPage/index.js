import { withReducer } from 'react-redux-dynamic-reducer'

import RepoPage from './RepoPage'
import reducer from './reducer'

export default withReducer(reducer, 'repoPage')(RepoPage)
