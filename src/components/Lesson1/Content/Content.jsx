import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import Video from './Video/Video'
import Note from './Note/Note'
import PitchGame from './PitchGame/PitchGame'
import Volumn from './Volumn/Volumn'
import Length from './Length/Length'
import Timbre from './Timbre/Timbre'
import Review from './Review/Review'


export default class content extends Component {
  render() {
    return (
      <Switch>
        <Route path="/lesson1/video" component={Video} />
        <Route path="/lesson1/note" component={Note} />
        <Route path="/lesson1/pitchgame" component={PitchGame} />
        <Route path="/lesson1/volumn" component={Volumn} />
        <Route path="/lesson1/length" component={Length} />
        <Route path="/lesson1/timbre" component={Timbre} />
        <Route path="/lesson1/review" component={Review} />
        <Redirect from="/" to="/video" />
      </Switch>
    )
  }
}

