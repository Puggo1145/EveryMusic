import React, { Component } from 'react'
import './Review.css'

export default class Review extends Component {
  state = {
    buttons: ['高低', '节律', '强弱', '长短', '远近', '音色'],
    buttonClasses: ['', '', '', '', '', ''],
    correctCount: 0,
    wrongAnswerVisibility: [true, true, true, true, true, true],
  }
  

  handleClick = (event) => {
    const index = parseInt(event.target.id, 10)
    let updatedClasses = [...this.state.buttonClasses]
    let updatedVisibility = [...this.state.wrongAnswerVisibility]
  
    if (index === 1 || index === 4) {
      updatedClasses[index] = 'wrong shake'
      this.setState({ buttonClasses: updatedClasses }, () => {
        setTimeout(() => {
          updatedClasses[index] = ''
          this.setState({ buttonClasses: updatedClasses })
        }, 1000)
      })
    } else {
      updatedClasses[index] = 'correct'
      this.setState({ buttonClasses: updatedClasses, correctCount: this.state.correctCount + 1 }, () => {
        if (this.state.correctCount === 4) {
          updatedVisibility[1] = false
          updatedVisibility[4] = false
          this.setState({ wrongAnswerVisibility: updatedVisibility })
        }
      })
    }
  }
  

  render() {
    return (
      <div className='review-center'>
        <div className="review-reviewSection">
          <h2>音有哪些性质？选择正确的答案</h2>
          <div className="review-choices">
            {this.state.buttons.map((button, index) => {
              if (this.state.wrongAnswerVisibility[index]) {
                return (
                  <button
                    onClick={this.handleClick}
                    key={index + 1}
                    id={index}
                    className={this.state.buttonClasses[index]}
                  >
                    {button}
                  </button>
                )
              } else {
                return null
              }
            })}
          </div>
        </div>
      </div>
    )
  }
}
