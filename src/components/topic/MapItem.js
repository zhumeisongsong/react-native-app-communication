import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Map, Markers} from 'react-amap'

import '../../assets/stylesheet/_map.css'

const formatMarkersJson = (originalData) => {
  Object.keys(originalData).map(key => {
    if (!originalData[key].longitude || !originalData[key].latitude) {
      delete originalData[key]
    }
  })

  return Object.keys(originalData).map(key => (
    {
      id: key,
      position: {
        longitude: originalData[key].longitude,
        latitude: originalData[key].latitude
      },
      label: {content: originalData[key].name}
    }))
}

class MapItem extends Component {
  constructor(props) {
    super(props)
    const self = this

    this.state = {
      markers: formatMarkersJson(props.markers),
    }
    this.mapEvents = {
      created(m){
        self.map = m
      }
    }

    // bind event to markers
    this.markersEvents = {
      created(markers) {
        self.map.setFitView(markers)
      },
      click(marker){
        let id = marker.target.F.extData.id
        props.history.push(`items/${id}`)
      }
    }
  }

  render() {
    if (this.state.markers.length !== 0) {
      return (<div className="map-container">
        <Map amapKey="b845a537130d07f72a87677aaf54e56a"
             plugins={['ToolBar']}
             events={this.mapEvents}>
          <Markers
            markers={this.state.markers}
            events={this.markersEvents}/>
        </Map>
      </div>)
    } else {
      return null
    }
  }
}

export default withRouter(MapItem)

