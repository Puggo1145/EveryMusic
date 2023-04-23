import React, { Component } from 'react'

import Header from './Header/Header'
import LessonSelect from './LessonSelect/LessonSelect'

import './Learn.css'

export default class Learn extends Component {
  render() {
    return (
        <div className='Learn'>
          <Header />
          <LessonSelect />
        </div>
    )
  }
}
