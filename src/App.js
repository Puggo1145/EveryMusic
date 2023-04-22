import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import Index from './components/Index/Index'
import Lesson1 from './components/Lesson1/Lesson1'

import './App.css'

export default class App extends Component {

  render() {
    return (
      <Switch>
        <Route path="/" exact component={Index} />
        <Route path="/lesson1" component={Lesson1} />
      </Switch>
    )
  }
}
