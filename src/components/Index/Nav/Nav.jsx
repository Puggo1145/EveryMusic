import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import './Nav.css'

//引入静态资源
import navLogo from '../../../static/Index/Nav/LOGO.png'

export default class Nav extends Component {

  state = {
    isScrollTop: false,
    shownMobileLink: false,
    user: null,
    userName: '',
    isLoginToken: '',
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.setState({ isLoginToken: this.getCookieValue("token") }, () => {
      if (this.state.isLoginToken === "") {
        return;
      } else {

        axios.get("https://www.everymusic.cn/api/users/getInfo", {
          params: {
            token: this.state.isLoginToken,
          }
        })
          .then(response => {
            this.setState({
              user: response.data.data,
              userName: response.data.data.username,
            })
          }).catch(err => console.log(err.message));
      }
    })
  }


  getCookieValue = (cookieName) => {
    const cookieString = decodeURIComponent(document.cookie); // 解码 cookie
    const cookies = cookieString.split("; "); // 将 cookie 字符串拆分成数组

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const [name, value] = cookie.split("="); // 拆分出 cookie 的名称和值

      if (name === cookieName) {
        return value; // 找到指定名称的 cookie 值并返回
      }
    }

    return ""; // 如果找不到指定名称的 cookie，则返回空字符串
  }

  handleScroll = (event) => {
    const scrollTop = Math.round(event.target.documentElement.scrollTop)
    if (scrollTop > 0) {
      this.setState({ isScrollTop: true })
    } else {
      this.setState({ isScrollTop: false })
    }
  }

  handleMobileClick = () => {
    this.setState({ showMobileLink: !this.state.showMobileLink })
  }


  render() {
    const { isScrollTop, showMobileLink, isLoginToken } = this.state;

    return (
      <nav className={isScrollTop ? 'nav-shadow' : ''}>
        <div className='nav-center'>
          <a className='nav-logo-link' href="/">
            <img className='nav-logo' src={navLogo} alt='resource-lost' />
            <h1 className='nav-title'>人人音乐家</h1>
          </a>
          <ul className='nav-link'>
            <li className='nav-link-course'><Link className='nav-link-aLink' to="/learn">课程</Link></li>
            {/* <li className='nav-link-aboutUs'><Link className='nav-link-aLink' to="/aboutus">关于我们</Link></li>
            <li>|</li>
            <li className='nav-signup'>
              {isLoginToken ? (
                <Link className='nav-signup-aLink-person' to={{ pathname: "/usercenter", state: { user: this.state.user } }}>{this.state.userName}</Link>
              ) : (
                <Link className='nav-signup-aLink' to="/login">登陆</Link>)
              }
            </li> */}
          </ul>
          <button onClick={this.handleMobileClick} className='mobileLink'></button>
        </div>
        <ul className='nav-link-mobile' style={{ display: showMobileLink ? 'block' : 'none' }}>
          <li className='nav-link-course'><a className='nav-link-aLink-mobile' href="/">课程</a></li>
          <li className='nav-link-aboutUs'><a className='nav-link-aLink-mobile' href="/">关于我们</a></li>
          <li className='nav-signup'><a className='nav-signup-aLink-mobile' href="/">注册</a></li>
        </ul>
      </nav>
    )
  }
}