import React, { useState, useMemo, useCallback, useEffect } from 'react';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';
import { useForm } from './hooks/useForm';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

/** Components */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ModalBody, ModalHeader, ModalBodyContent } from './components/general';
// @ts-ignore
import { Slide } from 'react-slideshow-image';
import {
  faCalendar,
  faShoppingCart,
  faTimes,
  faLink,
  faAngleLeft,
  faAngleRight,
  faImage,
  faArchive,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

/** Utils */
import moment from 'moment';
import _ from 'lodash';
import { GET_EVENT_INFO } from '../../../../gql/queries';
import { userIsOrganiser } from '../../../../util/common';

/** Request */
import { addContentToCart } from '../../../../providers/pricing';

/** Types */
import { Props } from './types';

/** Styles */
import 'react-slideshow-image/dist/styles.css';
import AlertContent from '../Alert';
import { isStaging } from '../../../../util/helper';
import { useRouterQuery } from '../../../pages/_hooks/useRouterQuery';
import { PlatformEventMenuPage } from '../../../../constants/menu';
import { updateContentStatus } from '../../../../providers/user';
import { borderRadius } from 'polished';

const ContentItemView: React.FC<Props> = (props: Props) => {
  const [cartModalOpen, setcartModalOpen] = useState(false);

  const {
    ui,
    user,
    closeCurrentModal,
    data: {
      data,
      data: { platformEventMembers },
      props: modalProps,
    },
    setIsEdit,
    fetchCarts,
  } = props;
  let history = useHistory();
  const [queries] = useRouterQuery();

  const {
    data: { eventId, theme, slug, eventType, organiser, menus },
  }: any = useQuery(GET_EVENT_INFO);

  const closeModal = () => {
    closeCurrentModal('CONTENT_ITEM');
  };

  const archiveContent = (status: string) => {
    updateContentStatus(eventId, data?.id, status).then((res: any) => {
      modalProps.loadEvents();
      closeModal();
    });
  };

  const addToCart = useCallback(async () => {
    try {
      console.log("add to cart", eventId, data?.id, data.pricingMaster?.id);
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

  const goToSchedule = useCallback(async () => {
    try {
      history.push(`/${slug}/calendar?content_id=${data.id}`);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  }, [data, history]);

  const isOrganiser = userIsOrganiser(user, organiser);
  const venueProps = JSON.parse(data.selectedVenue);

  const isAdmin = useMemo(() => {
    if (queries.type) {
      const menu = (menus || []).find(
        (item: any) => item.type === PlatformEventMenuPage.CONTENT_CUSTOM && item.parameter === `type=${queries.type}`
      );
      return menu && (menu.userAdmin || []).map((uv: any) => uv?.id).includes(user.userData?.id);
    } else {
      return false;
    }
  }, [menus, queries.type, user]);

  const getProfile = (id) => {
    const profile = platformEventMembers.find((member) => member.user.id === id);
    if (profile?.profile) {
      profile.profile.firstName = profile.user.firstName;
      profile.profile.lastName = profile.user.lastName;
    }

    return profile?.profile ? profile?.profile : profile?.user;
  };

  useEffect(() => {
    fetchCarts(eventId);
    const x = setTimeout(() => {
      cartModalOpen && setcartModalOpen(false);
    }, 2000);

    return () => {
      clearTimeout(x);
    };
  }, [cartModalOpen, eventId]);

  return (
    <>
      <StyledList>
        <>
          <ModalHeader className="modal-header align-items-center px-4 py-2 mb-2">
            <div className="left-header">
              <span style={{ fontWeight: 'bold' }}>{data.name}</span>
            </div>
            <div className="left-header">
              {(isOrganiser || isAdmin) &&
                (data?.contentStatus === 'ARCHIVED' ? (
                  <button className="btn btn-warning" onClick={() => archiveContent('ACTIVE')}>
                    <FontAwesomeIcon icon={faUndo} />
                  </button>
                ) : (
                  <button className="btn btn-red" onClick={() => archiveContent('ARCHIVED')}>
                    <FontAwesomeIcon icon={faArchive} />
                  </button>
                ))}
              {data.isCartAvailable && !(data.isScheduleAvailable || data.isVenueChecked) && (
                <button className="btn btn-purple btn-edit" onClick={() => addToCart()}>
                  <FontAwesomeIcon icon={faShoppingCart} />
                </button>
              )}
              {(data.isScheduleAvailable || data.isVenueChecked) && (
                <button
                  className="btn btn-primary btn-edit"
                  style={{ background: '#00abcd' }}
                  onClick={() => goToSchedule()}
                >
                  <FontAwesomeIcon icon={faCalendar} />
                </button>
              )}
              {(isOrganiser || isAdmin) && (
                <button className="btn btn-purple" onClick={() => setIsEdit(true)}>
                  <FontAwesomeIcon icon="pencil-alt" />
                </button>
              )}
              <button className="btn btn-red" onClick={() => closeModal()}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </ModalHeader>
          <ModalBody className="container" style={{ paddingRight: 0, paddingLeft: 0 }}>
            <div className="item-description d-flex align-items-center space-between px-4 mb-4">
              <div className="avatar-logo">
                {!data.logoUrl ? (
                  <FontAwesomeIcon icon={faImage} size={'2x'} style={{ color: 'white' }} />
                ) : (
                  <img className="avatar-img" alt="logo" src={data.logoUrl} />
                )}
              </div>

              <div className="mx-4 desc-text">
                {/* <h6 className="title d-none d-sm-inline-block" style={{
                  fontFamily: "robotoregular, Helvetica, Arial, sans-serif",
                  fontWeight: "bold",
              }}>{data.name}</h6> */}
                {data.body}
              </div>
            </div>

            <div className="px-4">
              {data.isConstraintAvailable && (
                <div className="add-top-margin">
                  {data?.startDate && (
                    <p className="item-label" style={{ marginRight: 20 }}>
                      <span style={{ fontWeight: 'bold' }}> Date Range: </span>
                      <span className="field-value">
                        {' '}
                        {`${new Date(data?.startDate).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}`}{' '}
                        -{' '}
                        {`${new Date(data?.endDate).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}`}
                      </span>
                    </p>
                  )}

                  {data.pricingMaster?.availability_weeks?.length > 0 && (
                    <p className="item-label" style={{ marginRight: 20 }}>
                      <span style={{ fontWeight: 'bold' }}> Days: </span>
                      <span className="field-value">
                        {data.pricingMaster.availability_weeks
                          .map((day) => {
                            return day.charAt(0).toUpperCase() + day.slice(1, 3).toLowerCase();
                          })
                          .join(', ')}
                      </span>
                    </p>
                  )}

                  {data?.pricingMaster?.duration > 0 && (
                    <p className="item-label" style={{ marginRight: 20 }}>
                      <span style={{ fontWeight: 'bold' }}> Session Length: </span>
                      <span className="field-value">
                        {' '}
                        {Math.floor(data.pricingMaster.duration / 60) > 0 &&
                          `${Math.floor(data.pricingMaster.duration / 60)} hr `}
                        {data.pricingMaster.duration % 60 > 0 && `${data.pricingMaster.duration % 60}mins`}
                      </span>
                    </p>
                  )}
                  {data?.pricingMaster?.availability_hours.length > 0 && (
                    <p className="item-label" style={{ marginRight: 20 }}>
                      <span style={{ fontWeight: 'bold' }}>Time: </span>
                      <span className="field-value">
                        {' '}
                        {data?.pricingMaster?.availability_hours?.[0] +
                          ' - ' +
                          data?.pricingMaster?.availability_hours?.[1]}
                      </span>
                    </p>
                  )}
                </div>
              )}
              {data?.isVenueChecked && (
                <div className="">
                  {venueProps?.label !== '' && (
                    <h6 style={{ marginRight: 20 }}>
                      <span style={{ fontWeight: 'bold' }}>Venue: </span>
                      <span className="field-value">{venueProps?.label}</span>
                    </h6>
                  )}

                  {/* <h6 style={{ fontWeight: 'bold', marginRight: 20 }}>View on map:</h6> */}
                </div>
              )}

              <div className="row m-0 p-0">
                <div className="keywords m-0 p-0">
                  {(data.keywords || []).length > 0
                    ? (data.keywords || []).map((keyword: any) => (
                        <p className="keyword-item m-0 keywords-text">#{keyword}</p>
                      ))
                    : ['']}
                </div>
              </div>

              <div className="row">
                {data?.links?.map((link: any) => (
                  <div className="row justify-content-center align-items-center" key={link.link}>
                    <FontAwesomeIcon icon={faLink} className="mr-2" />
                    <a href={link.link} target="_blank" style={{ textDecoration: 'underline' }}>
                      {link.name ? link.name : link.link.split('.')[1] || 'Link'}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {data?.images.length > 0 && (
              <div
                className="d-flex justify-content-center align-items-center py-4 px-8"
                // style={{ backgroundColor: '#e7e7e7', height: '35vh' }}
                style={{ backgroundColor: '#e7e7e7' }}
              >
                <div style={{ maxWidth: '70%' }}>
                  <Carousel
                    showThumbs={false}
                    showIndicators={false}
                    showStatus={false}
                    dynamicHeight={true}
                    showArrows={true}
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
                    {data?.images?.map((item: any) => (
                      <div key={item}>
                        <img src={item} style={{ height: '14rem', width: '100%', objectFit: 'contain', display:'block', borderRadius: '50%'}} />
                      </div>
                    ))}
                  </Carousel>
                </div>
              </div>
            )}
            {data.isPricingAvailable && data.pricingType === 'SINGLE' ? (
              <div className="row pricing-container">
                <div className="employee-wrapper">
                  <div className="employee-price" style={{ textTransform: 'uppercase' }}>
                    {data.pricingMaster?.currency}{' '}
                    {data.pricingMaster?.price + (data.pricingMaster?.price * data.pricingMaster?.tax) / 100}
                  </div>
                </div>
              </div>
            ) : (
              <div className="row pricing-container">
                {data.pricing
                  ?.sort((a, b) => a.price - b.price)
                  .map((item: any) => {
                    console.log('item: ', item);
                    const profile = getProfile(item.employee[0].user.id);
                    return profile ? (
                      // <div key={item.id} className="employee-wrapper">
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
                            backgroundColor: '#e9ecef',
                            borderRadius: '100%',
                            padding: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '80px',
                            height: '80px',
                          }}
                        >
                          {profile?.avatar ? (
                            <img
                              src={profile.avatar}
                              style={{ width: '75px', height: '75px', borderRadius: '50%', objectFit: 'contain', display: 'hidden' }}
                            />
                          ) : (
                            <FontAwesomeIcon icon="user" size={'3x'} style={{ color: '#c1d0d6' }} />
                          )}
                        </div>
                        <div className="employee-name">
                          {[profile.firstName, profile.lastName].filter(Boolean).join(' ')}
                        </div>
                        <div className="employee-price" style={{ textTransform: 'uppercase' }}>
                          {item?.currency} {item?.price}
                        </div>
                      </div>
                    ) : (
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
                            backgroundColor: '#e9ecef',
                            borderRadius: '100%',
                            padding: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '80px',
                            height: '80px',
                          }}
                        >
                          {item.employee[0].avatar || item.employee[0].user.avatar ? (
                            <img
                              src={item.employee[0].avatar || item.employee[0].user.avatar}
                              style={{ width: '75px', height: '75px', borderRadius: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <FontAwesomeIcon icon="user" size={'3x'} style={{ color: '#c1d0d6' }} />
                          )}
                        </div>

                        <div className="employee-name">
                          {[item.employee[0].user.firstName, item.employee[0].user.lastName].filter(Boolean).join(' ')}
                        </div>
                        <div className="employee-price" style={{ textTransform: 'uppercase' }}>
                          {item?.currency} {item?.price}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </ModalBody>
        </>

        <AlertContent
          isOpeModal={cartModalOpen}
          onClick={() => {
            setcartModalOpen(false);
          }}
        />
      </StyledList>
    </>
  );
};
// closeModal();

const StyledList = styled.div`
  .avatar-logo {
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    flex-direction: column;
    background: #e9ecef;
    box-shadow: 0 0 5px #8a8a8a;
    width: 65px !important;
    height: 65px !important;
  }

  .item-description {
    max-height: 70px;
    min-height: 70px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .desc-text {
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 70px;
    min-height: 70px;
  }

  .avatar-img {
    width: 65px !important;
    height: 65px !important;
  }

  .avatar-img {
    border-radius: 50%;
    object-fit: cover;
  }

  @media screen and (max-width: 765px) {
    .avatar-logo {
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      flex-direction: column;
      background: #e9ecef;
      box-shadow: 0 0 5px #8a8a8a;
      width: 44px !important;
      height: 44px !important;
    }
  }

  @media screen and (max-width: 450px) {
    .avatar-img {
      width: 45px !important;
      height: 45px !important;
    }

    .left-header .btn {
      padding: 6px 6px;
      font-size: 12px;
      min-width: 30px;
    }

    .left-header .btn .fa-icon {
      font-size: 12px;
    }

    .left-header {
      gap: 6px;
    }

    .keyword-item {
      padding: 2px 6px !important;
    }

    .desc-text {
      overflow: hidden;
      text-overflow: ellipsis;
      max-height: 70px;
      min-height: 70px;
      margin-left: 0.8rem !important;
      margin-right: 0.8rem !important;
    }
  }
`;

export default ContentItemView;
