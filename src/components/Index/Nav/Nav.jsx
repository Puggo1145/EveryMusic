import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './Nav.css'

//引入静态资源
import navLogo from '../../../static/Index/Nav/LOGO.png'

export default class Nav extends Component {
  
  state = {
    isScrollTop: false,
    showMobileLink: false
  }
  
  handleScroll = (event) => {
    const scrollTop = Math.round(event.target.documentElement.scrollTop) 
    if (scrollTop > 0) {
      this.setState({isScrollTop: true})
    } else {
      this.setState({isScrollTop: false})
    }
  }

  handleMobileClick = () => {
    this.setState({showMobileLink: !this.state.showMobileLink})
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  render() {
    const {isScrollTop, showMobileLink} = this.state

    return (
      <nav className={isScrollTop ? 'nav-shadow' : ''}>
        <div className='nav-center'>
            <a className='nav-logo-link' href="#">
                <img className='nav-logo' src={navLogo} alt='resource-lost'/>
                <h1 className='nav-title'>人人音乐家 Beta</h1>
            </a>
            <ul className='nav-link'>
                <li className='nav-link-course'><a className='nav-link-aLink' href="#">课程</a></li>
                <li className='nav-link-aboutUs'><a className='nav-link-aLink' href="#">关于我们</a></li>
                <li>|</li>
                <li className='nav-signup'><Link className='nav-signup-aLink' to="/login">注册</Link></li>
            </ul>
            <button onClick={this.handleMobileClick} className='mobileLink'></button>
        </div>
        <ul className='nav-link-mobile' style={{display: showMobileLink ? 'block' : 'none'}}>
          <li className='nav-link-course'><a className='nav-link-aLink-mobile' href="#">课程</a></li>
          <li className='nav-link-aboutUs'><a className='nav-link-aLink-mobile' href="#">关于我们</a></li>
          <li className='nav-signup'><a className='nav-signup-aLink-mobile' href="#">注册</a></li>
        </ul>
      </nav>
    )
  }
}
