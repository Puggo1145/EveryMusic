import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import PubSub from 'pubsub-js';

import './Footer.css'

const routesOrder = [
  '/lesson1/video',
  '/lesson1/note',
  '/lesson1/pitchgame',
  '/lesson1/volumn',
  '/lesson1/length',
  '/lesson1/timbre',
  '/lesson1/review',
];

class Footer extends Component {
  state = {
    promptNextPage: false,
  }

  componentDidMount() {
    PubSub.publish("ROUTES_ORDER", routesOrder);

    // 提示下一页
    this.pubsubToken = PubSub.subscribe('PROMPT_NEXT', () => {
      this.setState({ promptNextPage: true });
    });

  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.pubsubToken);
  }

  goPrevPage = () => {
    const currentIndex = routesOrder.indexOf(this.props.location.pathname);

    if (currentIndex > 0) {
      this.props.history.push(routesOrder[currentIndex - 1]);
      PubSub.publish("PAGE_CHANGED", { pageIndex: currentIndex - 1, routesOrder });
    }
  };

  goNextPage = () => {
    const currentIndex = routesOrder.indexOf(this.props.location.pathname);

    if (currentIndex < routesOrder.length - 1) {
      this.props.history.push(routesOrder[currentIndex + 1]);
      PubSub.publish("PAGE_CHANGED", { pageIndex: currentIndex + 1, routesOrder });
    } else {
      window.location.href = "/learn"; // 回到课程选择页面
    }
    if (this.state.promptNextPage) {
      this.setState({ promptNextPage: false });
    }
  }

  render() {
    const currentIndex = routesOrder.indexOf(this.props.location.pathname);
    const { promptNextPage } = this.state;

    return (
      <footer>
        <div className="footer-content">
          <div className='footer-texts'>
            <h2>请手动点击按钮翻页</h2>
          </div>
          <div className="footer-page-routeBtn">
            {currentIndex > 0 && (
              <button className="footer-pageBtn prev" onClick={this.goPrevPage}></button>
            )}
            {currentIndex < routesOrder.length - 1 ? (
              <button className={promptNextPage ? "footer-pageBtn next promptNextPage" : "footer-pageBtn next"} onClick={this.goNextPage}></button>
            ) : (
              <button className="footer-pageBtn home" onClick={this.goNextPage}></button>
            )}
          </div>
        </div>
      </footer>
    );
  }
}

export default withRouter(Footer);