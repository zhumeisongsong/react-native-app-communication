import React from  'react'

import '../../assets/stylesheet/_loadingMore.css'
import * as iconLoading from '../../assets/image/icon-load.png'

const LoadingMore = props => {
  return (<footer className="loading-more">
    {props.isLoading &&
    <img src={iconLoading} alt="loading" className="loading-more-img circle"/>
    }
    {!props.hasMore &&
    <p className="no-more">没有更多</p>
    }
  </footer>)
}

export default LoadingMore