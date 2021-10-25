import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'

import {nativeActionType} from '../../consist/config'
import callNative from '../../util/callNative'

import '../../assets/stylesheet/_menu.css'
import * as iconSearch from '../../assets/image/icon-search.png'

class Menu extends Component {
  state = {
    hiddenNativeTabs: true
  }

  onSearchClick = () => {
    callNative(nativeActionType.search, {})
  }

  onItemClick = (id) => {
    callNative(nativeActionType.hiddenNativeTabs, {
      'needHidden': this.state.hiddenNativeTabs
    })
    this.props.history.push(`${id}`)
  }

  render() {
    const sideBar = (<div className={'side-bar swipe-in ' + (this.props.open ? 'is-open' : '')}>
      {this.props.data.map(val => (
        <div key={val.id}
             onClick={this.onItemClick.bind(this, val.id)}
             className="ui-border-b">{val.name}</div>)
      )}
    </div>)

    return (<div className="nav-con position-top">
      <div className={'sidebar-wrapper ' + (this.props.open ? 'is-open' : '')}>
        <div className="bg-item"
             onClick={this.props.onOpenChange}/>
        {sideBar}
      </div>

      <div className="icon-con">
        <div className={'icon-nav ' + (this.props.open ? 'is-close' : '')}
             onClick={this.props.onOpenChange}>
          <div className="wrapper">
            <span/>
            <span/>
            <span/>
          </div>
        </div>
        <img src={iconSearch}
             className={'icon-img ' + (this.props.open ? 'hidden' : '')}
             alt=""
             onClick={this.onSearchClick}/>
      </div>
    </div>)
  }
}

export default withRouter(Menu)