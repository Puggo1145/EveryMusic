import React, { Component } from 'react'

import './Section3.css'

export default class Section3 extends Component {
  render() {
    return (
      <div className='section3'>
        <div className='section3-center'>
            <div className='section3-texts'>
                <h2 className='section3-title'>最棒的互动课程，颠覆性的学习体验</h2>
                <p className='section3-description'>
                    人人人音乐家始终坚持将课程的互动性置于所有学习方式之上<br />
                    此处展示了部分课程内容，将声音的音高、响度等检测融入了课程中<br />
                </p>
            </div>
            <ul className='section3-showCase'>
                <li className='section3-showCase-item note'>
                    <p>音的高低</p>
                </li>
                <li className='section3-showCase-item volume'>
                    <p>音的强弱</p>
                </li>
                <li className='section3-showCase-item length'>
                    <p>音的长短</p>
                </li>
            </ul>
        </div>
      </div>
    )
  }
}
