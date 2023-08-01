import React from 'react'

import Header from '../common/Header/Header'
import LessonSelect from './LessonSelect/LessonSelect'

import './Learn.css'

export default function Learn(props) {
    return (
        <div className='Learn'>
          <Header title={"课程选择"}/>
          <LessonSelect />
        </div>
    )
}
