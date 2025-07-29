import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';
import { useForm } from './hooks/useForm';
import { useHistory } from 'react-router-dom';
import { useRouterQuery } from '../../../pages/_hooks/useRouterQuery';
import { MultiSelect } from 'react-multi-select-component';
import profileLogo from '../../../../assets/images/profile_placeholder.png';

/** Components */
import { Formik, Form, FormikHelpers, FormikValues } from 'formik';
import FormRow from '../../../Form/FormRow';
import { InputField, InputSelectField } from './components/FieldGroup';
import { ModalBody, CalendarStyle } from './components/general';

/** Utils */
import moment from 'moment';
import { GET_EVENT_INFO } from '../../../../gql/queries';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
/** Constants */
import { validationSchema } from './validationSchema';

/** Types */
import { Props } from './types';
import { TimePickerField } from '../../../FormikItem';
import TimePicker from 'rc-time-picker';
import {
  faCalendarPlus,
  faSave,
  faTimes,
  faChevronLeft,
  faChevronRight,
  faAngleLeft,
  faAngleRight,
  faCalendarCheck,
  faCalendarTimes,
  faPen,
  faSpinner,
  faCheck,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Carousel } from 'react-responsive-carousel';
import content from 'react-slideshow-image';
import { isArray } from 'jquery';
import { eventInvitationUpdate } from '../../../../providers/user';
import Input from '../../../Form/Input';
import Label from '../../../Form/Label';
import { userIsOrganiser } from '../../../../util/common';
import CompanySwitchMasterModalContent from '../../CompanySwitchMasterModalContent';

const INTERVAL = [
  { label: '30 m', value: 30 },
  { label: '1 hr', value: 60 },
  { label: '1 hr 30 m', value: 90 },
  { label: '2 hr', value: 120 },
];

const BookScheduleContent: React.FC<Props> = (props: Props) => {
  const {
    ui,
    user,
    closeCurrentModal,
    data,
    data: {
      date,
      oldDate,
      timeInterval,
      isView,
      event,
      eventsRaw,
      isMeeting,
      setRefetchCalendar,
      platformEventMembers,
      employees,
      attendees,
      contents,
      venues,
      selectedEmployee,
      selectedAttendee,
      selectedContent,
      selectedVenue,
      extendedProps,
      allBookedSlots,
      isAttendee,
      attendeeAvatar,
    },
  } = props;

  let history = useHistory();
  const [queries] = useRouterQuery();

  const {
    data: eventData,
    data: { eventId, theme, slug, eventType, organiser },
  }: any = useQuery(GET_EVENT_INFO);

  const { bookMeeting, createPlatformEventPricingSlot, checkBookingSlot, updateEventBookingSchedules } = useForm(
    eventId,
    {
      ...data,
      user,
    }
  );

  const [isEdit, setIsEdit] = useState(false);

  const contentId = useMemo(() => queries.content_id, [queries]);
  const bookingId = useMemo(() => queries.booking, [queries]);

  console.log(`isContentId: ${contentId} ${queries.content_id} isBooking: ${bookingId} ${queries.booking}`);

  const attendeeList = useMemo(() => {
    if (isView && extendedProps.eventType === 'PLATFORM_EVENT_PRICING_SLOT') {
      const combinedSelections = [...(extendedProps.platformEventPricingSlot?.pricing?.employee ?? [])];

      return combinedSelections;
    }

    if (isView) {
      const attendeeProfiles = allBookedSlots?.map((attendee) => attendee?.invitee);

      if (attendeeProfiles?.length > 1) {
        const profiles = attendeeProfiles.filter((item) => item && item?.user?.id !== extendedProps?.invitee?.user?.id);

        return profiles;
      } else {
        return attendeeProfiles;
      }
    }

    // Create a set to keep track of unique employee IDs
    const uniqueAttendeeIds = new Set();

    // Filter selected employees and attendees into a single array
    const combinedSelections = [
      ...(selectedEmployee ?? []),
      ...(Array.isArray(selectedAttendee) ? selectedAttendee : selectedAttendee ? [selectedAttendee] : []),
    ];

    // Filter out duplicates and store unique employee IDs
    const filteredSelections = combinedSelections.filter((employee) => {
      if (employee && employee.value && !uniqueAttendeeIds.has(employee.value)) {
        uniqueAttendeeIds.add(employee.value);
        return true;
      }
      return false;
    });

    // attendees is an array of objects
    const attendeeProfiles = attendees?.map((attendee) => attendee?.profile);

    // Map filtered selections to corresponding employee data
    const attendeeDetails = filteredSelections.map((employee) => {
      return [...employees, ...(attendeeProfiles ?? [])].find((val: any) => {
        return val?.id === employee?.value;
      });
    });

    // Filter out the logged-in user's data
    const filteredEmployeeDetails = attendeeDetails.filter((item) => item && item?.user?.id !== user?.userData?.id);

    return filteredEmployeeDetails;
  }, [employees, selectedEmployee, selectedAttendee, user.userData.id, extendedProps]);

  const contentElement = useMemo((): any => {
    if (!selectedContent || !selectedContent.length) return {};

    const content = contents.find((item: any) => {
      return item.id === selectedContent[0].value;
    });

    if (content) {
      content.packages = content.pricing.map((item: any, idx: number) => ({
        ...item,
        label:
          item.employee && item.employee.length > 0
            ? [item.employee[0].user.firstName, item.employee[0].user.lastName].filter(Boolean).join(' ')
            : `Package ${idx + 1}`,
        value: item.id, // item?.employee[0]?.id,
      }));
    }

    return content || {};
  }, [contents, selectedContent]);

  const closeModal = () => {
    closeCurrentModal('BOOK_SCHEDULE');

    if (bookingId) {
      history.push(`/${slug}/calendar`);
    } else {
      if(!selectedContent){
         history.push(`/${slug}/calendar`);
      } else
      history.push(`/${slug}/cart`);
     

    }
  };

  useEffect(() => {
    if (selectedEmployee?.length) {
      const employee = contentElement?.packages?.find((p) => p.employee[0].id === selectedEmployee[0].value);

      if (!employee && !isMeeting) {
        alert('selected employee does not belong to this content, please select employee');
      }
    }
  });

  const getDuration = () => {
    if (isMeeting) {
      if(!selectedContent){
        let duration = moment.duration(
          moment(extendedProps.calendarEvent?.endAt).diff(moment(extendedProps.calendarEvent?.startAt))
        );
        return `${(Math.floor(duration.asHours()))} hr  ${duration.asMinutes() % 60} min`;
      }
      let duration = moment.duration(
        moment(extendedProps.platformEventSlot?.endAt).diff(moment(extendedProps.platformEventSlot?.startAt))
      );
      return duration.asMinutes();
    }
    return extendedProps.platformEventPricingSlot?.pricing?.duration;
  };

  const getTimeSlot = () => {
    if (isMeeting) {
      if(!selectedContent){
        const start_date = new Date(data.extendedProps.calendarEvent.startAt);
        const end_date = new Date(data.extendedProps.calendarEvent.endAt);

        return `${moment(start_date).format('HH:mm')} - ${moment(end_date).format('HH:mm')}`;
      }
      return `${moment(extendedProps.platformEventSlot?.startAt).format('HH:mm')} - ${moment(
        extendedProps.platformEventSlot?.endAt
      ).format('HH:mm')}`;
    }
    return `${moment(extendedProps.platformEventPricingSlot?.startAt).format('HH:mm')} - ${moment(
      extendedProps.platformEventPricingSlot?.endAt
    ).format('HH:mm')}`;
  };

  const getContent = () => {
    if (isMeeting) {
      return extendedProps.platformEventSlot?.name;
    }
    return extendedProps.content?.name;
  };

  const handleStatusUpdate = (updatedStatus, updateForm) => {
    eventInvitationUpdate(extendedProps.eventId, updatedStatus).then((response: any) => {
      if (Object.keys(response).length > 0) {
        updateForm('invitationStatus', updatedStatus);
      }
    });
  };

  const getAttendees = () => {
    let attendees = extendedProps?.platformEventSlot?.attendees;

    attendees = attendees?.map((attendee) => {
      let profile = platformEventMembers.find((x) => x?.profile?.id === attendee?.invitee?.id);

      let user = attendeeList.find((x) => x?.user?.id === profile?.user?.id);

      return {
        ...attendee,
        ...profile,
        ...user,
      };
    });

    return attendees;
  };

  const getProfile = (id) => {
    const profile = platformEventMembers?.find((member) => member.user.id === id);
    if (profile?.profile) {
      profile.profile.firstName = profile.user.firstName;
      profile.profile.lastName = profile.user.lastName;
    }

    return profile?.profile ? profile?.profile : profile?.user;
  };

  const track = useRef(null);
  const carouselContainer = useRef(null);
  const [transformedWidth, setTransformedWidth] = useState(0);
  const [index, setIndex] = useState(0);

  let boolNext = false;

  if (isMeeting) {
    boolNext = attendeeList?.length > 1 ? true : false;
  }
  const [isNext, setIsNext] = useState(boolNext);
  const [isPrevious, setIsPrevious] = useState(false);
  const [showProfile, setShowProfile] = useState(selectedEmployee?.length ? true : false);

  function validateBooking(values: any): void {
    const timeToken = values.time_slot.split(' - ');

    const startAtValue = moment(`${values.date} ${timeToken[0]}`, 'YYYY-MM-DD HH:mm');
    const endAtValue = moment(`${values.date} ${timeToken[1]}`, 'YYYY-MM-DD HH:mm');

    const content = contents?.find((c) => c.id === selectedContent[0]?.value);

    if (content?.startDate && content?.endDate && content?.isConstraintAvailable) {
      const contentStart = moment(new Date(content.startDate), 'YYYY-MM-DD HH:mm');
      const contentEnd = moment(new Date(startAtValue.toDate()))
        .startOf('day')
        .add(moment.duration(moment(content.endDate).format('HH:mm')));
      const day = moment(startAtValue).format('dddd').toLowerCase();

      if (
        !(
          moment(startAtValue.format('YYYY-MM-DD HH:mm')) >= contentStart &&
          endAtValue <= contentEnd &&
          content.pricingMaster?.availability_weeks?.includes(day)
        )
      ) {
        alert(
          `Slot not available. Booking available on ${content.pricingMaster?.availability_weeks} between ${content.startDate} to ${content.endDate}`
        );
      }
    }
  }

  const handlePrevClick = () => {
    const localIndex = index - 1;
    setIndex(localIndex);
    setIsNext(true);
    setIsPrevious(localIndex !== 0);
    setTransformedWidth(localIndex * 175); // 175 is the width of a card or employee-wrapper
  };

  const handleNextClick = () => {
    const localIndex = index + 1;
    setIndex(localIndex);
    setIsPrevious(true);
    setIsNext(localIndex < attendeeList.length - 1);
    setTransformedWidth(localIndex * 175); // 175 is the width of a card or employee-wrapper
  };

  const editSchedule = useCallback(async () => {
    console.log("edit Mode", extendedProps.type);
    try {
      if (extendedProps.type === 'event_slot') {
        history.push(`/${slug}/calendar?booking=${extendedProps.calendarSlotId}`);
      } else {
        history.push(
          `/${slug}/calendar?content_id=${extendedProps.content.id}&booking=${extendedProps.calendarSlotId}`
        );
      }

      closeModal();
    } catch (error) {
      console.log(error);
    }
  }, [extendedProps, history]);

  const getInvitationInfo = (user) => {
    let attendees = extendedProps?.platformEventSlot?.attendees;

    let profile = platformEventMembers?.find((x) => x?.user.id === user?.user?.id);

    let invitationInfo = attendees?.find((attendee) => attendee?.invitee?.id === profile?.profile?.id);

    let data = {
      ...invitationInfo,
      ...profile,
      ...user,
    };

    return data;
  };

  const renderEmployees = () => {
    //TODO: use getAttendees instead of attendeeList and remove getInvitationInfo() to clean of the flow of getting attendee list with all the required info

    return attendeeList.map((attendee, index) => {
      let employee = getInvitationInfo(attendee);
      return (
        <div
          key={employee.id || index}
          style={{ display: 'flex', justifyContent: 'center', padding: '1rem', alignItems: 'center', gap: '1rem' }}
        >
          <FormRow addClassName="employee-wrapper">
            <EmployeeProfile employee={employee} />
          </FormRow>
        </div>
      );
    });
  };

  const EmployeeProfile = (props) => {
    let userProfile = props?.employee;

    let invitationStatus = userProfile.invitationStatus;

    let profile = getProfile(userProfile?.user?.id);

    let avatar = profile?.avatar;
    let fullName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim();

    if (!profile) {
      let fullName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim();

      profile = userProfile;
      avatar = userProfile?.avatar;
      fullName = `${userProfile?.firstName || userProfile?.user?.firstName} ${
        userProfile?.lastName || userProfile?.user?.lastName
      }`.trim();
    }

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: '14px',
            gap: '5px',
          }}
        >
          {/* Avatar Section */}
          <div
            id="avatar"
            style={{
              backgroundColor: '#e9ecef',
              borderRadius: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              padding: '5px',
            }}
          >
            {avatar ? (
              <img src={avatar} style={{ borderRadius: '100%', width: '75px', height: '75px' }} alt="Profile" />
            ) : (
              <FontAwesomeIcon icon="user" size="3x" style={{ color: '#c1d0d6' }} />
            )}
          </div>

          {/* Icon Section */}
          <div
            id="icon"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isView &&
              (invitationStatus === 'AWAITING' ? (
                <FontAwesomeIcon
                  icon={faSpinner}
                  style={{
                    fontSize: '14px',
                    color: '#212529',
                  }}
                />
              ) : invitationStatus === 'DECLINED' ? (
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  style={{
                    fontSize: '14px',
                    color: '#c83f3f',
                  }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{
                    fontSize: '14px',
                    color: '#28a745',
                  }}
                />
              ))}
          </div>
        </div>

        <div className="text-center">{fullName}</div>
      </div>
    );
  };

  const InviteeSection = () => {
    let invitee = getInvitationInfo(extendedProps?.invitee || { user: user?.userData, ...user?.userData });
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '1rem',
          paddingTop: 0,
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          {isView ? <EmployeeProfile employee={invitee} /> : <EmployeeProfile employee={invitee} />}
        </div>
      </div>
    );
  };

  const AttendeeSection = () => {
    return (
      <>
        {attendeeList?.length ? (
          <Carousel
            showThumbs={false}
            showIndicators={false}
            showStatus={false}
            dynamicHeight={false}
            showArrows={true}
            centerSlidePercentage={30}
            renderArrowPrev={(clickHandler, hasPrev) => (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  zIndex: 2,
                }}
                onClick={clickHandler}
              >
                {hasPrev ? <FontAwesomeIcon icon={faAngleLeft} style={{ fontSize: 30 }} /> : null}
              </div>
            )}
            renderArrowNext={(clickHandler, hasNext) => (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  zIndex: 2,
                }}
                onClick={clickHandler}
              >
                {hasNext ? <FontAwesomeIcon icon={faAngleRight} style={{ fontSize: 30 }} /> : null}
              </div>
            )}
          >
            {renderEmployees()}
          </Carousel>
        ) : /* // <div ref={carouselContainer} className="carosuel-container-booking my-0" style={{ width: '150px!important' }}>
          //   <div className="carosuel-container-booking-inner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          //     <div ref={track} className="track" style={style}>
          //       {renderEmployees()}
          //     </div>
          //   </div>
          //   <div className="nav">
          //     {isPrevious && (
          //       <button type="button" className="prev text-black" onClick={handlePrevClick}>
          //         <FontAwesomeIcon icon={faChevronLeft} size="2x" style={{ color: 'black' }} />
          //       </button>
          //     )}
          //     {isNext && (
          //       <button type="button" className="next" onClick={handleNextClick}>
          //         <FontAwesomeIcon icon={faChevronRight} size="2x" style={{ color: 'black' }} />
          //       </button>
          //     )}
          //   </div>
          // </div> */
        null}
      </>
    );
  };

  const AttendeeSectionVM = () => {
    return (
      <div>
        <AttendeeSection />
        <div className="col-md-12 col-sm-12">
          <div className="row" style={{ padding: 'inherit' }}>
            <InputField
              addClassNamelabel="col"
              type="date"
              name={'date'}
              label={'Date'}
              colSize={12}
              inputCol="col-md-10 col-sm-12"
              disable={true}
            />
          </div>
          <div className="row" style={{ padding: 'inherit' }}>
            <InputField
              name={'time_slot'}
              addClassNamelabel="col"
              label={'Time'}
              colSize={12}
              inputCol="col-md-10 col-sm-12"
              disable={true}
            />
          </div>

          {/* <div className="row" style={{ padding: 'inherit' }}>
                <Label  addClassName='label' labelFor={"Time"}>
                </Label>
                <div className={"label"}>
                  <TimePicker
                    name={'time_slot'}
                    showSecond={false}
                    className={`col-md-10 col-sm-12`}
                    format={'H:mm a'}
                    use12Hours
                    inputReadOnly
                  />
                </div>
            </div> */}
          <div className="row" style={{ padding: 'inherit' }}>
            <InputField
              name={'interval'}
              addClassNamelabel="col"
              label={'Length'}
              colSize={12}
              inputCol="col-md-10 col-sm-12"
              disable={true}
            />
          </div>
          <div className="row" style={{ padding: 'inherit' }}>
            <InputField
              name={'content'}
              label={'Package'}
              value={selectedContent?.length && selectedContent[0]}
              addClassNamelabel="col"
              colSize={12}
              inputCol="col-md-10 col-sm-12"
              disable={true}
            />
          </div>
          <div className="row" style={{ padding: 'inherit' }}>
            <InputField
              name={'venue'}
              label={'Location'}
              colSize={12}
              inputCol="col-md-10 col-sm-12"
              addClassNamelabel="col"
              disable={true}
            />
          </div>
          <div className="row" style={{ padding: 'inherit' }}>
            {!isMeeting && selectedContent?.pricingMaster?.price && contentElement?.pricingMaster?.price && (
              <InputField
                name={'price'}
                label={'Price'}
                value={'89'}
                colSize={12}
                inputCol="col-md-10 col-sm-12"
                addClassNamelabel="col"
                disable={true}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return !!selectedContent ? (
    <Formik
      initialValues={{
        content: !isView ? selectedContent && selectedContent[0] : getContent(),
        date: moment(date).format('YYYY-MM-DD'),
        time_slot: !isView
          ? `${moment(date).format('HH:mm')} - ${moment(date)
              .add(contentElement?.pricingMaster?.duration ?? 30, 'minutes')
              .format('HH:mm')}`
          : getTimeSlot(),
        interval: !isView ? INTERVAL[0] : getDuration(),
        invitationStatus: isView ? extendedProps.invitationStatus : '',
        venue: extendedProps?.platformEventSlot?.venue
          ? extendedProps?.platformEventSlot?.venue?.name
          : selectedVenue?.length
          ? selectedVenue[0]
          : '',

        content_package: contentElement?.packages
          ? contentElement?.packages?.find((p) => p.employee[0]?.id === selectedEmployee[0]?.value)
          : !isMeeting
          ? selectedAttendee?.length && selectedAttendee[0]
          : '',

        price:
          selectedContent?.pricingMaster && selectedContent?.isPricingAvailable
            ? `${selectedContent?.pricingMaster?.currency} ${selectedContent?.pricingMaster?.price}`
            : contentElement?.isPricingAvailable && contentElement?.pricingMaster
            ? `${contentElement?.pricingMaster?.currency?.toUpperCase() ?? ''} ${contentElement?.pricingMaster?.price}`
            : null,
        contentId: contentId,
        calendarSlotId: bookingId,
      }}
      validationSchema={validationSchema(isMeeting)}
      onSubmit={async (values: any) => {
        console.log('price', 'No price');

        try {
          if (isMeeting) {
            // if (!selectedEmployee?.length && !isAttendee && !contentElement?.selectedVenue) {
            //   alert('Please select employee first');
            //   return;
            // }
          }
          if (checkBookingSlot(values)) {
            if (isAttendee) {
              console.log('submitted: ', values);
              values.attendees = selectedAttendee;
            }

            if (isMeeting) {
              const key = user.userData.id + values.interval.value + values.time_slot + values.date;

              localStorage.setItem(
                key,
                +(localStorage.getItem(key) ?? '0') + (selectedAttendee?.length + selectedEmployee?.length)
              );

              const x = localStorage.getItem(user.userData.id + values.interval.value);
              console.log('price', 'No price', contentId, bookingId);

              if (contentId && bookingId) {
                values.contentId = contentId;
                values.calendarSlotId = bookingId;
                const updateSchedule = await updateEventBookingSchedules(values);
                closeModal();
              } else if (bookingId) {
                values.calendarSlotId = bookingId;

                const updateSchedule = await updateEventBookingSchedules(values);
                closeModal();
              } else {
                if (values.price) {

                  const booking: any = await createPlatformEventPricingSlot(values);
                  closeModal();
                } else {
                  const booking: any = await bookMeeting({ ...values, attendees: selectedAttendee });
                  closeCurrentModal('BOOK_SCHEDULE');
                  history.push(`/${slug}/calendar`);
                }
              }

              console.log('final submitted', values);
            }

            setRefetchCalendar(true);

            // history.push(`/${slug}/calendar`);
          } else {
            alert('Slot already filled');
          }
        } catch (error) {
          alert(error.message);
        }
      }}
    >
      {({ setFieldValue, values }) => (
        <Form>
          {/* {validateBooking(values)} */}
          <CalendarStyle>
            <div className="modal-header">
              <div>
                <h4>Book schedule</h4>
              </div>
              <div className="flex-container">
                {isView && (
                  <div className="flex-container">
                    {/* TODO: Implemente edit */}
                    {/* {((userIsOrganiser(user, extendedProps.platformEventSlot.organiser) && extendedProps?.platformEvent?.id === eventId ) && (
                    <div className="flex-container">
                        <button
                          type="button" 
                          className="btn btn-purple"
                          onClick={() => {
                            setIsEdit(!isEdit)
                            return editSchedule()
                          }}
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                    </div>
                  ))} */}

                    {values.invitationStatus === 'AWAITING' ? (
                      <div className="flex-container">
                        <button
                          type="submit"
                          className="btn btn-red"
                          onClick={() => handleStatusUpdate('DECLINED', setFieldValue)}
                        >
                          <FontAwesomeIcon icon={faCalendarTimes} />
                        </button>
                        <button
                          type="submit"
                          className="btn btn-success"
                          onClick={() => handleStatusUpdate('ACCEPTED', setFieldValue)}
                        >
                          <FontAwesomeIcon icon={faCalendarCheck} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex-container">
                        {values.invitationStatus === 'ACCEPTED' ? (
                          <button disabled type="submit" className="btn btn-success">
                            <FontAwesomeIcon icon={faCalendarCheck} />
                          </button>
                        ) : (
                          <button type="submit" className="btn btn-red">
                            <FontAwesomeIcon icon={faCalendarTimes} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {!isView &&
                  ((contentId && bookingId) || bookingId ? (
                    <button type="submit" className="btn btn-purple">
                      <FontAwesomeIcon icon={faSave} />
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-purple">
                      <FontAwesomeIcon icon={faCalendarPlus} />
                    </button>
                  ))}

                <button type="button" className="btn btn-red" aria-label="Close" onClick={() => closeModal()}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          </CalendarStyle>

          <ModalBody className="modal-body">
            <InviteeSection />

            {/* Calendar Event is Meeting or Attendee with content package */}
            {isView ? (
              <AttendeeSectionVM />
            ) : (
              <>
                {/* Edit Calendar Event is Meeting or Attendee */}
                <AttendeeSection />
                <div className="col-md-12 col-sm-12">
                  <div className="row">
                    <InputField
                      labelCol=" col-md-2 col-4"
                      inputCol="col-md-10"
                      type="date"
                      name={'date'}
                      label={'Date'}
                      colSize={12}
                      disable={true}
                    />
                  </div>
                  <div className="row">
                    <InputField
                      labelCol=" col-md-2 col-4"
                      inputCol="col-md-10"
                      name={'time_slot'}
                      label={'Time'}
                      colSize={12}
                      disable={true}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-12 col-sm-12 p-0">
                      <InputSelectField
                        name={'interval'}
                        label={'Length'}
                        labelCol=" col-md-2 col-4"
                        inputCol="col-md-10 col-sm-12"
                        containerClassName=" p-0"
                        colSize={12}
                        defaultValue={
                          contentElement?.pricingMaster
                            ? INTERVAL.find((i) => i.value == contentElement?.pricingMaster?.duration)
                            : oldDate
                            ? INTERVAL.find((i) => i.value == timeInterval)
                            : INTERVAL[0]
                        }
                        options={INTERVAL}
                        onChange={(e: any) => {
                          setFieldValue('interval', e.value);
                          setFieldValue(
                            'time_slot',
                            `${moment(date).format('HH:mm')} - ${moment(date)
                              .add(e.target.value.value, 'minutes')
                              .format('HH:mm')}`
                          );
                        }}
                        disable={!isMeeting || isView || contentElement?.pricingMaster?.duration}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 col-sm-12 p-0">
                      <InputSelectField
                        name={'content'}
                        label={'Package'}
                        value={selectedContent?.length ? selectedContent[0] : {}}
                        containerClassName=" p-0"
                        labelCol=" col-md-2 col-4"
                        inputCol="col-md-10 col-sm-12"
                        colSize={12}
                        options={[
                          {
                            value: 'meeting',
                            label: 'Meeting',
                          },
                          ...contents.map((val: any) => ({
                            value: val.id,
                            label: val.name,
                          })),
                        ]}
                        disable={true}
                      />
                    </div>
                  </div>
                  {isMeeting && (
                    <>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 p-0">
                          <InputSelectField
                            name={'venue'}
                            label={'Location'}
                            defaultValue={
                              contentElement?.selectedVenue
                                ? JSON.parse(contentElement?.selectedVenue)
                                : selectedVenue[0]
                            }
                            labelCol=" col-md-2 col-4"
                            inputCol="col-md-10 col-sm-12"
                            containerClassName=" p-0"
                            colSize={12}
                            options={venues.map((val: any) => ({
                              value: val.id,
                              label: val.name,
                            }))}
                            // disable={isView || contentElement?.selectedVenue}
                            disable={(contentElement?.selectedVenue || isView || selectedVenue.length) && !bookingId}
                            onChange={(e: any) => {
                              setFieldValue('venue', e.target.value.value);
                            }}
                          />
                        </div>
                      </div>
                      {contentElement?.pricingMaster?.price ? (
                        <div className="row">
                          <div className="col-md-12 col-sm-12 p-0">
                            <InputSelectField
                              name={'content_pricee'}
                              label={'Price'}
                              options={[]}
                              value={{
                                label: `${contentElement?.pricingMaster?.currency?.toUpperCase()} ${
                                  contentElement?.pricingMaster?.price
                                }`,
                              }}
                              labelCol=" col-md-2 col-4"
                              inputCol="col-md-10 col-sm-12"
                              containerClassName=" p-0"
                              colSize={12}
                              disable={true}
                            />
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                    </>
                  )}
                  {isMeeting && !isAttendee && contentElement?.packages?.length ? (
                    <>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 p-0">
                          <InputSelectField
                            name={'content_package'}
                            label={'Employee'}
                            colSize={12}
                            defaultValue={
                              contentElement?.packages?.find((p) => p.employee[0]?.id === selectedEmployee[0]?.value) ??
                              ''
                            }
                            labelCol=" col-md-2 col-4"
                            inputCol="col-md-10 col-sm-12"
                            containerClassName=" p-0"
                            options={contentElement.packages || []}
                            onChange={(e: any) => {
                              // console.log('content package testing + state', state)
                              const interval =
                                INTERVAL.find((item: any) => item.value === e.target.value.duration) || INTERVAL[0];
                              setShowProfile(true);
                              setFieldValue(
                                'price',
                                `${e.target.value.currency.toUpperCase()} ${e.target.value.price}`
                              );
                              setFieldValue('interval', interval);
                              setFieldValue(
                                'time_slot',
                                `${moment(date).format('HH:mm')} - ${moment(date)
                                  .add(interval.value, 'minutes')
                                  .format('HH:mm')}`
                              );
                            }}
                            disable={isView}
                          />
                        </div>
                      </div>
                      {/* <div className="row">
                        <InputField
                          name={'price'}
                          label={'Price'}
                          colSize={12}
                          labelCol=" col-md-2 col-4"
                          inputCol="col-md-10"
                          disable={true}
                        />
                      </div> */}
                    </>
                  ) : (
                    <div></div>
                  )}
                </div>
              </>
            )}

            {contentElement?.images?.map((i) => {
              return (
                <img src={i} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }}></img>
              );
            })}
          </ModalBody>
        </Form>
      )}
    </Formik>
  ) : (
    <Formik
      initialValues={{
        // content: !isView ? selectedContent && selectedContent[0] : getContent(),
        content: [],
        date: moment(date).format('YYYY-MM-DD'),
        time_slot: !isView
          ? `${moment(date).format('HH:mm')} - ${moment(date)
              .add(contentElement?.pricingMaster?.duration ?? 30, 'minutes')
              .format('HH:mm')}`
          : getTimeSlot(),
        interval: !isView ? INTERVAL[0] : getDuration(),
        invitationStatus: isView ? !extendedProps.invitationStatus ? '' : extendedProps.invitationStatus : '',
        venue: '',
        content_package: '',

        price: null,
        contentId: contentId,
        calendarSlotId: bookingId,
      }}
      validationSchema={validationSchema(isMeeting)}
      onSubmit={async (values: any) => {
        console.log('price', 'No price');

        try {
          if (isMeeting) {
            // if (!selectedEmployee?.length && !isAttendee && !contentElement?.selectedVenue) {
            //   alert('Please select employee first');
            //   return;
            // }
          }
          if (checkBookingSlot(values)) {
            if (isAttendee) {
              console.log('submitted: ', values);
              values.attendees = selectedAttendee;
            }

            if (isMeeting) {
              const key = user.userData.id + values.interval.value + values.time_slot + values.date;

              localStorage.setItem(
                key,
                +(localStorage.getItem(key) ?? '0') + (selectedAttendee?.length + selectedEmployee?.length)
              );

              const x = localStorage.getItem(user.userData.id + values.interval.value);
              console.log('price', 'No price');

              if (contentId && bookingId) {
                values.contentId = contentId;
                values.calendarSlotId = bookingId;
                const updateSchedule = await updateEventBookingSchedules(values);
                closeModal();
              } else if (bookingId) {
                values.calendarSlotId = bookingId;

                const updateSchedule = await updateEventBookingSchedules(values);
                closeModal();
              } else {
                if (values.price) {
                  const booking: any = await createPlatformEventPricingSlot(values);
                  closeModal();
                } else {
                  const booking: any = await bookMeeting({ ...values, attendees: selectedAttendee });
                  closeCurrentModal('BOOK_SCHEDULE');
                  history.push(`/${slug}/calendar`);
                }
              }

              console.log('final submitted', values);
            }

            setRefetchCalendar(true);

            // history.push(`/${slug}/calendar`);
          } else {
            alert('Slot already filled');
          }
        } catch (error) {
          alert(error.message);
        }
      }}
    >
      {({ setFieldValue, values }) => (
        <Form>
          {/* {validateBooking(values)} */}
          <CalendarStyle>
            <div className="modal-header">
              <div>
                <h4>Book schedule</h4>
              </div>
              <div className="flex-container">
                {isView && (
                  <div className="flex-container">
                    {console.log("selectedContent = null", values, bookingId)}
                    {/* TODO: Implemente edit */}
                    {/* {((
                      // userIsOrganiser(user, extendedProps.platformEventSlot.organiser) && extendedProps?.platformEvent?.id === eventId ) && (
                      <div className="flex-container">
                          <button
                            type="button" 
                            className="btn btn-purple"
                            onClick={() => {
                              setIsEdit(!isEdit)
                              return editSchedule()
                            }}
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                      </div>
                    ))} */}

                    {values.invitationStatus === 'AWAITING' ? (
                      <div className="flex-container">
                        <button
                          type="submit"
                          className="btn btn-red"
                          onClick={() => handleStatusUpdate('DECLINED', setFieldValue)}
                        >
                          <FontAwesomeIcon icon={faCalendarTimes} />
                        </button>
                        <button
                          type="submit"
                          className="btn btn-success"
                          onClick={() => handleStatusUpdate('ACCEPTED', setFieldValue)}
                        >
                          <FontAwesomeIcon icon={faCalendarCheck} />
                        </button>
                      </div>
                    ) : (<></>
                      // <div className="flex-container">
                      //   {values.invitationStatus === 'ACCEPTED' ? (
                      //     <button disabled type="submit" className="btn btn-success">
                      //       <FontAwesomeIcon icon={faCalendarCheck} />
                      //     </button>
                      //   ) : (
                      //     <button type="submit" className="btn btn-red">
                      //       <FontAwesomeIcon icon={faCalendarTimes} />
                      //     </button>
                      //   )}
                      // </div>
                    )}
                  </div>
                )}

                {!isView &&
                  ((contentId && bookingId) || bookingId ? (
                    <button type="submit" className="btn btn-purple">
                      <FontAwesomeIcon icon={faSave} />
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-purple">
                      <FontAwesomeIcon icon={faCalendarPlus} />
                    </button>
                  ))}

                <button type="button" className="btn btn-red" aria-label="Close" onClick={() => closeModal()}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          </CalendarStyle>

          <ModalBody className="modal-body">
            <InviteeSection />

            {/* Calendar Event is Meeting or Attendee with content package */}
            {isView ? (
              <AttendeeSectionVM />
            ) : (
              <>
                {/* Edit Calendar Event is Meeting or Attendee */}
                <AttendeeSection />
                <div className="col-md-12 col-sm-12">
                  <div className="row">
                    <InputField
                      labelCol=" col-md-2 col-4"
                      inputCol="col-md-10"
                      type="date"
                      name={'date'}
                      label={'Date'}
                      colSize={12}
                      disable={true}
                    />
                  </div>
                  <div className="row">
                    <InputField
                      labelCol=" col-md-2 col-4"
                      inputCol="col-md-10"
                      name={'time_slot'}
                      label={'Time'}
                      colSize={12}
                      disable={true}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-12 col-sm-12 p-0">
                      <InputSelectField
                        name={'interval'}
                        label={'Length'}
                        labelCol=" col-md-2 col-4"
                        inputCol="col-md-10 col-sm-12"
                        containerClassName=" p-0"
                        colSize={12}
                        defaultValue={
                          contentElement?.pricingMaster
                            ? INTERVAL.find((i) => i.value == contentElement?.pricingMaster?.duration)
                            : oldDate
                            ? INTERVAL.find((i) => i.value == timeInterval)
                            : INTERVAL[0]
                        }
                        options={INTERVAL}
                        onChange={(e: any) => {
                          setFieldValue('interval', e.value);
                          setFieldValue(
                            'time_slot',
                            `${moment(date).format('HH:mm')} - ${moment(date)
                              .add(e.target.value.value, 'minutes')
                              .format('HH:mm')}`
                          );
                        }}
                        disable={!isMeeting || isView || contentElement?.pricingMaster?.duration}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 col-sm-12 p-0">
                      <InputSelectField
                        name={'content'}
                        label={'Package'}
                        value={selectedContent?.length ? selectedContent[0] : {}}
                        containerClassName=" p-0"
                        labelCol=" col-md-2 col-4"
                        inputCol="col-md-10 col-sm-12"
                        colSize={12}
                        options={[
                          {
                            value: 'meeting',
                            label: 'Meeting',
                          },
                          ...contents.map((val: any) => ({
                            value: val.id,
                            label: val.name,
                          })),
                        ]}
                        disable={true}
                      />
                    </div>
                  </div>
                  {isMeeting && (
                    <>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 p-0">
                          <InputSelectField
                            name={'venue'}
                            label={'Location'}
                            defaultValue={
                              contentElement?.selectedVenue
                                ? JSON.parse(contentElement?.selectedVenue)
                                : selectedVenue[0]
                            }
                            labelCol=" col-md-2 col-4"
                            inputCol="col-md-10 col-sm-12"
                            containerClassName=" p-0"
                            colSize={12}
                            options={venues.map((val: any) => ({
                              value: val.id,
                              label: val.name,
                            }))}
                            // disable={isView || contentElement?.selectedVenue}
                            disable={(contentElement?.selectedVenue || isView || selectedVenue.length) && !bookingId}
                            onChange={(e: any) => {
                              setFieldValue('venue', e.target.value.value);
                            }}
                          />
                        </div>
                      </div>
                      {contentElement?.pricingMaster?.price ? (
                        <div className="row">
                          <div className="col-md-12 col-sm-12 p-0">
                            <InputSelectField
                              name={'content_pricee'}
                              label={'Price'}
                              options={[]}
                              value={{
                                label: `${contentElement?.pricingMaster?.currency?.toUpperCase()} ${
                                  contentElement?.pricingMaster?.price
                                }`,
                              }}
                              labelCol=" col-md-2 col-4"
                              inputCol="col-md-10 col-sm-12"
                              containerClassName=" p-0"
                              colSize={12}
                              disable={true}
                            />
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                    </>
                  )}
                  {isMeeting && !isAttendee && contentElement?.packages?.length ? (
                    <>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 p-0">
                          <InputSelectField
                            name={'content_package'}
                            label={'Employee'}
                            colSize={12}
                            defaultValue={
                              contentElement?.packages?.find((p) => p.employee[0]?.id === selectedEmployee[0]?.value) ??
                              ''
                            }
                            labelCol=" col-md-2 col-4"
                            inputCol="col-md-10 col-sm-12"
                            containerClassName=" p-0"
                            options={contentElement.packages || []}
                            onChange={(e: any) => {
                              // console.log('content package testing + state', state)
                              const interval =
                                INTERVAL.find((item: any) => item.value === e.target.value.duration) || INTERVAL[0];
                              setShowProfile(true);
                              setFieldValue(
                                'price',
                                `${e.target.value.currency.toUpperCase()} ${e.target.value.price}`
                              );
                              setFieldValue('interval', interval);
                              setFieldValue(
                                'time_slot',
                                `${moment(date).format('HH:mm')} - ${moment(date)
                                  .add(interval.value, 'minutes')
                                  .format('HH:mm')}`
                              );
                            }}
                            disable={isView}
                          />
                        </div>
                      </div>
                      {/* <div className="row">
                          <InputField
                            name={'price'}
                            label={'Price'}
                            colSize={12}
                            labelCol=" col-md-2 col-4"
                            inputCol="col-md-10"
                            disable={true}
                          />
                        </div> */}
                    </>
                  ) : (
                    <div></div>
                  )}
                </div>
              </>
            )}

            {contentElement?.images?.map((i) => {
              return (
                <img src={i} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }}></img>
              );
            })}
          </ModalBody>
        </Form>
      )}
    </Formik>
  );
};

export default BookScheduleContent;
