import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './LessonSelect.css'

export default class LessonSelect extends Component {
  render() {
    return (
      <div className='lessonSelect'>
        <ul className='lessonSelect-content'>
            <li className='lessonSelect-chapter chapter1'>
                <div className='lessonSelect-chapter-description description-chapter1'>
                    <h2 className='lessonSelect-chapter1-lessonNum'>第一章</h2>
                    <p className='lessonSelect-chapter1-title'>从一个音开始</p>
                </div>
                <div className='lessonSelect-chapter1-lessons'>
                    <Link className='lessonSelect-chapter1-lesson1 lessonSelect-lessons' to="/lesson1/video">1</Link>
                    <div className='lessonSelect-chapter1-lesson2 lessonSelect-lessons lesson-default'>2</div>
                    <div className='lessonSelect-chapter1-lesson3 lessonSelect-lessons lesson-default'>3</div>
                </div>
            </li>
            <li className='lessonSelect-chapter chapter2'>
                <div className='lessonSelect-chapter-description description-chapter2'>
                    <h2 className='lessonSelect-chapter1-lessonNum'>第二章</h2>
                    <p className='lessonSelect-chapter1-title'>敬请期待</p>
                </div>
                <div className='lessonSelect-chapter1-lessons'>
                    <div className='lessonSelect-chapter2-lesson1 lessonSelect-lessons lesson-default'>...</div>
                    <div className='lessonSelect-chapter2-lesson2 lessonSelect-lessons lesson-default'>...</div>
                    <div className='lessonSelect-chapter2-lesson3 lessonSelect-lessons lesson-default'>...</div>
                </div>
            </li>
        </ul>
      </div>
    )
  }
}
