import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import moment, { Moment } from 'moment'
import { Executives } from '../../store/user/types'
import { connect } from "react-redux"
import { bindActionCreators, Dispatch, compose } from "redux"
import { withRouter } from 'react-router-dom'
import qs from 'qs'
import companyPlaceholder from '../../assets/images/icons/company_placeholder.jpg'
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
// import CalendarView from './Calendar/CalendarView';
// import CalendarView from './Calendar/CalendarView';

// import { updateVenue } from '../../providers/events'
// import { withApollo } from 'react-apollo'
// import { AppState } from "../../store/root" 
// import { UIState } from "../../store/ui/types" 

interface CalendarComponent {
  dayData: JSX.Element[] | {},
  timeSlotData: {},
  click: () => void,
  dropdownClass: string,
  months: Moment,
  previousMonth: () => void,
  nextMonth: () => void
  today: boolean
  currentDay: () => void
  executivesList: Executives[]
  venueList: any[]
  allBookedSchedule: any[]
  checkSchedule: (arg1: Executives) => void
  setVenueSelected: (value: any[]) => void
  showButton: boolean
  mobileCurrentDate: {
    day: string
    date: string
  }
  companyName: string
  companyLogo?: string
}

interface CalendarDataState {
  dropdownLabel: string
  loadedEmployeeFromQueryString: boolean
}
// let dropdownLabel = 'Employees'


// const CalendarData = (props: CalendarComponent) => (
class CalendarData extends React.Component<CalendarComponent, CalendarDataState> {

  public constructor(props: CalendarComponent) {
    super(props)
    this.state = {
      dropdownLabel: 'Employees',
      loadedEmployeeFromQueryString: false
    }
  }

  public componentDidUpdate() {
    if (this.state.loadedEmployeeFromQueryString === false) {
      // @ts-ignore
      let location = this.props.location
      let query = qs.parse(location.search, { ignoreQueryPrefix: true })
      if (query.eId) {
        let matchingExec = this.props.executivesList.find((exec) => {
          return exec.companyMembershipID === query.eId
        })

        if (matchingExec) {
          this.setState({
            dropdownLabel: `${matchingExec.firstName} ${matchingExec.lastName}`,
            loadedEmployeeFromQueryString: true
          })
          this.props.checkSchedule(matchingExec)
        }
      }
    }
  }

  public updateName = (event: any) => {
    let dropdown = this.state.dropdownLabel
    event.preventDefault()
    dropdown = event.currentTarget.textContent
    if (dropdown) {
      this.setState({
        dropdownLabel: dropdown
      })
    }
  }

  handleChange = (selectedOption: any) => {
    this.props.checkSchedule(selectedOption)
  };
  handleChangeVenue = (selectedOption: any) => {
    this.props.setVenueSelected(selectedOption)
  };

  public render() {
    for (var i = 0; i < this.props.executivesList.length; i++) {
      this.props.executivesList[i].value = this.props.executivesList[i].firstName + " " + this.props.executivesList[i].lastName;
      this.props.executivesList[i].label = this.props.executivesList[i].firstName + " " + this.props.executivesList[i].lastName;
    }
    return (
      <>
      <div className='row calendarComponent'>
        <div className='calendar-header'>
          <div className="company-info">
          </div>
          <div className="header-buttons custom-calander-header">
            <div className="companyLogo">
              <img
                src={this.props.companyLogo || companyPlaceholder}
                alt="company-image"
              />
              <span className="custom-company-name">
                <b>{this.props.companyName}</b>
              </span>
            </div>
            <div className="box-align box-align-employee" style={{ width: 400 }}>
              {/* <button
                className='select-executive btn btn-secondary mr-3'
                type='button'
                onClick={this.props.currentDay}>Today</button> */}
                <div style={{ display: 'flex' }}>
                  <ReactMultiSelectCheckboxes placeholderButtonLabel="Employee" options={this.props.executivesList} onChange={this.handleChange} />
                  <ReactMultiSelectCheckboxes placeholderButtonLabel="Venue" options={this.props.venueList.map(item => ({
                    label: item.name,
                    value: item._id
                  }))} onChange={this.handleChangeVenue} />
              </div>
            </div>

            {/* {this.props.showButton && <div className='dropdown box-align' onClick={this.props.click}>
              <button className='select-executive btn btn-secondary dropdown-toggle'
                data-toggle='dropdown' type='button' aria-haspopup='true' id='dropdownMenuButton'>{this.state.dropdownLabel}<span className='caret'></span>
              </button>

              <div className={this.props.dropdownClass} aria-labelledby='dropdownMenuButton'>
                {this.props.executivesList.map(executive => {
                  return (
                    <a key={executive.id} className='dropdown-item' onClick={(e) => { this.props.checkSchedule(executive), this.updateName(e) }} >
                      {executive.firstName + ' ' + executive.lastName}
                    </a>
                  )
                })}
              </div>
            </div>} */}
          </div>
        </div>
        {/* <div className='col-sm title month-label cal-margin box-align'>
          <span className="mr-auto" onClick={this.props.previousMonth}>
            <FontAwesomeIcon icon="chevron-left" />
          </span> {this.props.months.format("MMMM YYYY")}
          <span className="ml-auto" onClick={this.props.nextMonth}>
            <FontAwesomeIcon icon="chevron-right" />
          </span>
        </div>
        <div className='col-sm title day-label cal-margin'>
          {this.props.dayData}
        </div>

        <div className='col-sm p-0'>
          <table className="custom-calendar-table">
            <tbody>
              {this.props.timeSlotData}
            </tbody>
          </table>
        </div> */}
        
      </div>
        {/* <div>
          <CalendarView />
        </div> */}
        </>
    )
  }
}

// const mapStateToProps = (state: AppState) => ({

// })

// const mapDispatchToProps = (dispatch: Dispatch) => {
//   return bindActionCreators(
//     {

//     },
//     dispatch
//   )
// }

export default compose(withRouter, connect(null, null))(CalendarData)