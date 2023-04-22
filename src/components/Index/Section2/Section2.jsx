import React, { Component } from 'react'

import './Section2.css'

export default class Section2 extends Component {
  render() {
    return (
      <div className='section2'>
        <div className='section2-center'>
            <div className='section2-texts'>
                <h2 className='section2-title'>可以玩的<br />互动课程</h2>
                <p className='section2-description'>
                    创新性的互动课程设计，用游戏的方式学习<br />
                    通过对教学内容的抽象化，将实际教学形式转化为了各种互动形式<br />
                    学生可以用唱歌、打节拍等各种形式与课程进行互动<br />
                    帮助学生更好地理解音乐知识，提高学习的趣味性
                </p>
                <a className='section2-knowMore' href="#">了解更多</a>
            </div>
        </div>
      </div>
    )
  }
}
