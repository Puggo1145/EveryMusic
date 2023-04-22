import React, { Component } from 'react'

import './Section4.css'

export default class Section4 extends Component {
  render() {
    return (
      <div className='section4'>
        <div className='section4-center'>
            <div className='section4-texts'>
                <h2 className='section4-title'>
                    和千万用户一起<br />
                    分享你的idea
                </h2>
                <p className='section4-description'>
                    我们始终将创新性与趣味性置于课程设计的首位<br />
                    如果你认为你的想法足够有趣，欢迎加入我们的课程设计团队<br />
                    让你的奇思妙想成为现实！
                </p>
                <div className='section4-joinUs'>
                  <input className='section4-joinUs-input' type="text" placeholder='请输入你的手机号'/>
                  <button className='section4-joinUs-btn'>加入我们</button>
                </div>
            </div>
        </div>
      </div>
    )
  }
}
