import React, { Component } from 'react'

import Introduction from './Introduction/Introduction'
import Form from './Form/Form'

import './Login.css'

export default class Login extends Component {
  render() {
    return (
        <div className='Login'>
            <Introduction />
            <Form />
        </div>
    )
  }
}
