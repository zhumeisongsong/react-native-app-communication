import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import NoMatch from '../components/common/NoMatch'
import App from '../containers/App'
import TopicList from '../containers/topicPage/TopicList'
import ItemDetail from '../containers/topicPage/ItemDetail'
import ExploreList from '../containers/explorePage/ExploreList'
import ExploreDetail from '../containers/explorePage/ExploreDetail'
import OrderList from '../containers/orderPage/OrderList'
import CollectList from '../containers/userPage/CollectsList'

const host = ''

const routes = [
  {
    exact: true,
    path: host + '/explore',
    component: ExploreList
  }, {
    exact: true,
    path: host + '/order',
    component: OrderList
  }, {
    exact: true,
    path: host + '/collect',
    component: CollectList
  }, {
    exact: true,
    path: host + '/items/:id',
    component: ItemDetail
  }, {
    exact: true,
    path: host + '/explore/:id',
    component: ExploreDetail
  }, {
    exact: true,
    path: host + '/:topic',
    component: TopicList
  }, {
    exact: true,
    path: host + '/',
    component: App
  }, {
    exact: false,
    component: NoMatch
  }
]

const RouteWithSubRoutes = route => (
  <Route
    exact={route.exact}
    path={route.path}
    render={props => (
      // pass the sub-routes down to keep nesting
      <route.component {...props} routes={route.routes}/>
    )}
  />
)

const RouteConfig = () => (
  <Router>
    <div>
      <Switch>
        {routes.map((route, i) => <RouteWithSubRoutes key={i} {...route}/>)}
      </Switch>
    </div>
  </Router>
)

export default RouteConfig