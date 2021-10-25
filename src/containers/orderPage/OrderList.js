import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import {PullToRefresh, ListView} from 'antd-mobile'

import Back from '../../components/common/Back'
import LoadingMore from '../../components/common/LoadingMore'
import ImageItem from '../../components/common/ImageItem'

import {NUM_ROWS} from '../../consist/config'
import {getOrders} from '../../api/'

class OrderList extends Component {
  constructor(props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })

    this.nextPage = 1
    this.listData = []

    this.state = {
      title: '我的订单',
      backToNative: true,
      dataSource,
      refreshing: false,
      isLoading: true,
      height: document.documentElement.clientHeight,
      useBodyScroll: true,
      indicator: {
        activate: ' ',
        deactivate: ' ',
        finish: ' '
      },
      hasMore: false
    }
  }

  //fetch data from server
  onFetchData = async function (page, isRefresh) {
    const res = await getOrders(page)

    if (isRefresh) {
      this.listData = res.results

      this.setState({
        count: res.count,
        list: this.listData
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
          height: hei,
          dataSource: this.state.dataSource.cloneWithRows(this.listData),
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

  render() {
    const separator = (sectionID, rowID) => (
      <div key={`${sectionID}-${rowID}`} className="border-item ui-border-b"/>)

    const row = rowData => {
      return (<div className="ui-border-b">
        <div className="list-item">
          <div className="text-con">
            <div>{rowData.orderNum}</div>
            <h3 className="title-item"> {rowData.item.name}</h3>
            <div>{rowData.prices}</div>
          </div>
          <ImageItem image={rowData.item.thumbnailImage}/>
        </div>
      </div>)
    }
    return (<div className="main-con">
      <Back title={this.state.title} backToNative={this.state.backToNative}/>
      <div className="scroll-con">
        <ListView
          key={this.state.useBodyScroll ? '0' : '1'}
          ref={el => this.lv = el}
          dataSource={this.state.dataSource}
          renderRow={row}
          renderFooter={() => <LoadingMore isLoading={this.state.isLoading} hasMore={this.state.hasMore}/>}
          renderSeparator={separator}
          useBodyScroll={this.state.useBodyScroll}
          pullToRefresh={<PullToRefresh
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            indicator={this.state.indicator}
            distanceToRefresh={this.state.distanceToRefresh}/>}

          onEndReached={this.onEndReached} pageSize={NUM_ROWS}>
        </ListView>
      </div>
    </div>)
  }
}

export default OrderList