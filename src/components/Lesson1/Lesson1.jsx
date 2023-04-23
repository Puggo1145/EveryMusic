import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PubSub from 'pubsub-js';

import Header from './Header/Header';
import Content from './Content/Content';
import Context from './Context/Context';
import Footer from './Footer/Footer';
import Loading from '../common/Loading/Loading';

// 引入局部样式
import './Lesson1.css';

class Lesson1 extends Component {

  state = {
    loading: true,
  }

  componentDidMount() {
    const loadedToken = PubSub.subscribe('loaded', () => {
      this.setState({
        loading: false,
      });
      PubSub.unsubscribe(loadedToken);
    })
  }

  getTitle = () => {
    const { pathname } = this.props.location;

    switch (pathname) {
      case '/lesson1/video':
        return '先导视频';
      case '/lesson1/note':
        return '音高';
      case '/lesson1/pitchgame':
        return '音高';
      case '/lesson1/volumn':
        return '强弱';
      case '/lesson1/length':
        return '音值';
      case '/lesson1/timbre':
        return '音色';
      case '/lesson1/review':
        return '复习一下';
      default:
        return '未知页面';
    }
  };

  render() {
    // 获取当前页面的路径，如果是复习页面，则不显示Context
    const { location } = this.props;
    const shouldShowContext = location.pathname !== '/lesson1/review';

    // 获取Header标题
    const title = this.getTitle();

    // 如果loading为true，则显示Loading组件
    const { loading } = this.state;

    if (loading) {
      return <Loading />;
    }

    // 资源加载完毕，显示页面
    return (
      <div className="Lesson1">
        <Header title={title} />
        <Content />
        {shouldShowContext && <Context />}
        <Footer />
      </div>
    );
  }
}

export default withRouter(Lesson1);
