import React, { Component } from 'react'

import './Introduction.css'
import logo from '../../../static/Login/Introduction/LOGO.png'

export default class Introduction extends Component {
  render() {
    return (
      <div className='Introduction'>
        <div className='introduction-content'>
          <div className='introduction-Logo'>
            <img src={logo} alt="LogoLost" />
            <p>人人音乐家</p>
          </div>
          <h1 className='introduction-slogan'>
            每一句歌唱<br />
            都值得听到
          </h1>
        </div>
      </div>
    )
  }
}
