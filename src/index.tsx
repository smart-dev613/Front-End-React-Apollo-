import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ApolloProvider } from '@apollo/react-hooks'
import GraphQL from './gql/graphQL'
import './i18n'
// import * as Sentry from '@sentry/browser'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import 'bootstrap-daterangepicker/daterangepicker.css'
import './styles/main.scss'
import store2 from './store2/store2.js';


import { library } from '@fortawesome/fontawesome-svg-core'
// import { faStickyNote } from '@fortawesome/free-regular-svg-icons'
import { faHome, faUser, faBell, faCalendar, faSlidersH, faSearch, faStickyNote, faFileAlt, faEdit, faChevronDown, faChevronRight, faChevronLeft, faCheckCircle, faTimesCircle, faBuilding, faMapMarkerAlt, faUsers, faPlus, faCheck, faPencilAlt, faCalendarCheck, faShareAlt, faDownload, faTimes,faTicketAlt } from '@fortawesome/free-solid-svg-icons'
import App from './components/App'
import store from './store/createStore'

import '@fortawesome/fontawesome-free/css/all.min.css';

// Add icons to FA library to avoid importing every icon
library.add(
  faCalendar,
  faStickyNote,
  faBell,
  faHome,
  faUser,
  faSlidersH,
  faSearch,
  faStickyNote,
  faEdit,
  faFileAlt,
  faChevronDown,
  faChevronRight,
  faChevronLeft,
  faCheckCircle,
  faTimesCircle,
  faBuilding,
  faMapMarkerAlt,
  faUsers,
  faPlus,
  faCheck,
  faPencilAlt,
  faCalendarCheck,
  faShareAlt,
  faDownload,
  faTimes,
  faTicketAlt
);

// Sentry.init({
//   dsn: "https://81859dbb64bb4b3d99cc1f131f2a4858@sentry.byinspired.com/8"
// })

const apollo = new GraphQL()

ReactDOM.render(
  <Provider store={store}>
    {/* <Provider store={store2}> */}
      <ApolloProvider client={apollo.getClient()}>
        <App />
      </ApolloProvider>
    {/* </Provider> */}
  </Provider>,
  document.getElementById('app')
);