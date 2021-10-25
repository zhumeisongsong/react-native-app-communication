import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import {PullToRefresh, ListView} from 'antd-mobile'

import Back from '../../components/common/Back'
import ImageFreeItem from '../../components/common/ImageFreeItem'
import LoadingMore from '../../components/common/LoadingMore'

import {NUM_ROWS} from '../../consist/config'
import {getExplore} from '../../api/'
import {nativeActionType} from '../../consist/config'
import callNative from '../../util/callNative'
import {formatDate}from '../../util/string'


class ExploreList extends Component {
  constructor(props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
    this.nextPage = 1
    this.listData = []

    this.state = {
      title: '发现',
      hiddenNativeTabs: true,
      dataSource,
      refreshing: false,
      isLoading: true,
      height: document.documentElement.clientHeight,
      useBodyScroll: false,
      indicator: {
        activate: ' ',
        deactivate: ' ',
        finish: ' '
      },
      hasMore: false,
      backIconHidden: true
    }
  }

  onFetchData = async function (page, isRefresh) {
    const res = await getExplore(page)
    this.setState({
      listData: res.results
    })

    if (isRefresh) {
      this.listData = res.results
      this.setState({
        count: res.count
      })
    } else {
      this.listData = this.listData.concat(res.results)
    }
    this.setState({
      hasMore: res.next
    })
  }

  componentDidMount() {
    this.onFetchData(1, true)
      .then(() => {
        const hei = this.state.height - findDOMNode(this.lv).offsetTop
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.state.listData),
          height: hei,
          isLoading: false
        })
      })
  }

  onRefresh = () => {
    this.setState({refreshing: true})
    this.onFetchData(1, true)
      .then(() => {
        this.nextPage = 1
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.state.listData),
          refreshing: false,
          isLoading: false,
        })
      })
  }

  onEndReached = event => {
    if (!this.state.isLoading && !this.state.hasMore) {
      return
    } else {
      this.setState({isLoading: true})
      this.nextPage++
      this.onFetchData(this.nextPage, false)
        .then(() => {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.listData),
            isLoading: false
          })
        })
    }
  }

  onItemClick = (id) => {
    callNative(nativeActionType.hiddenNativeTabs, {'needHidden': this.state.hiddenNativeTabs})
    this.props.history.push(`explore/${id}`)

  }

  render() {
    const separator = (sectionID, rowID) => (
      <div key={`${sectionID}-${rowID}`} className="border-item ui-border-b"/>)

    const row = (rowData) => {
      return (<div className="list-cover explore-list">
        <div className="list-item" onClick={this.onItemClick.bind(this, rowData.id)}>
          <ImageFreeItem image={rowData.bannerImage}/>
          <div className="text-con">
            <h3 className="title-item">{rowData.title}</h3>
            <time className="vice-item">{formatDate(rowData.createTimestamp)}</time>
            <p className="description-item">{rowData.abstract}</p>
          </div>
        </div>
      </div>)
    }

    return (<div className="main-con">
      <Back title={this.state.title} backIconHidden={this.state.backIconHidden}/>
      <div className="scroll-con">
        <ListView
          key={this.state.useBodyScroll ? '0' : '1'}
          ref={el => this.lv = el}
          dataSource={this.state.dataSource}
          renderFooter={() => <LoadingMore isLoading={this.state.isLoading} hasMore={this.state.hasMore}/>}
          renderRow={row}
          renderSeparator={separator}
          useBodyScroll={this.state.useBodyScroll}
          style={this.state.useBodyScroll ? {} : {
            height: this.state.height,
            overflow: 'inherit'
          }}
          pullToRefresh={<PullToRefresh
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            indicator={this.state.indicator}
            distanceToRefresh={this.state.distanceToRefresh}/>}
          onEndReached={this.onEndReached} pageSize={NUM_ROWS}
        />
      </div>
    </div>)
  }
}

export default ExploreList