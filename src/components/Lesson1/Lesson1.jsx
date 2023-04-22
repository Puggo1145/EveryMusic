import React from 'react'
import { useLocation } from 'react-router-dom';

import Header from './Header/Header'
import Content from './Content/Content'
import Context from './Context/Context'
import Footer from './Footer/Footer'

// 引入局部样式
import './Lesson1.css'

function App(props) {
    const location = useLocation();
    const shouldShowContext = location.pathname !== '/lesson1/review';
  
    // 根据路径设置标题
    const getTitle = () => {
      switch (location.pathname) {
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
  
    const title = getTitle();
  
    return (
      <div className="Lesson1">
        <Header title={title} />
        <Content />
        {shouldShowContext && <Context />}
        <Footer />
      </div>
    );
  }
  
  export default App;
