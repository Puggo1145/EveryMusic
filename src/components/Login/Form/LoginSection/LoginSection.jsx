import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class LoginSection extends Component {
  render() {
    return (
      <div className='LoginSection'>
        <div className='LoginSection-description'>
            <h1>登录</h1>
            <p>还没有账号？<Link className='LoginSection-toSignup' to="/signup">立即注册</Link></p>
        </div>
        <form className='LoginSection-form'>
            <div className='LoginSection-form-phoneNum'>
                <p className='userInput-text'>手机号</p>
                <input className='userInput' type="text" placeholder='请输入手机号'/>
            </div>
            <div className='LoginSection-form-password'>
                <p className='userInput-text'>密码</p>
                <input className='userInput' type="text" placeholder='请输入密码'/>
            </div>
            <input className='submitButton' type="submit" value="登录"/>
        </form>
      </div>
    )
  }
}
