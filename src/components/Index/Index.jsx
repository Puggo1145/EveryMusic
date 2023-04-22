import React, { Component } from 'react'

import Nav from './Nav/Nav'
import Main from './Main/Main'
import Section2 from './Section2/Section2'
import Section3 from './Section3/Section3'
import Section4 from './Section4/Section4'
import Footer from './Footer/Footer'

export default class Index extends Component {
  render() {
    return (
        <div className='Index'>
            <Nav/>
            <Main/>
            <Section2/>
            <Section3/>
            <Section4/>
            <Footer/>
        </div>
    )
  }
}
