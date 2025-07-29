import React, { useEffect, useMemo, useState, useCallback } from 'react';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';

/** Components */
import { Formik, Form } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faSave, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';
import {
  InputField,
  InputSelectField,
  InputWithCheckboxField,
  TextareaWithCheckboxField,
  ColorPickerField,
  DateRangeField,
  ContentMenuField,
  InputTypeField,
  PageAccessField,
  InputSelectWithCheckboxField,
  InputMultiSelectField,
  CheckboxGroupField,
  QRFiled,
  SingleRowInputCheckboxField
} from '../../../FormikItem';
import ColorPickerFontField from '../../../FormikItem/ColorPickerFontField';
import { Container } from './components/general';
import FormRow from '../../../Form/FormRow';
import EventType from '../../../FormikItem/EventType';

/** Utils */
import moment from 'moment';
import { bindActionCreators, Dispatch, compose } from 'redux';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { GET_EVENT_INFO } from '../../../../gql/queries';
import { updateEventSettings, publishEvent, getEventAttendees } from '../../../../providers/events';
import { userIsAuthorised, userIsOrganiser } from '../../../../util/common';

/** Store */
import { setCurrentPage } from '../../../../store/ui/action';

/** Constants */
import { ValidationSchema } from './validator';
import { timezones } from '../../../Form/TimezonePicker';
import { PAGE_MAPPING, PlatformEventMenuPage } from '../../../../constants/menu';

/** Types */
import { Props } from './types';
import { AppState } from '../../../../store/root';

import logo from '../../../../assets/images/inspired_logo.png';
import InputMultiSelectFieldItem from '../../../FormikItem/InputMultiSelectField';
import Input from '../../../Form/Input';
import Label from '../../../Form/Label';
import InputMultiSelectWithCheckboxField from '../../../FormikItem/InputMultiSelectWithCheckboxField';
import { getPlatformEventMembers } from '../../../../providers/events'
import "./Setup.css"

const Setup: React.FC<Props> = (props: Props) => {
  const [edit, setEdit] = useState(false);

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const { ui, client, user, setCurrentPage } = props;

  const [attendeesList, setAttendeesList] = useState([]);

  //todo: API
  const [availableQRCodes, setAvailableQRCodes] = useState([
    {
      label: 'First Name',
      value: 'firstName',
    },
    {
      label: 'Last Name',
      value: 'lastName',
    },
    {
      label: 'Avatar',
      value: 'avatar',
    },
    {
      label: 'Company',
      value: 'compay',
    },
    {
      label: 'Job Title',
      value: 'job_title',
    },
  ]);

  //@ts-ignore
  let autocomplete: any = null;

  useEffect(() => {
    //@ts-ignore
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('location'), {});
    //@ts-ignore
    autocomplete.addListener('place_changed', handlePlaceSelect);
  }, []);

  const handlePlaceSelect = () => {
    // if()
    //@ts-ignore
    let addressObject = autocomplete.getPlace();
    let address = addressObject.address_components;
    // console.log('Address is: ', addressObject);
    document.getElementById('location').setAttribute('value', addressObject.formatted_address);
    // const addressLen = address.length
    // let j = addressLen - 1
    // if (address[j].types.includes('postal_code')) {
    //   console.log('THE POSTCODE SIS:')
    //   this.props.handleInputChangePostcode(`${address[addressLen - 1].short_name}`)
    //   j = j - 1
    // }
    // if (address[j].types.includes('country')) {
    //   //Change Country
    //   // COUNTRIES
    //   const selectedCountry = COUNTRIES.filter(obj => obj.value.toLowerCase() === address[addressLen - 2].short_name.toLowerCase() || obj.label.toLowerCase() === address[addressLen - 2].long_name.toLowerCase())
    //   console.log('THE SELEVYED COUNTRY SIS: ', selectedCountry)
    //   this.props.handleCountryChange(selectedCountry)
    // }
    // let addressLine = ''
    // for (let i = 0; i < j; i++) {
    //   if (address[i].types.includes('postal_town')) {
    //     this.props.handleInputChangeTown(address[i].long_name)
    //   } else {
    //     addressLine = addressLine + address[i].long_name + ' '
    //   }
    // }
    // this.props.handleInputChangeAddress(addressLine)
    // // this.setState({
    // //   name: addressObject.name,
    // //   street_address: `${address[0].long_name} ${address[1].long_name}`,
    // //   // city: address[4].long_name,
    // //   // state: address[6].short_name,
    // //   // zip_code: address[8].short_name,
    // //   // googleMapLink: addressObject.url
    // })
  };

  const {
    data: {
      eventType,
      startTime,
      endTime,
      organiser,
      event: {
        id,
        name,
        name_check,
        description,
        description_check,
        theme,
        language,
        theme: { 
          logoURL,
          primaryColour, 
          secondaryColour,
          calendarPrimaryColour,
          calendarPrimaryTextColour,
          calendarSecondaryColour,
          calendarSecondaryTextColour
         },
        location,
        location_check,
        timezone,
        timezoneLocation,
        qr_code_url,
        qr_code_url_check,
        privacy,
        privacy_check,
        legal,
        legal_check,
        contact_us,
        contact_us_check,
        your_data,
        your_data_check,
        header_image,
        header_image_check,
        left_image,
        left_image_check,
        right_image,
        right_image_check,
        logo_image_check,
        menus,
      },
    },
  }: any = useQuery(GET_EVENT_INFO);

  // console.log("menus", menus)


  
  const getAttendees = useCallback(async () => {
    try {

      const { data }: any = await getPlatformEventMembers(id);
   

      if (data) {
        const { getPlatformEventMembers } = data;

        const newAttendees = Object.values(getPlatformEventMembers).map((attendee: any) => {

          const profile = attendee?.profile ? attendee?.profile : attendee.user
          return {
            ...attendee,
            companyId: profile?.company?.id,
            userId: attendee.user.id,
            avatar: profile.avatar,
            name: [attendee.user.firstName, attendee.user.lastName].filter((item: any) => item).join(' '),
            company: profile?.company?.name,
            email: profile.email,
            status: attendee.status,
            profiles:  profile.profiles,
          }
        
          
        });

        setAttendeesList(newAttendees);
      }
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  function getWindowDimensions() {
    const { innerWidth: width } = window;
    return width;
  }

  useEffect(() => {

    setCurrentPage('Setup');

    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);

  }, []);

  useEffect(() => {

    getAttendees();
    console.log("calendar: ", calendarPrimaryColour, calendarSecondaryColour)

  }, [getAttendees]);

  const menusDict = useMemo(() => {
    // @ts-ignore


    const selectedMenus = menus && menus.length ? menus : PAGE_MAPPING[eventType];
  
    const menusDict = (selectedMenus || []).reduce((acc: any, curr: any) => {
      if (curr.type !== PlatformEventMenuPage.CONTENT_CUSTOM && curr.type !== PlatformEventMenuPage.ADMIN) {
        acc[curr.type] = curr;
      }
      return acc;
    }, {});


    return menusDict;

  }, [menus, eventType]);

  

  const generateMenuSelectField = useCallback(
    (menuType) => {

      const userVisible = [];
      const userAdmin = [];

      const pageMenus = (menus || []).filter(
        (item) => item.type === menuType
      );

      pageMenus.forEach((item) => {

        const defaultUserVisibleItems = (attendeesList|| [])
          .map((attendee) => {
            return { label: attendee.name, value: attendee.userId };
          })
          .filter(Boolean);

        const userVisibleItems = (item.userVisible || [])
          .map((us) => {
            const attendee = attendeesList.find((at) => at.userId === us.id);
            if (!attendee) return null;
            return { label: attendee.name, value: attendee.userId };
          })
          .filter(Boolean);

        const userAdminItems = (item.userAdmin || [])
          .map((us) => {
            const attendee = attendeesList.find((at) => at.userId === us.id);
            if (!attendee) return null;
            return { label: attendee.name, value: attendee.userId };
          })
          .filter(Boolean);
        
        if(item.showToAll){
          userVisible.push({ label: 'All', value: 'all' })

        } else if (userVisibleItems.length > 0) {
          userVisible.push(...userVisibleItems);
        } else {
          userVisible.push(...defaultUserVisibleItems);

        }
        userAdmin.push(...userAdminItems);
        
      });

      return { userVisible, userAdmin };
    },

    [menus, attendeesList] 
  );

  const currentMenu = menus.find(menu => {
    let currentUrl = window.location.pathname.split("/").slice(-1)[0];
    return menu?.link?.includes(`/${currentUrl}`);;
  })

  const menuPages = [
    PlatformEventMenuPage.COMPANIES,
    PlatformEventMenuPage.ATTENDEES,
    PlatformEventMenuPage.CONTENT,
    PlatformEventMenuPage.CALENDAR,
    PlatformEventMenuPage.CART,
    PlatformEventMenuPage.HOME
];

  function getMenuProps(item, attendeesList) {
    return {
        name: item.label,
        name_check: item.show,
        type: item?.type,
        showToAll: item?.showToAll,
        link: item?.link,
        isPublic: item?.isPublic,
        userVisible: (item.userVisible || [])
          .map((us: any) => {
              const attendee = attendeesList.find((at: any) => at.userId === us.id);
              if (!attendee) return;
              return { label: attendee.name, value: attendee.userId };
          })
          .filter(Boolean),
        userAdmin: (item.userAdmin || [])
          .map((us: any) => {
              const attendee = attendeesList.find((at: any) => at.userId === us.id);
              if (!attendee) return;
              return { label: attendee.name, value: attendee.userId };
          })
          .filter(Boolean)
    };
}


  const isAuthorised = userIsAuthorised(user, organiser, currentMenu);

  if (!isAuthorised) {
    return (
      <Container ui={ui} theme={theme} className="container-fluid page-container py-4">
        <p>You do not have access to this page as you are not an event organiser.</p>
      </Container>
    );
  }

  return (
    <Container ui={ui} theme={theme} className="container-fluid page-container py-4">
      <Formik
        enableReinitialize={true}
        initialValues={{
          name: name || '',
          name_check: name_check || false,
          event_type: eventType[0].toUpperCase() + eventType.slice(1).toLowerCase(),
          description: description || '',
          description_check: description_check || false,
          primary_color: primaryColour,
          secondary_color: secondaryColour,
          calendar_primary_color: calendarPrimaryColour,
          calendar_secondary_color: calendarSecondaryColour,
          start_date: moment(startTime),
          end_date: moment(endTime),
          timezone: timezones.find((time) => time.value.startsWith(`${timezone}___${timezoneLocation}`)),
          location: location || '',
          location_check: location_check || false,
          qr_code_url: qr_code_url || '',
          qr_code_url_check: qr_code_url_check || false,
          privacy: privacy || 'https://',
          privacy_check: privacy_check || false,
          legal: legal || 'https://',
          legal_check: legal_check || false,
          contact_us: contact_us || '',
          contact_us_check: contact_us_check || false,
          your_data: your_data || 'https://',
          your_data_check: your_data_check || false,
          logo_image_check: logo_image_check || false,

          mainMenus: (menus || [])
          .filter((menu: any) => menuPages.includes(menu.type))
          .map((item: any) => getMenuProps(item, attendeesList)),
          
          customMenus: (menus || [])
            .filter((item: any) => (item.type === PlatformEventMenuPage.CONTENT_CUSTOM || item.type === PlatformEventMenuPage.ADMIN))
            .map((item: any) => ({
              name: item.label,
              name_check: item.show,
              type: item?.type,
              showToAll: item?.showToAll,
              link: item?.link,
              isPublic: item?.isPublic,
              userVisible: ((item.userVisible || [])
                .map((us: any) => {
                  //if(item?.showToAll) return attendeesList;    
                  const attendee = attendeesList.find((at: any) => at.userId === us.id);
                  if (!attendee) return;
                  return { label: attendee.name, value: attendee.userId };
                })
                .filter(Boolean)),
              userAdmin: (item.userAdmin || [])
                .map((us: any) => {
                  const attendee = attendeesList.find((at: any) => at.userId === us.id);
                  if (!attendee) return;
                  return { label: attendee.name, value: attendee.userId };
                })
                .filter(Boolean),
            })),

          header_image,
          header_image_check,
          left_image,
          left_image_check,
          right_image,
          right_image_check,
          logo_image: theme.logoURL ? theme.logoURL : logo,
          // logo_image_check:true,
        }}
        // validationSchema={ValidationSchema}
        onSubmit={async (values) => {
        
          try {
            const timezoneToken = values.timezone ? values.timezone.value.split('___') : ['', ''];

            let settings = {
              id,
              ...values,
              language,
              theme: {
                logoURL,
              },
              startAt: values.start_date.format(),
              endAt: values.end_date.format(),
              primaryColour: values.primary_color,
              secondaryColour: values.secondary_color,
              calendarPrimaryColour: values.calendar_primary_color,
              calendarSecondaryColour: values.calendar_secondary_color,
              timezone: timezoneToken[0],
              timezoneLocation: timezoneToken[1],
              menus: values.mainMenus.filter((item: any) => item.name)
              .map((item: any) => ({
                    show: item.name_check,
                    label: item.name,
                    showToAll: item?.showToAll,
                    type: item?.type,
                    link: item?.link,
                    isPublic: item?.isPublic,
                    adminOnly: false,
                    userVisible: (item.userVisible || []).filter((item: any) => item?.value && item.value !== "all").map((item: any) => item.value),
                    userAdmin: (item.userAdmin || []).filter((item: any) => item?.value && item.value !== "all").map((item: any) => item.value),
                  })).concat(
                    values.customMenus
                      .filter((item: any) => item.name)
                      .map((item: any) => ({
                        show: item.name_check,
                        label: item.name,
                        showToAll: item?.showToAll,
                        link: item?.link,
                        isPublic: item?.isPublic,
                        type: (item.type === "ADMIN" ) ? PlatformEventMenuPage.ADMIN : PlatformEventMenuPage.CONTENT_CUSTOM,
                        parameter: (item.type === "ADMIN" ) ? "" : `type=${item.name}` ,
                        adminOnly: false,
                        userVisible: (item.userVisible || []).filter((item: any) => item?.value && item.value !== "all").map((item: any) => item.value),
                        userAdmin: (item.userAdmin || []).filter((item: any) => item?.value && item.value !== "all").map((item: any) => item.value),
                      }))
                  ),
            }

          

            //return;
    
            const response: any = await updateEventSettings(settings);

            if (response.data && response.data.updateEvent) {
              if (response.data.updateEvent.error) {
                return alert(response.data.updateEvent.error);
              }
              // console.log("response menu", response.data.updateEvent);

              client.writeData({
                data: {
                  eventName: response.data.updateEvent.name,
                  description: response.data.updateEvent.description,
                  startTime: response.data.updateEvent.startAt,
                  endTime: response.data.updateEvent.endAt,
                  status: response.data.updateEvent.status,
                  slug: response.data.updateEvent.slug,
                  theme: {
                    __typename: 'eventTheme',
                    ...response.data.updateEvent.theme,
                  },
                  timezone: response.data.updateEvent.timezone,
                  timezoneLocation: response.data.updateEvent.timezoneLocation,
                  language: response.data.updateEvent.language,
                  event: {
                    __typename: 'eventAll',
                    ...response.data.updateEvent,
                    theme: {
                      __typename: 'eventAllTheme',
                      ...response.data.updateEvent.theme,
                    },
                    menus: response.data.updateEvent.menus.map((item: any) => ({
                      __typename: item.label,
                      ...item,
                      userVisible: (item.userVisible || []).map((uv: any) => ({
                        __typename: `user-all-${uv.id}`,
                        ...uv,
                      })),
                      userAdmin: (item.userAdmin || []).map((uv: any) => ({
                        __typename: `user-all-admin-${uv.id}`,
                        ...uv,
                      })),
                    })),
                  },
                },
              });

              setEdit(false);
              window.location.reload();
            }

          } catch (error) {
            console.log(error);
          }


        }}
      >
        {({ handleReset, setFieldValue, values }) => {
          console.log("setting values: ", values)
          return (
          <Form>
            <div className="action-button-top">
              <h1 className="heading1">Setup</h1>
              <div>
                {edit ? (
                  <div className="setup_edit">
                    <button type="submit" className="btn-purple btn">
                      <FontAwesomeIcon icon={faSave} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-close"
                      onClick={() => {
                        handleReset();
                        setEdit(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ) : (
                  <div className="setup_edit">
                    <div className="setup_status setup_status-green"></div>
                    <button
                      type="button"
                      className="btn btn-purple"
                      onClick={(e) => {
                        e.preventDefault();
                        setEdit(true);
                        console.log("initial values: ", values)
                      }}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="form-design-container">
              <div className="">
                <div className="form-design-row">
                  <InputWithCheckboxField
                    disable_check={edit ? false : true}
                    width={windowDimensions}
                    name={'name'}
                    label={'Name'}
                  />

                  <EventType
                    disable_check={edit ? true : true}
                    width={windowDimensions}
                    name={'event_type'}
                    label={'Event Type'}
                    addLabelClass={'col-md-3 col-sm-2'}
                    inputClassName={'col-md-9 col-sm-10'}
                  />
                </div>

                <div className="form-design-row">
                  <TextareaWithCheckboxField
                    disable_check={edit ? false : true}
                    width={windowDimensions}
                    name="description"
                    label="Description"
                  />
                  <div
                    className={`form-group d-flex ${
                      windowDimensions <= 1000 ? 'col-sm-12' : 'col-sm-6 '
                    }  color-column`}
                  >
                    <div className={`form-design-color ${windowDimensions <= 1000 ? 'no-side-padding col-sm-12' : ''}`}>
                      <div>
                        <ColorPickerField
                          disable_check={edit ? false : true}
                          width={windowDimensions}
                          name="primary_color"
                          label="Colour (1st)"
                          colSize={3}
                        />
                        <ColorPickerField
                          disable_check={edit ? false : true}
                          width={windowDimensions}
                          name="secondary_color"
                          label="Colour (2nd)"
                          colSize={3}
                        />
                      </div>
                      <div>
                        <ColorPickerField
                          disable_check={edit ? false : true}
                          width={windowDimensions}
                          name="calendar_primary_color"
                          label="Calendar Filter Colour"
                          colSize={3}
                        />
                        <ColorPickerField
                          disable_check={edit ? false : true}
                          width={windowDimensions}
                          name="calendar_secondary_color"
                          label="Calendar Masthead Colour"
                          colSize={3}
                        />
                      </div>
                      
                      {/* <div>
                        <ColorPickerFontField
                          disable_check={edit ? false : true}
                          width={windowDimensions}
                          name="primary_color"
                          label="Primary Font Color"
                          colSize={3}
                        />
                        <ColorPickerFontField
                          disable_check={edit ? false : true}
                          width={windowDimensions}
                          name="secondary_color"
                          label="Secondary Font Color"
                          colSize={3}
                        />
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className="form-design-row">
                  <DateRangeField
                    disable_check={edit ? false : true}
                    width={windowDimensions}
                    name="date"
                    label="Date Range"
                    labelClassName="col-md-3 col-sm-3"
                  />
                  <InputSelectField
                    disable_check={edit ? false : true}
                    width={windowDimensions}
                    name="timezone"
                    label="Timezone"
                    options={timezones}
                    addClassName="bg-blue-grey-select col-md-9 col-sm-10"
                    labelClassName={'col-md-2 col-sm-2'}
                  />
                </div>
                <div className="form-design-row">
                  <InputWithCheckboxField
                    disable_check={edit ? false : true}
                    width={windowDimensions}
                    name={'location'}
                    label={'Location'}
                  />
                </div>
                <div className="form-design-row">
                  <InputWithCheckboxField
                    disable_check={edit ? false : true}
                    width={windowDimensions}
                    name={'privacy'}
                    label={'Privacy'}
                  />
                  <InputWithCheckboxField
                    disable_check={edit ? false : true}
                    width={windowDimensions}
                    name={'legal'}
                    label={'Legal'}
                  />
                </div>
                <div className="form-design-row">
                  <InputWithCheckboxField
                    disable_check={edit ? false : true}
                    width={windowDimensions}
                    name={'contact_us'}
                    label={'Contact Us'}
                  />
                  <InputWithCheckboxField
                    disable_check={edit ? false : true}
                    width={windowDimensions}
                    name={'your_data'}
                    label={'Your Data'}
                  />
                </div>
                {/* <div className="form-design-row">
                  <QRFiled
                    disable_check={edit ? false : true}
                    width={windowDimensions}
                    name={'QR'}
                    label={'QR'}
                    options={availableQRCodes}
                  />

                  <InputMultiSelectWithCheckboxField
                    disable_check={!edit}
                    width={windowDimensions}
                    name="QR"
                    label="QRCode"
                    options={availableQRCodes}
                    addClassName="bg-blue-grey-select col-md-3 col-sm-12"
                    labelClassName={'col-md-3 col-sm-2'}
                  />      
                </div> */}
                <hr />

               

                {/* <div className="form-design-row">
                  <PageAccessField
                      disable_check={!edit}
                      width={windowDimensions}
                      name={'home'}
                      label={'Home'}
                      colSize={12}
                      attendees={attendeesList.map((item: any) => {
                        return { label: item.name, value: item.userId };
                      })}
                    />
                </div>
                
                <div className="form-design-row">
                <PageAccessField
                    disable_check={!edit}
                    width={windowDimensions}
                    name={'company'}
                    label={'Company'}
                    colSize={12}
                    attendees={attendeesList.map((item: any) => {
                      return { label: item.name, value: item.userId };
                    })}
                  />
                </div>
                <div className="form-design-row">
                  <PageAccessField
                      disable_check={!edit}
                      width={windowDimensions}
                      name={'calendar'}
                      label={'Calendar'}
                      colSize={12}
                      attendees={attendeesList.map((item: any) => {
                        return { label: item.name, value: item.userId };
                      })}
                    />
                </div>
                <div className="form-design-row">
                  <PageAccessField
                      disable_check={!edit}
                      width={windowDimensions}
                      name={'cart'}
                      label={'Cart'}
                      colSize={12}
                      attendees={attendeesList.map((item: any) => {
                        return { label: item.name, value: item.userId };
                      })}
                    />
                </div>
                <div className="form-design-row">
                  <PageAccessField
                    disable_check={!edit}
                    width={windowDimensions}
                    name={'attendees'}
                    label={'Attendees'}
                    colSize={12}
                    attendees={attendeesList.map((item: any) => {
                      return { label: item.name, value: item.userId };
                    })}
                  />
                </div>
                <div className="form-design-row">
                  
                  <PageAccessField
                    disable_check={!edit}
                    width={windowDimensions}
                    name={'content'}
                    label={'Content'}
                    colSize={12}
                    attendees={attendeesList.map((item: any) => {
                      return { label: item.name, value: item.userId };
                    })}
                  />
                </div> */}

                {/* <div className="form-design-row">
                  <InputWithCheckboxField
                    disable_check={!edit}
                    width={windowDimensions}
                    name={'content'}
                    label={'Content'}
                    colSize={4}
                  />
                 
                </div> */}
                {/* <hr /> */}
                {/* <div className="form-content-row m-0"> */}
                <div className="form-design-row">
                  <ContentMenuField
                    disable_check={edit ? false : true}
                    width={windowDimensions}
                    name={'mainMenus'}
                    colSize={12}
                    attendees={attendeesList.map((item: any) => {
                      return { label: item.name, value: item.userId };
                    })}
                  />
                </div>
                <div className="form-design-row">
                  <ContentMenuField
                    disable_check={edit ? false : true}
                    width={windowDimensions}
                    name={'customMenus'}
                    colSize={12}
                    attendees={attendeesList.map((item: any) => {
                      return { label: item.name, value: item.userId };
                    })}
                  />
                </div>
                <hr />
                <div className="form-design-row">
                  <InputTypeField
                    addClassName="col-3"
                    disable_check={!edit}
                    width={windowDimensions}
                    type={'hidden'}
                    name={'logo_image'}
                    label={'Images'}
                    colSize={'3'}
                    imageIcon={true}
                    header_image={header_image}
                    setFieldValue={setFieldValue}
                    header_image_check={header_image_check}
                    left_image={left_image}
                    left_image_check={left_image_check}
                    right_image={right_image}
                    right_image_check={right_image_check}
                    logo_image_check={logo_image_check}
                    id={id}
                    client={client}
                    logo_image={theme?.logoURL}
                    theme={theme}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-2">
                <div className="action-button-bottom">
                    <button type="submit" className="btn-primary btn-tick btn">
                      <FontAwesomeIcon icon="check" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-close"
                      onClick={() => {
                        handleReset();
                      }}
                    >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              </div>
            </div>
          </Form>

        )}}
      </Formik>
    </Container>
  );
};

const mapStateToProps = function (state: AppState) {
  return {
    ui: state.ui,
    user: state.user,
  };
};

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      setCurrentPage,
    },
    dispatch
  );
};

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(Setup);
