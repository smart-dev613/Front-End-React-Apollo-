import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { AppState } from '../store/root'
import { bindActionCreators, Dispatch, compose } from 'redux'
import { setCurrentPage } from '../store/ui/action'
import { Translation, Trans } from 'react-i18next'
// import Checkbox from '../components/Form/Checkbox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withApollo } from 'react-apollo'
import { GET_EVENT_INFO } from '../gql/queries'
import { updateEventSettings, publishEvent } from '../providers/events'

import Toggle from './Form/Toggle'
import Input from './Form/Input'
import Form from './Form/Form'
import FormRow from './Form/FormRow'
import FormGroup from './Form/FormGroup'
import Label from './Form/Label'
import Textarea from './Form/Textarea'
import DatePicker from './Form/DatePicker'
import Select from './Form/Select'
import TimezonePicker from './Form/TimezonePicker'
import { timezones } from './Form/TimezonePicker'
import Button from './Form/Button'
import moment from 'moment'
import ColourPicker from './Form/ColourPicker'
import ApolloClient from 'apollo-client'
import { userIsOrganiser } from '../util/common'
import { UserState } from '../store/user/types'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { getAvatarUploadToken } from '../providers/user'
import { uploadPresignedS3 } from '../providers/core/common'
import event_language from './enum/event_language' 

interface StateProps {
  page: string
  user: UserState
  client: ApolloClient<any>
}

interface DispatchProps {
  setCurrentPage: (page: string) => void
}

type Props = DispatchProps & StateProps

interface EventSetupState {
  dateMessage: string
  selectedStartDate: string
  selectedEndDate: string
  selectedLanguage: any
  selectedTimezone: any
  typeOptions: object[]
  name: string
  description: string
  type: string
  status: string
  formFieldErrors: string[]
  formError: boolean
  updateStatus: string
  organiser: object
  primaryColour: string
  secondaryColour: string
  isEditing: boolean
  imagePreviewUrl: any
  file: string
  shortStateDate: string
  shortEndDate: string
  eventId: string
  inputFile: File
  costPerSlot: string
  logoURL: string,
  menus: any[]
}

interface ThemeObject {
  logoURL: string
  primaryColour: string
  secondaryColour: string
}

interface UpdateEventAttributes {
  eventName: string
  description: string
  startAt: string
  endAt: string
  status: string
  slug: string
  theme: ThemeObject
  timezone: string
  timezoneLocation: string
  language: string
  menus: any[]
  name: string
}

interface UpdateEvent {
  data: {
    updateEvent: UpdateEventAttributes
  }
}

export class EventSetup extends Component<Props, EventSetupState> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      dateMessage: 'Please select a timeframe',
      shortStateDate: 'Please select a timeframe',
      shortEndDate: 'Please select a timeframe',
      selectedStartDate: '',
      selectedEndDate: '',
      selectedLanguage: { value: '', label: 'Select...' },
      selectedTimezone: { value: '', label: 'Select...' },
      typeOptions: [
        { label: 'English (en)', value: 'ENGLISH' },
        { label: 'Chinese (cn)', value: 'CHINESE' },
        { label: 'French (fr)', value: 'FRENCH' }
      ],
      name: '',
      description: '',
      type: '',
      status: 'DRAFT',
      organiser: {},
      formFieldErrors: [],
      formError: false,
      updateStatus: '',
      primaryColour: '',
      secondaryColour: '',
      isEditing: false,
      imagePreviewUrl: '',
      file: '',
      eventId: '',
      inputFile: null,
      costPerSlot: '',
      logoURL: '',
      menus: []
    }

    this.handleMakeLive = this.handleMakeLive.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.languageChange = this.languageChange.bind(this)
    this.dateRangeChange = this.dateRangeChange.bind(this)
    this.timezoneChange = this.timezoneChange.bind(this)
    this.inputChange = this.inputChange.bind(this)
    this.primaryColourChange = this.primaryColourChange.bind(this)
    this.secondaryColourChange = this.secondaryColourChange.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
    this.handleImageChange = this.handleImageChange.bind(this)
    this.handleFileUpload = this.handleFileUpload.bind(this)
    this.setGMTValues = this.setGMTValues.bind(this)
  }

  public componentDidMount() {
    this.props.setCurrentPage('settings-setup')
    const { eventName, eventType, description, startTime, status, organiser, endTime, theme: { primaryColour, secondaryColour, logoURL }, eventId, language, timezone, timezoneLocation, menus } = this.props.client.readQuery({ query: GET_EVENT_INFO })
    this.setState({
      name: eventName,
      description,
      type: eventType,
      selectedStartDate: startTime,
      selectedEndDate: endTime,
      selectedLanguage: {label: language, value: language},
      selectedTimezone: {label: timezone, value: `${timezone}___${timezoneLocation || ''}`},
      status,
      organiser: organiser,
      dateMessage: moment(startTime).format('D/MM/YYYY, h:mm:ss a') + ' - ' + moment(endTime).format('D/MM/YYYY, h:mm:ss a'),
      primaryColour,
      secondaryColour,
      shortStateDate: moment(startTime).format('DD/MM/YYYY'),
      shortEndDate: moment(endTime).format('DD/MM/YYYY'),
      eventId,
      logoURL,
      menus: menus || []
    }, () => this.setGMTValues(`${timezone}___${timezoneLocation || ''}`))
  }

  public setGMTValues(timezone: string) {
    if (timezone) {
      let selectedTimezone = timezones.find(time => time.value.startsWith(timezone))
      if (selectedTimezone) {
        this.setState({
          selectedTimezone: {
            ...this.state.selectedTimezone,
            value: selectedTimezone.value,
            label: selectedTimezone.label
          }
        })
      }
      
    }
  }

  public cancelEdit() {

    this.setState({ isEditing: !this.state.isEditing });
  }

  public handleMakeLive() {
    this.setState({
      formError: false,
      updateStatus: 'Working...'
    })

    const { eventId } = this.props.client.readQuery({ query: GET_EVENT_INFO })
    publishEvent(eventId)
      .then((response) => {
        this.setState({
          updateStatus: 'Event is live.',
          status: 'LIVE'
        })
      })
      .catch(err => {
        console.log('publish event failed')
      })
  }

  // public handleEdit(e: React.MouseEvent | React.FormEvent) {
  //   e.preventDefault();
  //   if (this.state.isEditing) {
  //     this.setState({ isEditing: !this.state.isEditing }, () => {

  //       })
  //     });
  //   } else {
  //     this.setState({ isEditing: !this.state.isEditing }, () => {
  //       // this.textInput.focus();
  //       console.log("handle edit");
  //     });
  //   }
  // }

  public handleSubmit() {
    // this.props.setLoadingOverlay(true)
    // if (this.state.isEditing) {
    //   this.setState({ isEditing: !this.state.isEditing }, () => {
    if (this.state.isEditing) {
      this.setState({
        formError: false,
        updateStatus: 'Working...'
      })

      // should match fields from formData below
      let optionalFields = ['logoURL', 'primaryColour', 'secondaryColour']

      const timezoneToken = this.state.selectedTimezone.value.split('___')

      const formData = {
        name: this.state.name,
        description: this.state.description,
        startAt: this.state.selectedStartDate,
        endAt: this.state.selectedEndDate,
        primaryColour: this.state.primaryColour,
        secondaryColour: this.state.secondaryColour,
        logoURL: this.state.logoURL,
        language: event_language['ENGLISH'],
        timezone: timezoneToken[0],
        timezoneLocation: timezoneToken[1]
      }

      let errorArr = [] as any
      Object.keys(formData).map(key => {
        // @ts-ignore
        if (!formData[key] && !optionalFields.includes(key)) errorArr.push(key)
      })

      this.setState({ formFieldErrors: errorArr }, () => {
        if (this.state.formFieldErrors.length) {
          // this.setState({
          //   formError: true
          // }, () => this.props.setLoadingOverlay(false))
          this.setState({
            formError: true,
            updateStatus: `Please fill out the ${this.state.formFieldErrors[0]} field`
          })
        } else {
          const { eventId } = this.props.client.readQuery({ query: GET_EVENT_INFO })
          updateEventSettings({
            id: eventId,
            ...formData
          })
            .then((response: UpdateEvent) => {
              const { client } = this.props
              if(response.data && response.data.updateEvent){
                client.writeData({data: {
                  eventName: response.data.updateEvent.name,
                  description: response.data.updateEvent.description,
                  startTime: response.data.updateEvent.startAt,
                  endTime: response.data.updateEvent.endAt,
                  status: response.data.updateEvent.status,
                  slug: response.data.updateEvent.slug,
                  theme: {__typename: "eventTheme", ...response.data.updateEvent.theme},
                  timezone: response.data.updateEvent.timezone,
                  timezoneLocation: response.data.updateEvent.timezoneLocation,
                  language: response.data.updateEvent.language,
                  menus: response.data.updateEvent.menus
                }})
              }
              this.setGMTValues(this.state.selectedTimezone.value)
              this.setState({
                updateStatus: 'Success!',
                isEditing: !this.state.isEditing
              })
            })
            .catch(err => {
            })
        }
      })
    } else {
      this.setState({ isEditing: !this.state.isEditing }, () => {
        // this.textInput.focus();
      });
    }


  }

  public languageChange(e: any) {
    this.setState({
      selectedLanguage: e
    })
  }

  public handleStatus() {
    // <span className="badge badge-primary">Draft</span>
    // <span className="badge badge-success">Live</span>
    switch (this.state.status) {
      case 'DRAFT':
      default:
        return <p className="status-container"> <span className="event-status draft"></span> <Button text='Make Live' addClassName='btn-success btn-sm' onClick={this.handleMakeLive} /></p>
      case 'LIVE':
        return <span className="event-status success"></span>
    }
  }

  public dateRangeChange(e: any, picker: any) {
    this.setState({
      selectedStartDate: picker.startDate.format(),
      selectedEndDate: picker.endDate.format(),
      dateMessage: picker.startDate.format('D/MM/YYYY, h:mm:ss a') + ' - ' + picker.endDate.format('D/MM/YYYY, h:mm:ss a'),
      shortStateDate: picker.startDate.format('D/MM/YYYY'),
      shortEndDate: picker.startDate.format('D/MM/YYYY')
    })
  }

  public timezoneChange(e: any) {
    this.setState({
      selectedTimezone: e
    })
  }

  public inputChange(e: any) {
    const target = e.target,
      value = target.value,
      name = target.name

    // @ts-ignore
    this.setState({
      [name]: value
    })
  }

  public primaryColourChange(colour: any) {
    this.setState({
      primaryColour: colour.hex
    })
  }

  public secondaryColourChange(colour: any) {
    this.setState({
      secondaryColour: colour.hex
    })
  }

  public handleImageChange(e: any) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
        inputFile: file
      }, () => this.handleFileUpload(file))
    }
    reader.readAsDataURL(file)
  }

  public handleFileUpload(files: FileList | null) {

    if (files === null) return

    // use first file
    const file = files[0]

    // this.props.setLoadingOverlay(true)
   const key = file.name
    getAvatarUploadToken(this.state.eventId, key)
      .then((result: any) => {
        if (result.data.getS3POSTUploadToken) {
          const data = result.data.getS3POSTUploadToken

          // construct the FormData manually for sending to S3
          const formData = new FormData()
          // formData.append('Content-Type', file.type)
          formData.append('Content-Type', this.state.inputFile.type)

          // add all the required presigned fields
          Object.entries(data.fields).forEach(([k, v]) => {
            formData.append(k, v as any)
          })

          // add the object key in the bucket (lbi-avatars/USER_ID/image.png)
          // @ts-ignore
          formData.append('key', `event-logo/${this.state.eventId}/${this.state.inputFile.name}`)

          // ACL must be public read
          formData.append('acl', 'public-read')

          // and finally add the file itself (this should be last)
          formData.append('file', this.state.inputFile)

          return uploadPresignedS3(data.url, formData)
            .then((res: any) => {
              if (res.status !== 204) {
                // TODO: show nice error to user
                console.error('File could not be uploaded to S3')
              } else {
                let previewUrl = `https://user-assets.synkd.life/event-logo/${this.state.eventId}/${this.state.inputFile.name}`
                if (previewUrl) {
                  this.setState({
                    imagePreviewUrl: previewUrl,
                    logoURL: previewUrl
                  })
                }
                // const updatedEmployee = {
                //   ...this.state.employee,
                //   // @ts-ignore
                //   avatar: `https://user-assets.synkd.life/lbi-avatars/${this.props.match.params.employeeId}/${file.name}`
                // }
                // this.setState({
                //   employee:updatedEmployee
                // })
                // TODO: update in the database otherwise this won't persist after a refresh
                // TODO: CloudFront (CDN) purging/cache control for files with the same name
              }
            })
        } else {
          alert('Error getting upload token for avatar upload')
        }
      })
      .catch((err: any) => {
        console.error(err)
      })
  }



  public render() {
    if (Object.keys(this.state.organiser).length === 0) return null
    let isOrganiser = userIsOrganiser(this.props.user, this.state.organiser)
    if (!isOrganiser) return <p>You do not have access to this page as you are not an event organiser.</p>

    let { imagePreviewUrl } = this.state;
    let $imagePreview: any = '';
    if (imagePreviewUrl) {
      $imagePreview = (<img className='imgStyle' src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }

    return (
      <Translation>
        {
          () =>
            <StyledDashboard className='main-container'>

              <p className='status-text'>{this.state.updateStatus}</p>
              {this.state.isEditing ? <button
                type="submit"
                className="btn-primary btn-tick btn"
                onClick={this.handleSubmit}
              >
                <FontAwesomeIcon
                  icon="check"
                />
              </button> : <button
                type="submit"
                className="btn-edit btn btn-primary"
                onClick={this.handleSubmit}
              >
                  <FontAwesomeIcon
                    icon="pencil-alt"
                  />
                </button>}

              {this.state.isEditing && (
                <button
                  type="submit"
                  className="btn btn-danger btn-close"
                  onClick={this.cancelEdit}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}


              {/* <h3 className='page-title'>Edit event settings</h3> */}
              <Form id='changeSettings' onSubmit={this.handleSubmit}>
                <FormRow>
                  <FormGroup>
                    <Label colSize='3' labelFor='name'>Name:</Label>
                    <Input
                      colSize='6'
                      name='name'
                      id='name'
                      type='text'
                      inputValue={this.state.name}
                      onChange={this.inputChange}
                      fieldError={this.state.formFieldErrors.includes('name')}
                      disabled={!this.state.isEditing} />

                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <Label colSize='3' labelFor='description'>Description:</Label>
                    <Textarea
                      colSize='6'
                      name='description'
                      id='description'
                      value={this.state.description}
                      onChange={this.inputChange}
                      fieldError={this.state.formFieldErrors.includes('description')}
                      disabled={!this.state.isEditing} />

                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <Label colSize='3' labelFor='type'>Status:</Label>
                    {this.handleStatus()}
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <Label colSize='3' labelFor='type'>Event type:</Label>
                    <Input
                      colSize='3'
                      name='type'
                      id='type'
                      type='text'
                      disabled
                      inputValue={this.state.type} />

                  </FormGroup>
                </FormRow>
                {/* <FormRow>
                  <FormGroup>
                    <Label colSize='3' labelFor='costPerSlot'>Cost per slot:</Label>
                    <Input
                      colSize='3'
                      name='costPerSlot'
                      id='costPerSlot'
                      type='text'
                      disabled={!this.state.isEditing}
                      value={this.state.costPerSlot}
                      onChange={this.inputChange} />

                  </FormGroup>
                </FormRow> */}
                <FormRow addClassName='desktop'>
                  <FormGroup>
                    <Label colSize='3' labelFor='eventDateRange'>Date range:</Label>
                    <DatePicker

                      drops='up'
                      onDateApply={this.dateRangeChange}
                      size={6}
                      inForm
                      dateMessage={this.state.dateMessage}
                      startDate={this.state.selectedStartDate}
                      endDate={this.state.selectedEndDate}
                      fieldError={this.state.formFieldErrors.includes('startAt') || this.state.formFieldErrors.includes('endAt')}
                      disabled={!this.state.isEditing}
                    // fieldError={(this.state.formFieldErrors.includes('Start') || this.state.formFieldErrors.includes('End'))}
                    />
                  </FormGroup>
                </FormRow>
                <FormRow addClassName='mobile'>
                  <FormGroup>
                    <Label colSize='3' labelFor='name'>Start Date:</Label>
                    <DatePicker

                      drops='up'
                      onDateApply={this.dateRangeChange}
                      size={6}
                      inForm
                      dateMessage={this.state.shortStateDate}
                      startDate={this.state.selectedStartDate}
                      endDate={this.state.selectedEndDate}
                      fieldError={this.state.formFieldErrors.includes('startAt') || this.state.formFieldErrors.includes('endAt')}

                    // fieldError={(this.state.formFieldErrors.includes('Start') || this.state.formFieldErrors.includes('End'))}
                    />

                  </FormGroup>
                </FormRow>
                <FormRow addClassName='mobile'>
                  <FormGroup>
                    <Label colSize='3' labelFor='name'>End Date:</Label>
                    <DatePicker

                      drops='up'
                      onDateApply={this.dateRangeChange}
                      size={6}
                      inForm
                      dateMessage={this.state.shortEndDate}
                      startDate={this.state.selectedStartDate}
                      endDate={this.state.selectedEndDate}
                      fieldError={this.state.formFieldErrors.includes('startAt') || this.state.formFieldErrors.includes('endAt')}

                    // fieldError={(this.state.formFieldErrors.includes('Start') || this.state.formFieldErrors.includes('End'))}
                    />

                  </FormGroup>
                </FormRow>
                {/* <FormRow>
                  <FormGroup>
                    <Label colSize='3' labelFor='selectedLanguage'>Event language:</Label>
                    <Select
                      type='number'
                      isRequired='required'
                      options={this.state.typeOptions}
                      name='selectedLanguage'
                      colSize='4'
                      id='selectedLanguage'
                      // disabled={!!this.props.info.data.unavailable}
                      onChange={this.languageChange}
                      value={this.state.selectedLanguage}
                      disabled={!this.state.isEditing}
                    // fieldError={this.state.formFieldErrors.includes('EventType')}
                    />
                  </FormGroup>
                </FormRow> */}
                <FormRow>
                  <FormGroup>
                    <Label colSize='3' labelFor='selectedTimezone'>Event timezone:</Label>
                    <TimezonePicker
                      onChange={this.timezoneChange}
                      name='selectedTimezone'
                      colSize='4'
                      id='selectedTimezone'
                      value={this.state.selectedTimezone}
                      disabled={!this.state.isEditing}
                    />
                  </FormGroup>
                </FormRow>
                <hr />
                <h5>Theme</h5>
                <FormRow>
                  <FormGroup colSize='6'>
                    {/* <Label labelFor='logo'>Logo Upload:</Label> */}
                    <input className="fileInput" type="file" onChange={(e) => this.handleImageChange(e)} disabled={!this.state.isEditing} />
                  </FormGroup>
                  <FormGroup colSize='6'>
                    {this.state.logoURL ? <img className="imgStyle" src={this.state.logoURL} /> : ''}
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup colSize='6'>
                    <Label colSize='4' labelFor='primaryColour'>Primary colour:</Label>
                    <ColourPicker
                      colour={this.state.primaryColour}
                      onChange={this.primaryColourChange}
                      disabled={!this.state.isEditing}
                    />
                  </FormGroup>
                  <FormGroup colSize='6'>
                    <Label colSize='5' labelFor='secondaryColour'>Secondary colour:</Label>
                    <ColourPicker
                      colour={this.state.secondaryColour}
                      onChange={this.secondaryColourChange}
                      disabled={!this.state.isEditing}
                    />
                  </FormGroup>
                </FormRow>
              </Form>
              {/* <Button text='Save' addClassName='btn-primary' onClick={this.handleSubmit} />
              <p className='status-text'>{this.state.updateStatus}</p> */}
            </StyledDashboard>
        }
      </Translation>
    )
  }
}

const StyledDashboard = styled.div`

margin-top: 1em;

.imgPreview {
  text-align: center;
  margin: 5px 15px;
  height: 200px;
  width: 500px;
  border-left: 1px solid gray;
  border-right: 1px solid gray;
  border-top: 5px solid gray;
  border-bottom: 5px solid gray;
}
  
.imgStyle {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 3px solid grey;
  }

form {
  background: #f7f7f7;
  padding: 1em;
  border-radius: 5px;
  margin: 1em 0;
}
.status-container {
  display: flex;
}
.event-status {
  display: block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  display: flex;
  // position: absolute;
  // right: 18px;
  margin: 10px 10px 0px 0px;
}
.draft {
  background-color: yellow;
}
.success {
  background-color: green;
}



.status-text {
  display: inline-block;
  margin-left: 1em;
}

.btn {
  display: inline-block;
}

#selectedLanguage,
#selectedTimezone {
  padding: 0;
}

.content {
  display: block;
}

.content-left {
  float: left;
  display: inline-block;
}

.content-right {
  float: right;
  display: inline-block;
}

.content-div {
  display: block;
  margin: 10px;
}

.content-icon {
  float: left;
  margin: 0px 5px;
}

.col-sm {
    height: 120px;

    .nav-tile {
    height: 100%;
    align-items: center;
    display: flex;
    justify-content: center;
    width: 100%;
    color: #ffffff;
    background: #343a40;
    box-shadow: 1px 2px 5px 0px rgba(0,0,0,0.3);
    border-radius: 5px;
    font-size: 1.25em;

    p {
        margin: auto;
    }
    }
}

@media only screen and (min-width: 576px) {
  height: calc(100vh - 56px);
  .btn-edit {
    position: absolute;
    top: 140px;
    right: 50px;
   border: none;
   //  color: #2dc3ca;
   z-index: 1;
  }

  .btn-tick {
    position: absolute;
    top: 140px;
    right: 100px;
    border: none;
   //  color: #2dc3ca;
   z-index: 1;
 }

 .mobile {
  display: none;
}

.desktop {
  display: block;
}
 
 
 
 .btn-close {
   //  color: #dc3545;
    position: absolute;
    top: 140px;
    right: 50px;
   border: none;
   z-index: 1;
 }
}



@media only screen and (max-width: 576px) {
  .desktop {
    display: none;
  }
  height: calc(100vh - 56px);
  .btn-edit {
    position: absolute;
    top: 75px;
    right: 15px;
   border: none;
   //  color: #2dc3ca;
   z-index: 1;
  }

  .btn-tick {
    position: absolute;
    top: 75px;
    right: 65px;
    border: none;
   //  color: #2dc3ca;
   z-index: 1;

   

   

   .mobile {
    display: block;
  }
 }
 
 
 
 .btn-close {
   //  color: #dc3545;
    position: absolute;
    top: 75px;
    right: 20px;
   border: none;
   z-index: 1;
 }
}


`

const mapStateToProps = function (state: AppState) {
  return {
    page: state.ui.page,
    user: state.user
  }
}

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      setCurrentPage
    },
    dispatch
  )
}

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(EventSetup)
