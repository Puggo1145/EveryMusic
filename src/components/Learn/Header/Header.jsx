import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './Header.css'

export default class Header extends Component {
  render() {
    return (
      <div className='learn-header'>
        <div className='learn-header-content'>
            <Link className='learn-header-back' to="/"></Link>
            <h1 className='learn-header-title'>课程选择</h1>
        </div>
      </div>
    )
  }
}
