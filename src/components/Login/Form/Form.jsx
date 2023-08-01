import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './Form.css';

export default class Form extends Component {
  state = {
    phoneNumber: '',
    password: ''
  };

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

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { phoneNumber, password } = this.state;
    const userlogin = {
      phoneNumber: phoneNumber,
      password: password,
    };
    axios.post("https://www.everymusic.cn/api/users/register", userlogin)
      .then(response => {
        if (response.data.code === 20001) {
          alert("手机号码或密码错误，请重试！");
          return;
        }
        const { message, data } = response.data;
        document.cookie = `token = ${data.token}`;
        alert(message + '点击确认后，将会在3s后将自动跳转至主页！');
        setTimeout(() => {
          window.location.href = "/"
        }, 3000);
      }).catch(err => {
        console.log(err.message);
      })
  };

  render() {
    const { phoneNumber, password } = this.state;
    return (
      <div className='Form'>
        <div className='LoginSection'>
          <Link className="form-toMainPage" to="/"></Link>
          <div className='LoginSection-description'>
            <h1>登录</h1>
            <p>系统将在第一次注册时自动为您注册账号</p>
          </div>
          <form className='LoginSection-form' onSubmit={this.handleSubmit}>
            <div className='LoginSection-form-phoneNum'>
              <p className='userInput-text'>手机号</p>
              <input
                className='userInput'
                type="text"
                placeholder='请输入手机号'
                name="phoneNumber"
                value={phoneNumber}
                onChange={this.handleInputChange}
              />
            </div>
            <div className='LoginSection-form-password'>
              <p className='userInput-text'>密码</p>
              <input
                className='userInput'
                type="password"
                placeholder='请输入密码'
                name="password"
                value={password}
                onChange={this.handleInputChange}
              />
            </div>
            <input className='submitButton' type="submit" value="登录" />
          </form>
        </div>
      </div>
    );
  }
}
