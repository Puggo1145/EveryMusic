import React from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'

import './Header.css'

export default function Header(props) {
  const history = useHistory();
  const location = useLocation();

  const handleBack = (event) => {
    event.preventDefault();
    history.goBack(); 
  }

  const isScorePage = location.pathname.includes('singscore') || location.pathname.includes('songselection'); // 判断当前路径是否包含 'score'

  return (
    <div className='learn-header'>
      <div className='learn-header-content'>
        <Link 
          className='learn-header-back' 
          to={isScorePage ? '/' : '#'} 
          onClick={isScorePage ? () => {} : handleBack}
        >
        </Link>
        <h1 className='learn-header-title'>{props.title}</h1>
      </div>
    </div>
  )
}
