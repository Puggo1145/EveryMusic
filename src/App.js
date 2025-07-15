import React, { useState, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import PubSub from 'pubsub-js'

import Index from './components/Index/Index'
import Lesson1 from './components/Lesson1/Lesson1'
import Learn from './components/Learn/Learn'
import Login from './components/Login/Login'
import UserCenter from './components/UserCenter/UserCenter'
import Navigator from './components/Navigator/Navigator'
import SingSystem from './components/SingSystem/SingSystem'
import PlayInstrument from './components/PlayInstrument/PlayInstrument'

import './App.css'

export default function App() {

  return (
    <Switch>
      <Route path="/" exact component={Index} />
      <Route path="/navigator" component={Navigator} />
      <Route path="/learn" component={Learn} />
      <Route path="/lesson1" component={Lesson1} />
      <Route path="/login" component={Login} />
      <Route path="/singsystem" component={SingSystem} />
      <Route path="/playinstrument" component={PlayInstrument} /> 
      <Route path="/usercenter" component={UserCenter} />
    </Switch>
  )
}