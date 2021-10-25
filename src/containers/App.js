import React, {Component} from'react'
import {findDOMNode} from 'react-dom'
import {PullToRefresh, ListView} from 'antd-mobile'

import LoadingMore from '../components/common/LoadingMore'
import LoaderIndex from '../components/common/LoaderIndex'
import ImageItem from '../components/common/ImageItem'
import Commercial from '../components/topic/Commercial'
import Menu from '../components/topic/Menu'

import {NUM_ROWS} from '../consist/config'
import {nativeActionType} from '../consist/config'
import callNative from '../util/callNative'
import {getTopics, getCommercials, getRecommend} from '../api/'

import '../assets/stylesheet/listView.css'

class App extends Component {
  constructor() {
    super()
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })

    this.nextPage = 1
    this.listData = []

    this.state = {
      ads: [],
      topics: [],
      dataSource,
      isShown: false,
      refreshing: false,
      isLoading: true,
      height: document.documentElement.clientHeight,
      useBodyScroll: false,
      indicator: {
        activate: ' ',
        deactivate: ' ',
        finish: ' '
      },
      distanceToRefresh: 40,
      hasMore: false,
      openMenu: false,
      hiddenNativeTabs: true
    }
  }

  //fetch data from server
  onFetchData = async function (page, isRefresh) {
    const recommendRes = await getRecommend(page)

    if (isRefresh) {
      const commercialsRes = await getCommercials()
      const topicsRes = await getTopics()
      this.listData = recommendRes.results
      this.setState({
        count: recommendRes.count,
        ads: commercialsRes.results,
        topics: topicsRes.results,
        isShown: true
      })
    } else {
      this.listData = this.listData.concat(recommendRes.results)
    }
    this.setState({
      hasMore: recommendRes.next
    })
  }

  componentDidMount() {
    this.onFetchData(1, true)
      .then(() => {
        const hei = this.state.height - findDOMNode(this.lv).offsetTop
        this.setState({
          height: hei,
          dataSource: this.state.dataSource.cloneWithRows(this.listData),
          isLoading: false // change default state
        })
      })
  }

  onRefresh = () => {
    this.setState({refreshing: true})
    this.onFetchData(1, true)
      .then(() => {
        this.nextPage = 1
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.listData),
          refreshing: false
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
    this.props.history.push(`items/${id}`)
  }

  onOpenChange = () => {
    this.setState({
      openMenu: !this.state.openMenu
    })
  }

  render() {
    const separator = (sectionID, rowID) => (
      <div key={`${sectionID}-${rowID}`} className="border-item ui-border-b"/>)

    const row = rowData => {
      return (<div className="list-item index-list-item" onClick={this.onItemClick.bind(this, rowData.item.id)}>
        <div className="text-con">
          <h3 className="title-item line-clamp">{rowData.title}:{rowData.description}</h3>
          {/*<p></p>*/}
        </div>
        <ImageItem image={rowData.item.thumbnailImage}/>
      </div>)
    }
    if (this.state.isShown) {
      return (<div className="main-con">
        <Menu data={this.state.topics} open={this.state.openMenu}
              onOpenChange={this.onOpenChange}/>
        <div className="scroll-con" style={{top: '0'}}>
          <ListView
            className={this.state.open ? 'no-scroll' : ''}
            key={this.state.useBodyScroll ? '0' : '1'}
            ref={el => this.lv = el}
            dataSource={this.state.dataSource}
            renderHeader={() => <Commercial data={this.state.ads}/>}
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
              distanceToRefresh={this.state.distanceToRefresh}
            />}
            onEndReached={this.onEndReached}
            pageSize={NUM_ROWS}
          />
        </div>
      </div>)
    } else {
      return <LoaderIndex/>
    }
  }
}

export default App