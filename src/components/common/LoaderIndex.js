import React from 'react'
import ContentLoader from 'react-content-loader'

const LoaderIndex = () => (<ContentLoader width="400" height="720">
  <rect x="0" y="0" rx="0" ry="0" width="400" height="480"/>

  <rect x="245" y="495" rx="0" ry="0" width="140" height="100"/>
  <rect x="15" y="515" rx="5" ry="5" width="200" height="15"/>
  <rect x="15" y="550" rx="5" ry="5" width="180" height="10"/>
  <rect x="15" y="570" rx="5" ry="5" width="180" height="10"/>

  <rect x="245" y="610" rx="0" ry="0" width="140" height="100"/>
  <rect x="15" y="630" rx="5" ry="5" width="200" height="15"/>
  <rect x="15" y="665" rx="5" ry="5" width="180" height="10"/>
  <rect x="15" y="685" rx="5" ry="5" width="180" height="10"/>
</ContentLoader>)

export default LoaderIndex