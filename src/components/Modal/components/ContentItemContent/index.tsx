import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';
import { useData } from './hooks/useData';
import { useForm } from './hooks/useForm';
import { useHistory } from 'react-router';
import { useRouterQuery } from '../../../pages/_hooks/useRouterQuery';
/** Components */
import { Form, Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faCheck, faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import Collapsible from 'react-collapsible';
import MaxAttField from '../../../Form/MaxAttField';
import './style.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setAtt } from '../../../../store/att/action';

import {
  EmployeeListField,
  ImageField,
  ImageListField,
  InputField,
  InputMultiSelectField,
  InputSelectField,
  KeywordsField,
  LinkListField,
  TimePickerField,
} from '../../../FormikItem';
import TextareaFieldContent from '../../../FormikItem/TextareaFieldContent';
import { ModalBody, ModalHeader } from './components/general';
import InputSelectFieldModal from '../../../FormikItem/InputSelectFieldModal';
import InputSelectPricingFieldModal from '../../../FormikItem/InputSelectPricingFieldModal';
import InputFieldModal from '../../../FormikItem/InputFieldModal';
import DateRangeFieldModal from '../../../FormikItem/DateRangeFieldModal';
/** Utils */
import moment from 'moment';
import _ from 'lodash';
import { GET_EVENT_INFO } from '../../../../gql/queries';

/** Constants */
import { CURRENCIES_DICT } from '../../../enum/currency';
import dropDownBtn from '../../../../assets/images/icons/dropButtonColored.svg';
import VenueSelector from '../../../FormikItem/VenueSelector';
/** Types */
import { Props } from './types';
import styled from 'styled-components';
import { addContentToCart } from '../../../../providers/pricing';

const INTERVAL = [
  { label: '30 m', value: 30 },
  { label: '1 hr', value: 60 },
  { label: '1 hr 30 m', value: 90 },
  { label: '2 hr', value: 120 },
  { label: '2 hr 30 m', value: 150 },
  { label: '3 hr', value: 180 },
  // { label: '3 hr 30 m', value: 210 },
  // { label: '4 hr', value: 240 },
  // { label: '4 hr 30 m', value: 270 },
  // { label: '5 hr', value: 300 },
  // { label: '5 hr 30 m', value: 330 },
  // { label: '6 hr', value: 360 },
];
const ContentItemContent: React.FC<Props> = (props: Props) => {
  const {
    ui,
    user,
    closeCurrentModal,
    data: { data, props: parentProps },
  } = props;
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [isVenueChecked, setIsVenueChecked] = useState(data?.isVenueChecked);
  const [selectedVenue, setSelectedVenue] = useState({ label: '', value: '', max: 0, att: 0 });
  const [selectedCluster, setSelectedCluster] = useState([]);
  const [eventSubClusters, setEventSubClusters] = useState([]);
  const [selectedSubClusters, setSelectedSubClusters] = useState([]);
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [attendeeNotificationList, setAttendeeNotificationList] = useState([]);
  const [totalContentPrice, setTotalContentPrice] = useState(0);
  const [contentPrice, setContentPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalEmployeePrice, setTotalEmployeePrice] = useState(0);
  const [currency, setCurrency] = useState('');

  const [mode, setMode] = useState('');

  const history = useHistory();

  function displaySelectedItem(e: any) {
    setSelectedVenue(e.target.value);
  }

  function getWindowDimensions() {
    const { innerWidth: width } = window;
    return width;
  }

  const weekDays = [
    { label: 'Monday', value: 'monday', checked: true },
    { label: 'Tuesday', value: 'tuesday', checked: true },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
    { label: 'Sunday', value: 'sunday' },
  ];

  useEffect(() => {
    calTotalPrice();
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [queries] = useRouterQuery();

  const {
    data: {
      eventId,
      theme,
      slug,
      eventType,
      organiser,
      start,
      startTime: mainEventStartTime,
      endTime: mainEventEndTime,
    },
  }: any = useQuery(GET_EVENT_INFO);
  const { createContent, patchContent, handleFileUpload, employees, eventVenues, eventClusters } = useForm(
    eventId,
    organiser.company.id,
    {
      ...data,
      user,
    }
  );

  // get booked  and available , then do the math here
  //const bookedSeats = eventVenues.booked.length;

  const { data: attendees, sendNotification } = useData(eventId);

  const useDataContent = useData(eventId);

  const closeModal = () => {
    closeCurrentModal('CONTENT_ITEM');
    closeCurrentModal('NEW_CONTENT_ITEM');
  };

  const calTotalPrice = () => {
    const total = totalEmployeePrice + contentPrice;
    setTotalPrice(total);
  };

  const addToCart = useCallback(async () => {
    try {
      const { errors } = await addContentToCart({
        eventId,
        itemId: data?.id,
        priceId: data.pricingMaster?.id,
      });
      if (errors) {
        alert(errors[0]?.message);
      } else {
        setcartModalOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, [data, eventId]);

  useEffect(() => {
    const usersNotificationList = [];

    let subClusters = [];

    selectedCluster?.map((_cluster) => {
      const cluster = eventClusters.find((x) => x.id === _cluster?.value);

      let currentSubClusters = [];
      if (cluster?.subClusters?.length) {
        currentSubClusters = cluster?.subClusters?.map((subCluster) => {
          return {
            value: subCluster.id,
            label: subCluster.name + `(${subCluster?.users?.length})`,
            ...subCluster,
          };
        });
      }

      subClusters.push(...currentSubClusters);
      // Check if any subcluster is select
      const subClustersNotInEvent = currentSubClusters.filter((subCluster) => {
        let cluster = selectedSubClusters.find((eventSubCluster) => eventSubCluster.value === subCluster.value);
        if (cluster) {
          return true;
        } else {
          return false;
        }
      });

      // If no subclusters is selected add all the members of the parent cluster
      if (!subClustersNotInEvent.length) {
        cluster?.users?.map((user) => {
          usersNotificationList.push(user.user.id);
        });
      }
    });
    setEventSubClusters(subClusters);

    selectedSubClusters?.map((_subCluster) => {
      const subCluster = eventSubClusters.find((x) => x.value === _subCluster?.value);

      subCluster?.users?.map((user) => {
        usersNotificationList.push(user.user.id);
      });
    });

    setAttendeeNotificationList([...new Set(usersNotificationList)]);

    selectedAttendees?.map((_attendee) => {
      const attendee = attendees.find((x) => x?.user?.id === _attendee?.value);
      usersNotificationList.push(attendee?.user?.id);
    });

    setAttendeeNotificationList([...new Set(usersNotificationList)]);
  }, [selectedAttendees, selectedCluster, selectedSubClusters]);

  const calEmployeeTotalPrice = (employees) => {
    let total = 0;

    employees?.map((employee) => {
      total += employee.price;
    });
    setTotalEmployeePrice(total);

    //calTotalPrice()
  };

  const notifiedUser = useCallback(async () => {
    try {
      await sendNotification(data.id, selectedAttendees?.map((item) => item.value).filter(Boolean));
      alert('Send notification to email successfully');
    } catch (error) {
      console.log(error);
    }
  }, [selectedAttendees, data]);

  const dispatch = useDispatch();

  function getDaysBetweenDates(startDate, endDate) {
    const diffInDays = moment(endDate).diff(moment(startDate), 'days');

    if (diffInDays <= 6) {
      const days = [];
      let currentDate = moment(startDate);
      const end = moment(endDate);

      while (currentDate <= end) {
        let day = currentDate.format('dddd');
        days.push({ label: day, value: day.toLowerCase(), checked: true });

        currentDate = currentDate.clone().add(1, 'day');
      }

      return days;
    } else {
      return weekDays;
    }
  }

  const initialValues = useMemo(() => {
    const values = {
      name: '',
      body: '',
      imageURL: '',
      linkURL: '',
      keyword: '',
      keywords: [],
      links: [],
      images: [],
      subContentType: 'content',
      isCartAvailable: false,
      isScheduleAvailable: false,
      isPricingAvailable: false,
      isConstraintAvailable: false,
      totalEmployeePrice: 0,
      pricingType: 'MULTIPLE',
      pricingEmployee: [],
      // start_date: moment(new Date()),
      // end_date: moment(new Date()).add(6, 'M'),
      start_date: null,
      end_date: null,

      // addition
      isPricingMultiple: false,
      dummyEmployee: [],
      // start_time: moment('09:00', 'HH:mm a'),
      // end_time: moment('10:30', 'HH:mm a'),
      start_time: null,
      end_time: null,
      ...(data || {}),
      pricingMaster: {
        currency: '',
        price: null,
        slots: null,
        remaining_slots: null,
        availability_weeks: [],
        availability_hours: [],
        duration: 90,
        tax: 0,
        //totalContentPrice,
        // addition
        // weeks: weekDays.slice(0, -2),
        weeks: null,
        interval: INTERVAL[2],
        ...((data || {}).pricingMaster || {}),
      },
    }; // add venue details from content here

    /*
    {
    "duration": 30,
    "availability_hours": [
        "16:06 pm",
        "17:48 pm"
    ],
    "remaining_slots": null,
    "tax": 23,
    "price": 100,
    "availability_weeks": [
        "all",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
    ],
    "id": "6455fc93f5e3cc6aab4102dd",
    "slots": null,
    "currency": "gbp",
    "booked_slots": 0
}
    */

    if (data) {
      values.isPricingMultiple = values.pricingType === 'MULTIPLE';
      values.pricingMaster.weeks = (values.pricingMaster.availability_weeks || []).map((item: any) => ({
        value: item,
        label: _.startCase(item),
      }));
      if (values.pricingMaster.tax && values.pricingMaster.price) {
        if (values.pricingType !== 'MULTIPLE') {
          setContentPrice(values.pricingMaster.price);
          calTotalPrice();
        }

        values.pricingMaster.totalContentPrice =
          values.pricingMaster.price + (values.pricingMaster.tax / 100) * values.pricingMaster.price;
        setTotalContentPrice(values.pricingMaster.totalContentPrice);
      }

      //values.name = 'Dharmil';
      values.start_date = values.startDate && moment(values.startDate);
      values.end_date = values.endDate && moment(values.endDate);

      values.pricingMaster.interval =
        INTERVAL.find((item: any) => item.value === values.pricingMaster.duration) || INTERVAL[0];
      values.pricingMaster.currency = values.pricingMaster.currency;
      values.pricingMaster.tax = values.pricingMaster.tax;

      values.start_time =
        values.pricingMaster.availability_hours && values.pricingMaster.availability_hours.length === 2
          ? moment(values.pricingMaster.availability_hours[0], 'HH:mm a')
          : '';
      values.end_time =
        values.pricingMaster.availability_hours && values.pricingMaster.availability_hours.length === 2
          ? moment(values.pricingMaster.availability_hours[1], 'HH:mm a')
          : '';

      values.selectedVenue = data?.selectedVenue?.value ? JSON.parse(data?.selectedVenue) : selectedVenue;
      setSelectedVenue(JSON.parse(data?.selectedVenue));

      if (values.pricingType === 'MULTIPLE') {
        calEmployeeTotalPrice(values.pricing);
      }

      values.pricingEmployee = (values.pricing || []).map((item: any) => {
        return {
          id: item.employee[0].id,
          pricingId: item.id,
          price: item.price,
          tax: item.tax,
          show_rating: item.show_rating,
        };
      });

      values.dummyEmployee = (values.pricing || []).map((item: any) => ({
        id: {
          value: item.employee[0].id,
          userId: item.employee[0].user.id,
          label: [item.employee[0].user.firstName, item.employee[0].user.lastName].filter(Boolean).join(' '),
        },
        pricingId: item.id,
        price: item.price,
        tax: item?.tax,
        total: item?.price + item?.price * (item?.tax / 100),
        show_rating: item.show_rating,
      }));
    }
    return values;
  }, [data]);

  useEffect(() => {
    const total = totalEmployeePrice + contentPrice;
    setTotalPrice(total);
  }, [totalEmployeePrice, contentPrice]);

  React.useEffect(() => {
    dispatch(setAtt(0));
  }, []);

  const onSubmit = async (values: any) => {
    try {
      const newValues = JSON.parse(JSON.stringify(values));
      console.log('newValues', 'newValues');

      if (!values.name) {
        alert('Event name is required');
        return;
      } else if (isVenueChecked && !selectedVenue?.value) {
        alert('Venue is required');
        return;
      } else if (!values.pricingMaster.price && values.isPricingAvailable && !values.isPricingMultiple) {
        alert('Price is required');
        return;
      } else if (values.isPricingMultiple && !values.dummyEmployee?.length) {
        alert('Employee is required');
        return;
      } else if (values.isPricingMultiple && values.dummyEmployee?.length) {
        let amount = 0;

        newValues.pricingEmployee = values.dummyEmployee?.map((item: any) => {
          amount += parseInt(item.price);
          return {
            id: item.id.value,
            userId: item?.id?.userId,
            show_rating: item.show_rating,
            pricingId: item.pricingId,
            price: item.price,
            tax: item.tax,
          };
        });
        if (newValues?.isPricingMultiple) {
          newValues.pricingMaster.price = amount;
        }

        if (!amount) {
          alert('Employee price is required');
          return;
        }
      }

      newValues.selectedVenue = JSON.stringify(selectedVenue);
      newValues.startDate = moment(values.start_date)
        .startOf('day')
        .add(moment.duration(moment(values.start_time).format('HH:mm')))
        .toString();
      newValues.endDate = moment(values.end_date)
        .startOf('day')
        .add(moment.duration(moment(values.end_time).format('HH:mm')))
        .toString();
      newValues.pricingType = newValues.isPricingMultiple ? 'MULTIPLE' : 'SINGLE';
      newValues.isCartAvailable = newValues.isCartAvailable;
      newValues.isScheduleAvailable = newValues.isScheduleAvailable;
      delete newValues.start_date;
      delete newValues.end_date;

      delete newValues.start_time;
      delete newValues.end_time;

      if (newValues.pricingMaster) {
        newValues.pricingMaster.duration = newValues.pricingMaster.interval
          ? +newValues.pricingMaster.interval.value
          : null;
        newValues.pricingMaster.currency = organiser.company.currency;
        newValues.pricingMaster.availability_weeks = newValues.pricingMaster.weeks?.map((item: any) => item.value);

        if (values.start_time && values.end_time) {
          newValues.pricingMaster.availability_hours = [
            values.start_time.format('HH:mm a'),
            values.end_time.format('HH:mm a'),
          ];
        }

        newValues.pricingMaster.price = +newValues.pricingMaster.price || 0;
        newValues.pricingMaster.tax = +newValues.pricingMaster.tax || 0;

        delete newValues.pricingMaster.totalContentPrice;
        delete newValues.pricingMaster.interval;
        delete newValues.pricingMaster.weeks;
        delete newValues.pricingMaster.remaining_slots;
        delete newValues.pricingMaster.booked_slots;
      }

      newValues.subContentType = queries.type || 'content';

      // add isVenueChecked to newValues payload

      newValues.isVenueChecked = isVenueChecked;

      newValues.userNotificationList = attendeeNotificationList;

      // add selected value and seatcount to newVenues
      // let selectedVenue: any = localStorage.getItem('selectedVenue');
      // if (selectedVenue) {
      //   // selectedVenue = JSON.parse(selectedVenue)
      //   newValues.selectedVenue = selectedVenue;
      //   console.log('latest newValues', newValues)
      // }

      // console.log('picker: ', data);
      // const { errors }: any = !data ? await createContent(newValues) : await patchContent(newValues);
      let result: any;
      let contentId: any;
      let pricingId: any;
      try {
        // contentId = result.contentId;
        result = !data ? await createContent(newValues) : await patchContent(newValues);
        contentId = result.Id.contentId;
        pricingId = result.Id.pricingId;
      } catch (errors) {
        console.log('errors', errors);
        if (errors) {
          // console.log(errors);
          // throw new Error(errors[0].message || 'Failed to save content');
        }
      }
      // if (errors) {
      //   console.log(errors);
      //   throw new Error(errors[0].message || 'Failed to save content');
      // }
      if (mode === 'calendar') {
        history.push(`/${slug}/calendar?content_id=${contentId}`);
      } else if (mode === 'shoppingCart') {
        console.log('newValues', eventId, contentId, pricingId);
        const { errors } = await addContentToCart({
          eventId,
          itemId: contentId,
          priceId: pricingId,
        });
        // if (errors?.msg) {
        //   alert(errors?.msg);
        // } else {
        //   setcartModalOpen(true);
        // }
        history.push(`/${slug}/cart`);
      } else {
        history.push(`/${slug}/content`);
      }
      parentProps.loadEvents && parentProps.loadEvents(eventId);
      closeModal();
    } catch (error) {
      if (error.message === 'Need to setup Connect Account first') {
        // alert("We require you to have a connected account for future payments. We appreciate it may not be currently relevant but it helps in future.")
        if (
          window.confirm(
            'We require you to have a connected account for future payments. We appreciate it may not be currently relevant but it helps in future.'
          )
        ) {
          window.open('https://my.synkd.life/');
        }
      } else {
        // need for better alert UI
        alert(error.message);
      }
    }
  };

  const goToCart = useCallback(async () => {
    try {
      history.push(`/${slug}/cart`);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  }, [data, history]);
  const currencyConverted = CURRENCIES_DICT?.map((x) => ({
    ...x,
    label: x.label.toUpperCase(),
  }));
  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={validationSchema(isMeeting)}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, values }) => (
        <Form className={`formContainer`}>
          <ModalHeader className={`formHeader`}>
            {(values.isPricingAvailable || isVenueChecked) && ( // || value.isVenueAvailablee
              <>
                {isVenueChecked && (
                  <div className="position-relative mt-2 ml-2 mb-2">
                    <button
                      type="submit"
                      onClick={(e) => {
                        // e.preventDefault();
                        setMode('calendar');
                      }}
                      className="btn btn-primary btn-edit "
                      style={{ background: '#00abcd' }}
                    >
                      <FontAwesomeIcon icon={faCalendar} />
                    </button>
                    <InputField
                      containerClassName="position-absolute btn-checkbox mt-2"
                      type="checkbox"
                      inputStyle={
                        windowDimensions <= 595
                          ? { right: '-2px' }
                          : windowDimensions > 600 && windowDimensions < 768
                          ? { right: '-2px' }
                          : { right: '-12px' }
                      }
                      hideLabel={true}
                      name="isScheduleAvailable"
                      colSize={5}
                      noPadding={true}
                      checked={
                        isVenueChecked ||
                        values.isPricingAvailable ||
                        (values.isPricingMultiple && values.dummyEmployee?.length > 0)
                      }
                      onChange={(e: any) => {
                        if (e.target.checked) {
                          setFieldValue('isCartAvailable', false);
                        }
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    />
                  </div>
                )}

                {!isVenueChecked && values.isPricingAvailable && (
                  <div className="position-relative mt-2 ml-2 mb-2 px-3">
                    <button
                      type="submit"
                      className="btn btn-purple btn-edit"
                      onClick={() => {
                        setMode('shoppingCart');
                      }}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </button>
                    <InputField
                      type="checkbox"
                      inputStyle={
                        windowDimensions <= 595
                          ? { right: '-8px' }
                          : windowDimensions > 600 && windowDimensions < 768
                          ? { right: '-2px' }
                          : { right: '-8px' }
                      }
                      containerClassName="position-absolute btn-checkbox mt-2"
                      hideLabel={true}
                      name="isCartAvailable"
                      colSize={5}
                      noPadding={true}
                      checked={
                        (values.isPricingAvailable && values.pricingMaster.price) ||
                        (values.isPricingAvailable && values.dummyEmployee?.length > 0)
                      }
                    />
                  </div>
                )}
              </>
            )}

            <div className="mt-2 ml-2 mb-2">
              <button
                type="submit"
                className="btn btn-purple btn-edit"
                // onClick={() => {
                // }}
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
            </div>

            <div className="mt-2 ml-2 mb-2">
              <button type="button" className="btn btn-red" onClick={() => closeModal()}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className={`formBody`}>
              <div className="groupContainer pl-3">
                <div className="avatar-container">
                  <div
                    className="column left"
                    style={{
                      backgroundColor: ' #e6e6e6',
                      borderRadius: '50%',
                      height: '100px',
                      overflow: 'hidden'
                    }}
                  >
                    <ImageField
                      imageStyle={{
                        borderRadius: '50%',
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      name="imageURL"
                      upload={handleFileUpload}
                      style={{ color: 'white' }}
                      size={'4x'}
                    />
                  </div>
                  {values.imageURL && (
                    <button type="button" className="rmv-avatar-btn" onClick={() => setFieldValue('imageURL', '')}>
                      <FontAwesomeIcon icon={faTimes} className="rmv-avatar-icon" />
                    </button>
                  )}
                </div>

                <div className="column center title-input">
                  <InputField
                    name="name"
                    placeHolder={'Name'}
                    hideLabel
                    style={{
                      margin: '0 !important',
                      minWidth: windowDimensions > 992 ? '50%' : '100%',
                    }}
                    noPadding={windowDimensions > 992}
                  />
                </div>
              </div>

              <TextareaFieldContent
                style={{
                  flexDirection: windowDimensions > 992 ? 'row' : 'column',
                  minWidth: windowDimensions > 992 ? 'calc(100% - 55px)' : '100%',
                  maxWidth: '100%',
                  paddingRight: 15,
                }}
                textAreaStyle={{
                  maxWidth: windowDimensions > 992 ? '69%' : '100%',
                  minWidth: windowDimensions > 992 ? '50%' : '100%',
                }}
                width={windowDimensions}
                name="body"
                label={'Description'}
                colSize={'11'}
              />

              <LinkListField
                style={{
                  flexDirection: windowDimensions > 992 ? 'row' : 'column',
                  minWidth: windowDimensions > 992 ? '50%' : '100%',
                }}
                containerStyle={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  flex: 1,
                  minWidth: windowDimensions > 992 ? '50%' : '100%',
                  paddingRight: 0,
                }}
                width={windowDimensions}
                name="links"
                label={'Links'}
                colSize={'12'}
              />

              <KeywordsField
                width={windowDimensions}
                name="keywords"
                label={'Keywords'}
                colSize={'12'}
                containerStyle={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: windowDimensions > 992 ? 10 : 0,
                  flex: 1,
                  minWidth: windowDimensions > 992 ? '50%' : '100%',
                  paddingRight: 0,
                }}
              />
              <div className=" col-md-12 col-sm-12">
                <InputField
                  type="checkbox"
                  label="Activate Location"
                  name="isVenueChecked"
                  noPadding={true}
                  hideLabel={true}
                  colSize={0}
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 134,
                    zIndex: 99,
                  }}
                  checked={isVenueChecked}
                  onChange={(e: any) => {
                    if (e.target.checked) {
                      setIsVenueChecked(true);
                      setFieldValue('isScheduleAvailable', true);
                    } else {
                      setIsVenueChecked(false);
                      setFieldValue('isScheduleAvailable', false);
                    }
                  }}
                />
                <Collapsible
                  trigger={'Venue'}
                  triggerClassName="collapsibleContainer"
                  triggerOpenedClassName="collapsibleContainer"
                >
                  <div className="row">
                    {isVenueChecked && (
                      <GridInputContainer>
                        <VenueSelector
                          containerClassName={`field-container`}
                          addLabelClassName={'field-label'}
                          addInputClassName={'field-input'}
                          name={`location.id`}
                          label={'location'}
                          hideLabel
                          placeholder={'Select...'}
                          noPadding
                          value={selectedVenue}
                          options={eventVenues?.map((val: any) => ({
                            value: val.id,
                            label: val.name,
                            att: val.bookedSlots.length,
                            max: val.maxAttendees,
                          }))}
                          onChange={(e: any) => {
                            displaySelectedItem(e);
                          }}
                        />

                        <MaxAttField
                          containerClassName={`field-container`}
                          addLabelClassName={'field-label'}
                          addInputClassName={'field-input'}
                          type="text"
                          name={'maxAttendees'}
                          label={'Capacity'}
                          colSize={6}
                          value={selectedVenue.max}
                          disabled
                        />
                      </GridInputContainer>
                    )}

                    {/* <InputFieldModal
                      containerClassName={'col-sm-12 col-md-12 col-lg-6 col-xl-6 mx-0 p-0 px-3 flex-grow-1'}
                      addLabelClassName={'col-sm-12 col-md-12 col-lg-4 col-xl-4'}
                      // addInputClassName={'col-lg-1'}
                      inputStyle={{ marginLeft: '3px' }}
                      type="checkbox"
                      checked={true}
                      name={'link'}
                      label={'Map Link'}
                      
                      colSize={3}
                    /> */}
                  </div>
                </Collapsible>
              </div>
              <div className="col-md-12 col-sm-12">
                <InputField
                  type="checkbox"
                  label="Activate Admin"
                  name="isConstraintAvailable"
                  noPadding={true}
                  hideLabel={true}
                  colSize={0}
                  additionalClass={'p-0'}
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 134,
                    zIndex: 99,
                  }}
                />
                <Collapsible
                  trigger={'Availability'}
                  triggerClassName="collapsibleContainer"
                  triggerOpenedClassName="collapsibleContainer"
                >
                  {values.isConstraintAvailable && (
                    <>
                      <div className="row">
                        <GridInputContainer>
                          <InputSelectPricingFieldModal
                            name={'pricingMaster.interval'}
                            label={'Session Length'}
                            addInputClassName={'field-input'}
                            options={INTERVAL}
                            placeHolder={'session Length..'}
                            onChange={(e: any) => {
                              setFieldValue(
                                'end_time',
                                moment(values.start_time, 'HH:mm a').add(parseInt(e.target.value.value || 2), 'minutes')
                              ); // Adding 1hr 30 minutes)
                            }}
                          />
                          <TimePickerField
                            containerClassNames={'field-container'}
                            labelClassNames={'field-label'}
                            inputContainerClassNames={'field-input-flex'}
                            name={'time'}
                            label={'Time'}
                          />
                        </GridInputContainer>
                      </div>
                      <div className="row">
                        <GridInputContainer>
                          <DateRangeFieldModal
                            minDate={moment(mainEventStartTime)}
                            maxDate={moment(mainEventEndTime)}
                            formClassName={'field-form'}
                            containerClassNames={'field-container'}
                            labelClassNames={'field-label'}
                            inputClassNames={'field-input'}
                            name={'date'}
                            label={'Date Range'}
                            onChange={(e: any, picker: any) => {
                              let days = getDaysBetweenDates(picker.startDate, picker.endDate);
                              setFieldValue('pricingMaster.weeks', days);
                            }}
                          />
                          <InputMultiSelectField
                            addFormGroupClassName={'field-container'}
                            addLabelClassName={'field-label'}
                            addSelectClassName={'field-input'}
                            name={'pricingMaster.weeks'}
                            label={'Days'}
                            pageLabel={'days'}
                            colSize={6}
                            colSizeLabel={1}
                            colSizeInput={4}
                            groupHeading={{ checked: true }}
                            options={weekDays}
                            value={weekDays}
                            noPadding={true}
                          />
                        </GridInputContainer>
                      </div>
                    </>
                  )}
                </Collapsible>
              </div>
              <div className="col-md-12 col-sm-12">
                <InputField
                  type="checkbox"
                  label="Activate Pricing"
                  name="isPricingAvailable"
                  noPadding={true}
                  hideLabel={true}
                  colSize={0}
                  onChange={(e: any) => {
                    if (e.target.checked) {
                      setFieldValue('isCartAvailable', true);
                    } else {
                      setFieldValue('isCartAvailable', false);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 134,
                    zIndex: 99,
                  }}
                />
                <Collapsible
                  trigger={`Pricing (${organiser.company.currency})`}
                  triggerClassName="collapsibleContainer"
                  triggerOpenedClassName="collapsibleContainer"
                >
                  {values.isPricingAvailable && (
                    <div className="row">
                      {!values.isPricingMultiple && (
                        <Grid3InputContainer>
                          <InputFieldModal
                            containerClassName={`field-container`}
                            addLabelClassName={'field-label'}
                            addInputClassName={'field-input'}
                            type="number"
                            name={'pricingMaster.price'}
                            label={'Price'}
                            onChange={(e: any) => {
                              setContentPrice(parseInt(e.target.value || 0));

                              if (!values.pricingMaster.tax) {
                                setTotalContentPrice(0);
                              } else if (!values.pricingMaster.price) {
                                setTotalContentPrice(0);
                              } else {
                                let total =
                                  values.pricingMaster.price +
                                  (values.pricingMaster.tax / 100) * values.pricingMaster.price;
                                setTotalContentPrice(total);

                                setFieldValue('totalEmployeePrice', total);
                              }
                            }}
                          />

                          <InputFieldModal
                            containerClassName={`field-container px-2 col-sm-2`}
                            addLabelClassName={'field-label col-sm-6'}
                            addInputClassName={'field-input'}
                            type="number"
                            defaultValue={0}
                            name={`pricingMaster.tax`}
                            label={'Tax (%)'}
                            onChange={(e) => {}}
                          />

                          <InputFieldModal
                            containerClassName={`field-container px-2 col-sm-2`}
                            addLabelClassName={'field-label col-sm-5'}
                            addInputClassName={'field-input'}
                            // defaultValue={formValues[item?.id?.value]?.total}
                            // value={formValues[item?.id?.value]?.total}
                            type="number"
                            defaultValue={0}
                            name={'totalEmployeePrice'}
                            label={'Total'}
                            inputValue={totalPrice + (values.pricingMaster.tax / 100) * totalPrice}
                            onChange={(e: any) => {
                              if (!values.pricingMaster.price) {
                                //setTotalContentPrice(0);
                              } else if (!values.pricingMaster.tax) {
                                //setTotalContentPrice(0);
                              } else {
                                setTotalContentPrice(
                                  values.pricingMaster.price +
                                    (values.pricingMaster.tax / 100) * values.pricingMaster.price
                                );
                              }
                            }}
                            disabled={true}
                          />
                        </Grid3InputContainer>
                      )}
                      <GridInputContainer>
                        <InputFieldModal
                          type="checkbox"
                          containerClassName={`field-container`}
                          addLabelClassName={'field-label'}
                          addInputClassName={'field-input'}
                          name={'isPricingMultiple'}
                          onChange={(e: any) => {
                            if (e.target.checked) {
                              setContentPrice(0);
                              calEmployeeTotalPrice(values.dummyEmployee);
                            } else {
                              setTotalEmployeePrice(0);
                              setFieldValue('pricingMaster.price', 0);
                              setFieldValue('pricingMaster.tax', 0);
                              setFieldValue('pricingMaster.totalContentPrice', 0);
                            }
                            calTotalPrice();
                          }}
                          label={'Employee'}
                        />
                      </GridInputContainer>

                      <EmployeeListContainer className="pb-2">
                        {values.isPricingMultiple && (
                          <EmployeeListField
                            name="dummyEmployee"
                            setTotalEmployeePrice={setTotalEmployeePrice}
                            colSize={12}
                            windowDimensions={windowDimensions}
                            options={employees?.map((val: any) => ({
                              value: val.id,
                              userId: val.user.id,
                              label: [val.user.firstName, val.user.lastName].filter(Boolean).join(' '),
                            }))}
                          />
                        )}
                      </EmployeeListContainer>
                    </div>
                  )}
                </Collapsible>
              </div>

              {/* <div className="col-md-12 col-sm-12">
                <Collapsible
                  trigger={'Images'}
                  triggerClassName="collapsibleContainer"
                  triggerOpenedClassName="collapsibleContainer"
                >
                  <ImageListField
                    name="images"
                    label={'Images'}
                    colSize={'12'}
                    upload={handleFileUpload}
                    windowDimentions={windowDimensions}
                  />
                </Collapsible>
              </div> */}

              <div className="col-12">
                <Collapsible
                  trigger={'Images'}
                  triggerClassName="collapsibleContainer"
                  triggerOpenedClassName="collapsibleContainer"
                >
                  <ImageListField
                    name="images"
                    label={'Images'}
                    colSize={'12'}
                    upload={handleFileUpload}
                    windowDimentions={windowDimensions}
                  />
                </Collapsible>
              </div>

              <div className="col-12">
                <Collapsible
                  trigger={'Send Notification'}
                  triggerClassName="collapsibleContainer"
                  triggerOpenedClassName="collapsibleContainer"
                >
                  <NotificationMainContainer>
                    <div className="row">
                      <div
                        id="notification_bar_attendees"
                        className={`col-md-4 col-lg-4 col-sm-12 ${
                          windowDimensions <= 595
                            ? 'm-1'
                            : windowDimensions > 600 && windowDimensions < 768
                            ? 'm-1'
                            : windowDimensions > 768
                            ? ''
                            : ''
                        }`}
                      >
                        <ReactMultiSelectCheckboxes
                          placeholder="User"
                          options={attendees?.map((val: any) => {
                            return {
                              value: val.user.id,
                              label: val.name,
                            };
                          })}
                          dropdownButton={{
                            width: '90%',
                          }}
                          value={selectedAttendees}
                          onChange={(selected: any) => setSelectedAttendees(selected)}
                        />
                      </div>
                      <div
                        id="notification_bar_users"
                        className={`col-md-4 col-lg-4 col-sm-12 ${
                          windowDimensions <= 595
                            ? 'm-1'
                            : windowDimensions > 600 && windowDimensions < 768
                            ? 'm-1'
                            : windowDimensions > 768
                            ? ''
                            : ''
                        }`}
                      >
                        <ReactMultiSelectCheckboxes
                          placeholderButtonLabel="Select cluster"
                          placeholder="Cluster"
                          options={eventClusters?.map((val: any) => {
                            return {
                              value: val.id,
                              label: val.name + `(${val?.users?.length})`,
                            };
                          })}
                          value={selectedCluster}
                          onChange={(selected: any) => setSelectedCluster(selected)}
                        />
                        {/* <div style={{ width: '20%', position: 'relative' }}>
                          <button
                            style={{ width: 'auto', float: 'right' }}
                            type="button"
                            className="btn btn-purple"
                            onClick={() => notifiedUser()}
                          >
                            <img
                              className="drop-image-styling"
                              src={dropDownBtn}
                              style={{ height: '20px', width: '20px' }}
                            />
                          </button>
                        </div> */}
                      </div>
                      <div
                        id="notification_bar_users"
                        className={`col-md-4 col-lg-4 col-sm-12 ${
                          windowDimensions <= 595
                            ? 'm-1'
                            : windowDimensions > 600 && windowDimensions < 768
                            ? 'm-1'
                            : windowDimensions > 768
                            ? ''
                            : ''
                        }`}
                      >
                        <ReactMultiSelectCheckboxes
                          placeholderButtonLabel="Select sub cluster"
                          dropdownButton={{
                            width: '100%',
                          }}
                          placeholder="Sub Cluster"
                          options={eventSubClusters}
                          value={selectedSubClusters}
                          onChange={(selected: any) => setSelectedSubClusters(selected)}
                          styles={{
                            dropdownButton: (baseStyles) => ({
                              ...baseStyles,
                              width: '100%',
                            }),
                          }}
                        />
                      </div>
                    </div>
                  </NotificationMainContainer>
                </Collapsible>
              </div>
            </div>
          </ModalBody>
        </Form>
      )}
    </Formik>
  );
};

const NotificationMainContainer = styled.div`
  #notification_bar_users > div > button {
    width: 100%;
  }
  #notification_bar_attendees > div > button {
    width: 100%;
  }
  #notification_bar_users > div {
    width: 80%;
  }
  #notification_bar_attendees > div {
    width: 80%;
  }
  #notification_bar_users {
    display: inline-flex;
  }
  #notification_bar_attendees {
    display: inline-flex;
  }
`;

const GridInputContainer = styled.div`
  display: grid;
  width: 100%;

  .field-form {
    display: grid;
    width: 100%;
  }
  .field-container {
    display: flex;
    align-items: center;
    align-self: start;
    width: 100%;
  }
  .field-label {
    flex: 30%;
  }
  .field-input {
    flex: 65%;
    justify-content: flex-start;
  }

  .field-input-flex {
    flex: 70%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.1rem;
    overflow: visible;
  }

  .time-select-input {
    flex: 0.5;
    // height: 1.5rem;
    // border: 1px solid red;
  }
  .time-select-input > a {
    right: 2px;
    top: 6px;
    // height: 1.5rem;
    // border: 1px solid red;
  }
  .time-select-input > input {
    left: 3px;
  }
  .time-select-input > div {
    height: 2.5rem;
  }
  .time-select-input > div > div {
    height: 2.5rem;
  }

  /* Style rc-time-picker to match ReactSelect */
  .time-select-input input {
    height: 38px; /* match ReactSelect height */
    padding: 8px 4px;
    font-size: 14px;
    line-height: 1.5;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }

  /* Optionally tweak outer wrapper */
  .rc-time-picker {
    width: 60%;
  }

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;
const Grid3InputContainer = styled.div`
  display: grid;
  width: 100%;

  .field-form {
    display: grid;
    width: 100%;
  }
  .field-container {
    display: flex;
    align-items: center;
    align-self: start;
    width: 100%;
  }
  .field-label {
    flex: 40%;
  }
  .field-input {
    flex: 60%;
    justify-content: flex-start;
  }

  .field-input-flex {
    flex: 60%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.25rem;
  }

  .time-select-input {
    flex: 0.5;
    height: 2.5rem;
    // border: 1px solid red;
  }

  /* Target the outer container */
  .rc-time-picker {
    margin-top: 4px;
    height: 2.5rem;
    display: flex;
    align-items: center;
    display: flex;
  }

  /* Target the input field */
  .rc-time-picker-input {
    height: 100% !important;
    padding: 0 12px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const EmployeeListContainer = styled.div`
  width: 100%;
  .employee-list {
    border: 1px solid red;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .employee-list-items {
    display: flex;
    flex-direction: column;
  }
  .employee-input-items {
    display: grid;
    flex: 1;
  }
  .field-container {
    display: flex;
    align-items: center;
    align-self: start;
  }
  .field-label {
    flex: 40%;
  }
  .field-input {
    flex: 60%;
    justify-content: flex-start;
  }

  @media (min-width: 768px) {
    .employee-list-items {
      flex-direction: row;
      align-items: center;
    }

    .employee-input-items {
      grid-template-columns: 1.9fr 1fr 1.1fr 1fr;
    }
  }
`;

export default ContentItemContent;
function setcartModalOpen(arg0: boolean) {
  throw new Error('Function not implemented.');
}
