import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { AppState } from '../store/root'
import {setCurrentSearchText} from "../store/ui/action"

/** Components */
import HeaderBar from './pages/_shared/HeaderBar'
import Sidebar from './pages/_shared/Sidebar'
import Footer from './pages/_shared/Footer'

/** Pages */
import Home from './pages/views/Home'
import Invited from './pages/views/Invited'
import EventSetup from './pages/views/Setup';
import Cart from './pages/views/Cart';
import Calendar from './pages/views/Calendar';
import RevenueManagement from './pages/views/RevenueManagement';
import ClusterManagement from './pages/views/ClusterManagement';
import TransactionHistory from './pages/views/TransactionHistory';
import RequestManagement from './pages/views/RequestManagement';
import Companies from './pages/views/Companies';
import Attendees from './pages/views/Attendees';
import EventsList from './pages/views/Contents';
import Coupons from './pages/views/Coupons';

// import Home from './pages/Home'
// import EventsList from './pages/EventsList'
import Company from './CompanyItem'
// import Companies from './pages/Companies'
// import Calendar from './pages/Calendar'
import CalendarContent from './pages/CalendarContent'
import Admin from './pages/Admin'
// import EventSetup from './Setup'
import Notes from './pages/Notes'
// import Attendees from './pages/Attendees'
// import Invited from './pages/Invited'
import Pricing from './pages/Pricing'
import Rooms from './pages/Rooms'
import SearchComponent from './pages/SearchComponent'
// import PricingItems from './pages/PricingItems';
// import Cart from './pages/Cart';

interface SlugRoutingProps {
  showSearch?:boolean
  setCurrentSearchText: (searchText: string) => void
}

interface State {
  searchText: string;
}

type Props = SlugRoutingProps
class SlugRouting extends Component <Props, State> {

  constructor(props:Props){
    super(props);
    this.searchInput = this.searchInput.bind(this);
    this.state = {
      searchText:''
    }
  }
  
  public searchInput (e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({searchText:e.target.value});
    this.props.setCurrentSearchText(e.target.value);
  }

  public render() {
    return (
      <StyledApp>
        {/* <Header  /> */}
        <HeaderBar />
        <Sidebar />
        <Switch>
          <Route path="/:slug/" exact component={Home} />
          <Route path="/:slug/calendar" component={Calendar} />
          <Route path="/:slug/content" exact render={(props) => <EventsList {...this.props} />} />
          <Route path="/:slug/coupon" exact render={(props) => <Coupons {...this.props} />} />
          <Route path="/:slug/ticket" exact render={(props) => <EventsList {...this.props} />} />
          <Route path="/:slug/companies" exact render={(props) => <Companies {...this.props} />} />
          <Route path="/:slug/company/:id" component={Company} />
          <Route path="/:slug/calendar/:id" component={Calendar} />
          <Route path="/:slug/admin" component={Admin} />
          <Route path="/:slug/notes" exact component={Notes} />
          <Route path="/:slug/settings" component={EventSetup} />
          <Route path="/:slug/attendees" render={(props) => <Attendees {...this.props} />} />
          <Route path="/:slug/invited" component={Invited} />
          <Route path="/:slug/pricing" component={Pricing} />
          <Route path="/:slug/revenue-management" component={RevenueManagement} />
          <Route path="/:slug/cluster-management" component={ClusterManagement} />
          <Route path="/:slug/request-management" component={RequestManagement} />
          <Route path="/:slug/transaction-history" component={TransactionHistory} />
          <Route path="/:slug/spaces" component={Rooms} />
          <Route path="/:slug/cart" component={Cart} />
          <Route path="/:slug/cart-calendar" component={CalendarContent} />
        </Switch>
        <Footer />
      </StyledApp>
    );
  }
}

const StyledApp = styled.div`
  min-height: calc(100vh - 70px);
  height: calc(100% - 66px);
  width: calc(100% - 240px);
  display: flex;
  flex-direction: column;
  padding-right: 20px;
  margin-left: 240px; /* same as sidebar width */
  

  .search-input {
    margin-top: 15px;
  }

  @media (max-width: 768px) {
    width: calc(100% - 160px);
    margin-left: 160px; /* same as sidebar width at viewport */
    padding-left: 20px;
  }
  
  @media (max-width: 576px) {
    width: 100%;
    margin-left: 0px;
    padding: 0;
    min-height: calc(100vh - 210px);
  }

  @media only screen and (min-width: 400px) {
    justify-content: flex-start;
    /*align-items: center;*/
  }
`

const mapStateToProps = (state: AppState) => ({
  showSearch:state.ui.showSearch
});

const mapDispatchToProps = function(dispatch: Dispatch) {
  return bindActionCreators(
    {
      setCurrentSearchText
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SlugRouting);