import React from 'react'
import { withReducer } from 'react-redux-dynamic-reducer'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
import reducer from '../reducers'

const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)

export default withReducer(reducer, 'app')(App)
