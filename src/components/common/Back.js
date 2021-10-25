import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {NavBar, Icon, ActionSheet} from 'antd-mobile'

import {nativeActionType} from '../../consist/config'
import callNative from '../../util/callNative'

class Back extends Component {
  constructor() {
    super()
    this.state = {
      onCloseClicked: 'none'
    }
  }

  shareDataList = [
    {
      url: 'cTTayShKtEIdQVEMuiWt',
      title: '朋友圈',
      type: 'circle'
    },
    {
      url: 'umnHwvEgSyQtXlZjNJTt',
      title: '微信好友',
      type: 'person'
    }
  ].map(obj => ({
    icon: <img src={`https://gw.alipayobjects.com/zos/rmsportal/${obj.url}.png`} alt={obj.title} style={{width: 36}}/>,
    title: obj.title,
    type: obj.type
  }))

  onBackClick = () => {
    if (this.props.backToNative) {
      callNative(nativeActionType.back, {})
    } else {
      this.props.history.goBack()
      callNative(nativeActionType.hiddenNativeTabs, {'needHidden': this.props.hiddenNativeTabs})
    }
  }

  showShareActionSheet = () => {
    ActionSheet.showShareActionSheetWithOptions({options: this.shareDataList}, (buttonIndex) => {
      this.setState({
        onCloseClicked: buttonIndex > -1 ? this.shareDataList[buttonIndex].title : 'cancel'
      })
      if (buttonIndex !== -1) {
        let data = this.props.shareIcon.data
        data.type = this.shareDataList[buttonIndex].type
        callNative(nativeActionType.share, data)
      }
    })
  }

  render() {
    return (<NavBar
      className="ui-border-b position-top"
      mode="light"
      icon={!this.props.backIconHidden ?
        (<Icon type="left" size="lg" color="#3987d5" onClick={this.onBackClick}/>) : null}
      rightContent={(this.props.shareIcon && this.props.shareIcon.shown) ?
        (<Icon key="share" type="ellipsis" color="#3987d5" onClick={this.showShareActionSheet}/>) : null}>
      {this.props.title}
    </NavBar>)
  }
}

export default withRouter(Back)