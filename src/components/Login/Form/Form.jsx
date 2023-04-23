import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './Form.css'

export default class Form extends Component {
    render() {
        return (
            <div className='Form'>
                <div className='LoginSection'>
                    <Link className="form-toMainPage" to="/"></Link>
                    <div className='LoginSection-description'>
                        <h1>登录</h1>
                        <p>系统将在第一次注册时自动为您注册账号</p>
                    </div>
                    <form className='LoginSection-form'>
                        <div className='LoginSection-form-phoneNum'>
                            <p className='userInput-text'>手机号</p>
                            <input className='userInput' type="text" placeholder='请输入手机号' />
                        </div>
                        <div className='LoginSection-form-password'>
                            <p className='userInput-text'>密码</p>
                            <input className='userInput' type="text" placeholder='请输入密码' />
                        </div>
                        <input className='submitButton' type="submit" value="登录" />
                    </form>
                </div>
            </div>
        )
    }
}
