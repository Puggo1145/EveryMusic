import React, { Component } from 'react'

import './Header.css'

export default class Header extends Component {
	render() {
	  const { title } = this.props;
	  return (
		<div className='header-center'>
		  <h1 className='title'>{title}</h1>
		  <p className='sub-title'>音的性质</p>
		</div>
	  )
	}
  }
  
