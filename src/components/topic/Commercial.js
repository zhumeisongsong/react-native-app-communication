import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Carousel} from 'antd-mobile'

import {nativeActionType} from '../../consist/config'
import callNative from '../../util/callNative'

import ImageItem from '../../components/common/ImageItem'
import '../../assets/stylesheet/_carousel.css'

class Commercial extends Component {
  state = {
    hiddenNativeTabs: true,
    imgHeight: window.screen.height * 0.94,
    slideIndex: 0
  }

  onItemClick = (id) => {
    callNative(nativeActionType.hiddenNativeTabs, {'needHidden': this.state.hiddenNativeTabs})
    this.props.history.push(`items/${id}`)
  }

  render() {
    if (this.props.data.length !== 0) {
      return (<Carousel
        autoplay={false}
        infinite
        selectedIndex={0}>
        {this.props.data.map(val => (<div
            onClick={this.onItemClick.bind(this, val.id)}
            key={val}
            style={{display: 'block'}}>
            <div className="carousel-item" style={{height: this.state.imgHeight}}>
              <ImageItem image={val.coverImage}/>
            </div>
          </div>)
        )}
      </Carousel>)
    } else
      return null
  }
}

export default withRouter(Commercial)