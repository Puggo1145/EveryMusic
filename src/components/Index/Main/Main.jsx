import React, { Component } from 'react'
import {Link} from 'react-router-dom'

import './Main.css'

export default class Main extends Component {
  render() {
    return (
    <section className='main-section'>
      <div className='main-center'>
        <h1 className='main-slogan'>
            可以玩的音乐课堂<br />
            在互动中学习音乐
        </h1>
        <p className='main-description'>
            最棒的在线音乐“互动课程”，用游戏的方式学习音乐、享受音乐
            <br />[当前版本为测试版，仅开放一节课程，更多内容敬请期待]
        </p>
        {/* <button className='main-start-link' onClick={this.toLesson}>立即体验</button> */}
        <Link className='main-start-link' to="/lesson1/video">立即体验</Link>
      </div>
      <ul className='main-infoTab'>
        <li>
            <h3>1K+</h3>
            <p>学生在线学习</p>
        </li>
        <li>
            <h3>20+</h3>
            <p>精美互动课程</p>
        </li>
        <li>
            <h3>15</h3>
            <p>专业教师顾问</p>
        </li>
        <li>
            <h3>CQNU</h3>
            <p>课题团队支持</p>
        </li>
      </ul>
    </section>
    )
  }
}
