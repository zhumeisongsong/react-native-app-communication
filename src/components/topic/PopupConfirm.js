import React, {Component} from 'react'
import {Modal} from 'antd-mobile'
import _ from 'lodash'

import {nativeActionType} from '../../consist/config'
import callNative from '../../util/callNative'
import {removeByValue}from '../../util/array'
import {add, minus} from '../../util/number'

import {postPayment} from '../../api/index'

import '../../assets/stylesheet/_popupCheckbox.css'
import * as iconAlipay from '../../assets/image/icon-alipay.svg'
import * as iconWechat from '../../assets/image/icon-wechat.svg'

class PopupConfirm extends Component {
  constructor(props) {
    super(props)
    this.postKey = [this.props.items.price.postKey]
    this.state = {
      isOpen: false,
      id: this.props.id,
      prices: 'price',
      isClickalipay: false,
      isClickwechat: false,
      totalPrice: this.props.items.price.value,
    }
  }

  onToggleChange = () => {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  onCheckedChange = ({target}) => {
    let postKey = target.id

    if (target.checked) {
      this.setState({
        totalPrice: add(this.state.totalPrice, target.value),
        [postKey]: true
      })
      this.postKey.push(postKey)
    } else {
      this.setState({
        totalPrice: minus(this.state.totalPrice, target.value),
        [postKey]: false
      })
      removeByValue(this.postKey, postKey)
    }
  }

  onSubmit = (method) => {
    let key = `isClick${method}`
    this.setState({
      [key]: true,
      isOpen: !this.state.isOpen
    })

    postPayment(this.state.id, method, this.postKey)
      .then(res => {
        let data = res
        data.type = method
        callNative(nativeActionType.payment, data)
      })
  }

  render() {
    return (<Modal
      popup
      visible={this.state.isOpen}
      onClose={this.onToggleChange}
      animationType="slide-up">
      <div className="property-list">
        {Object.keys(this.props.items).map(key => (
            _.isArray(this.props.items[key]['value']) && (<div key={key} className="property-cell">
              <header className="property-title">{this.props.items[key]['name']}:</header>
              {this.props.items[key]['value'].map((val, index) => (
                <div className="property-checkbox" key={key + index}>
                  <input className="checkbox-item"
                         type="checkbox"
                         defaultChecked={this.state[val.postKey]}
                         id={val.postKey}
                         name={val.postKey}
                         value={val.value}
                         onClick={this.onCheckedChange}/>
                  <label htmlFor={val.postKey}>{val.name}</label>
                </div>)
              )}
            </div>)
          )
        )}
        <section className="property-cell">
          <header className="property-title">价格合计:</header>
          <div className="price-total">￥{this.state.totalPrice}</div>
        </section>
        <footer className="payment-con">
          <div onClick={() => this.onSubmit('alipay')}
               className={'payment-item alipay' + (this.state.isClickalipay ? '-active' : '')}>
            <img src={iconAlipay} alt=""/>
            <span>支付宝</span>
          </div>
          <div onClick={() => this.onSubmit('wechat')}
               className={'payment-item wechat' + (this.state.isClickwechat ? '-active' : '')}>
            <img src={iconWechat} alt=""/>
            <span>微信</span>
          </div>
        </footer>
      </div>
    </Modal>)
  }
}

export default PopupConfirm