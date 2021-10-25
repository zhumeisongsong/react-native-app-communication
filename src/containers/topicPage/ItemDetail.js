import React, {Component} from 'react'

import Back from '../../components/common/Back'
import ImageItem from '../../components/common/ImageItem'
import Loading from '../../components/common/Loading'
import PopupConfirm from '../../components/topic/PopupConfirm'

import _UA from '../../consist/UA'
import {nativeActionType} from '../../consist/config'
import {isLogin} from '../../util/owner'
import callNative from '../../util/callNative'

import {getItem, getCollect} from '../../api/index'

import '../../assets/stylesheet/detail.css'
import * as iconHeartO from  '../../assets/image/icon-heart-o.png'
import * as iconHeart from '../../assets/image/icon-heart.png'

class ItemDetail extends Component {
  constructor(props) {
    super(props)
    this.isCollected = false
  }

  state = {
    title: '详情',
    hiddenNativeTabs: false,
    common: {},
    customized: {},
    priceItems: {},
    isOpen: false,
    animating: true,
    isCollected: false,
    shareIcon: {
      data: {}
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id
    getItem(id).then(res => {
      this.setState({
        common: res.common,
        customized: res.customized,
        priceItems: res.priceItems,
        animating: false,
        shareIcon: {
          shown: true,
          data: {
            share_url: window.location.href,
            share_tit: res.common.name,
            share_img: res.common.thumbnailImage,
            share_des: res.common.abstract
          }
        }
      })

      if (isLogin()) {
        this.isCollected = res.common.collected
        this.setState({
          isCollected: this.isCollected
        })
      }
    })
  }

  onCollectClick = () => {
    if (isLogin()) {
      getCollect(this.state.common.id)
        .then(() => {
          this.isCollected = !this.isCollected
          this.setState({
            isCollected: this.isCollected
          })
        })
    } else {
      callNative(nativeActionType.login, {})
    }
  }

  onPayClick = () => {
    if (isLogin()) {
      this.refs.popupModal.onToggleChange()
    } else {
      callNative(nativeActionType.login, {})
    }
  }

  render() {
    if (JSON.stringify(this.state.common) !== '{}') {
      const listItem = (<div>
        {Object.keys(this.state.customized).map(key => (<div key={key}>
            {this.state.customized[key].name &&
            <div className="customized-item">
              <p className="item-name">{this.state.customized[key].name}:</p>
              {this.state.customized[key].image &&
              <img src={this.state.customized[key].image} alt="" className="subImage"/>}
              <div className="item-content" dangerouslySetInnerHTML={{
                __html: this.state.customized[key].value
              }}/>
            </div>}
          </div>)
        )}
      </div>)

      return (<div className="main-con">
        { _UA.isWebview &&
        <Back title={this.state.title} hiddenNativeTabs={this.state.hiddenNativeTabs} shareIcon={this.state.shareIcon}/>
        }

        <div className="scroll-con" style={_UA.isWebview ? {} : {top: '0'}}>
          <header className="detail-common">
            <ImageItem image={this.state.common.thumbnailImage}/>
            <div className="common-item">
              <h2 className="detail-title">{this.state.common.name}</h2>
              {this.state.common.isProduct &&
              <h3 className="detail-price">¥{this.state.priceItems.price.value}</h3>}
              { _UA.isWebview &&
              <img className="icon-heart"
                   src={this.state.isCollected ? iconHeart : iconHeartO} alt=""
                   onClick={this.onCollectClick}/>
              }
            </div>
          </header>

          {this.state.common.isProduct && (<section
            className="detail-customized ui-border-t padding-bottom">
            {listItem}
          </section>)}

          {!this.state.common.isProduct && (<section
            className="rich-text detail-customized ui-border-t"
            dangerouslySetInnerHTML={{
              __html: this.state.customized.content.value
            }}>
          </section>)}
        </div>

        {(_UA.isWebview && this.state.common.isProduct) && (<div>
          <button className="btn-default position-bottom btn-large" onClick={this.onPayClick}>立即购买
          </button>
          <PopupConfirm id={this.props.match.params.id} isOpen={this.state.isOpen} items={this.state.priceItems} ref="popupModal"/>
        </div>)}

      </div>)
    } else {
      return <Loading animating={this.state.animating}/>
    }
  }
}

export default ItemDetail