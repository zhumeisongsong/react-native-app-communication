import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import {Link} from 'react-router-dom'
import {PullToRefresh, ListView} from 'antd-mobile'

import Back from '../../components/common/Back'
import ImageItem from '../../components/common/ImageItem'
import LoadingMore from '../../components/common/LoadingMore'
import RecommendTop from '../../components/topic/RecommendTop'
import ItemMap from '../../components/topic/MapItem'

import {NUM_ROWS} from '../../consist/config'
import {getTopic} from '../../api/'

class TopicList extends Component {
  constructor(props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })

    this.nextPage = 1
    this.listData = []
    this.markers = {}

    this.state = {
      topicId: this.props.match.params.topic,
      title: '',
      hiddenNativeTabs: false,
      recommend: {},
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
      hasMore: false
    }
  }

  //fetch data from server
  onFetchData = async function (page, isRefresh) {
    let id = this.state.topicId
    const res = await getTopic(id, page)

    if (isRefresh) {
      this.listData = res.list.results
      this.markers[page] = res.list.location
      this.setState({
        count: res.list.count,
        title: res.common.name,
        recommend: res.common
      })
    } else {
      this.listData = this.listData.concat(res.list.results)
      this.markers[page] = res.list.location
    }
    this.setState({
      hasMore: res.list.next
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

  render() {
    const row = (rowData, sectionID, rowID) => {
      const isShownMap = (index) => {
        let id = parseInt(index, 10)
        if ((id + 1) % NUM_ROWS === 0) {
          return true
        } else if (this.state.count % NUM_ROWS !== 0 && this.state.count - 1 === id) {
          return true
        }
        return false
      }

      return (<section>
        <div className="list-box">
          <Link to={'/items/' + rowData.id} className="list-item box-shadow border-radius">
            <div className="text-con">
              <h3 className="title-item">{rowData.name}</h3>
            </div>
            <ImageItem image={rowData.thumbnailImage}/>
            <p className="description-item">{rowData.abstract}</p>
          </Link>
        </div>
        {isShownMap(rowID) &&
        <ItemMap markers={this.markers[this.nextPage]}/>}
      </section>)
    }

    return (<div className="main-con">
      <Back title={this.state.title} hiddenNativeTabs={this.state.hiddenNativeTabs}/>
      <div className="scroll-con">
        <ListView
          key={this.state.useBodyScroll ? '0' : '1'}
          ref={el => this.lv = el}
          dataSource={this.state.dataSource}
          renderHeader={() => <RecommendTop data={this.state.recommend}/>}
          renderRow={row}
          renderFooter={() => <LoadingMore isLoading={this.state.isLoading} hasMore={this.state.hasMore}/>}
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
          onEndReached={this.onEndReached} pageSize={NUM_ROWS}>
        </ListView>
      </div>
    </div>)
  }
}

export default TopicList