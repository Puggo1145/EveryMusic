import React, { Component } from 'react'

import './Footer.css'

//引入样式
import footerLogo from '../../../static/Index/Nav/LOGO.png'

export default class Footer extends Component {
  render() {
    return (
      <div className='footer'>
        <div className='footer-center'>
            <div className='footer-logo'>
                <img src={footerLogo} alt='resource-lost'/>
            </div>
        </div>
      </div>
    )
  }
}
