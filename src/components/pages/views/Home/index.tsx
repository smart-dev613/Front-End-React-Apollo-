import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';

/** Components */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Container, EditWrapper } from './components/general';
import NavTile from '../../../NavTile';

/** Utils */
import { bindActionCreators, Dispatch, compose } from 'redux';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { GET_EVENT_INFO } from '../../../../gql/queries';
import { userIsOrganiser } from '../../../../util/common';

/** Request */
import { updateEventOneField } from '../../../../providers/events';
import { getAvatarUploadToken } from '../../../../providers/user';
import { uploadPresignedS3 } from '../../../../providers/core/common';


/** Store */
import { showModal } from '../../../../store/modal/action';
import { setCurrentPage, setIsEditPage, setIsViewMode } from '../../../../store/ui/action';

/** Types */
import { Props } from './types';
import { AppState } from '../../../../store/root';

/** Constants */
import { MENU_LIST } from './constants';
import { PAGE_MAPPING } from '../../../../constants/menu';

/** stylesheet */
import './homestyle.css'

const Home: React.FC<Props> = (props: Props) => {
  const { ui, user, setCurrentPage, setIsEditPage, showModal, client, setIsViewMode } = props;

  const {
    data,
    data: {
      eventName,
      theme,
      slug,
      eventType,
      organiser,
      description,
      event,
      event: {
        id,
        menus,
        description_check,
        qr_code_url,
        qr_code_url_check,
        header_image,
        header_image_check,
        left_image,
        left_image_check,
        right_image,
        right_image_check,
        name_check,
      },
    },
  }: any = useQuery(GET_EVENT_INFO);

  const [isEditImageTop, setIsEditImageTop] = useState(false);
  const [imageTop, setImageTop] = useState(header_image);
  const [imageTopFile, setImageTopFile] = useState(null);
  const [loadingTop, setLoadingTop] = useState(false);

  const [isEditImageLeft, setIsEditImageLeft] = useState(false);
  const [imageLeft, setImageLeft] = useState(left_image);
  const [imageLeftFile, setImageLeftFile] = useState(null);
  const [loadingLeft, setLoadingLeft] = useState(false);

  const [isEditImageRight, setIsEditImageRight] = useState(false);
  const [imageRight, setImageRight] = useState(right_image);
  const [imageRightFile, setImageRightFile] = useState(null);
  const [loadingRight, setLoadingRight] = useState(false);

  const LeftImageref = useRef();
  const RightImageref = useRef();
  const TopImageref = useRef();
  const changePhoto = async (e: any, setPhoto: any, setFile: any, label: string) => {
    e.preventDefault();
    e.persist();
    setLoadingRight(true);
    let reader = new FileReader();
    let file = e.target.files[0];

    await updateEventPhoto(e.target.files[0], setPhoto, label);

    reader.onloadend = () => {
      setFile(file);
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
    setLoadingRight(false);
  };

  useEffect(() => {
    console.log('UPLOAD LEFT IMAGE');
  }, [imageLeftFile]);

  const updateEventPhoto = useCallback(
    async (file: any, setPhoto: any, keyName: string) => {
      try {
        console.log('ID IS: ', id);
        const key = file.name
        const result: any = await getAvatarUploadToken(id, key);
        if (result.data.getS3POSTUploadToken) {
          console.log('result IS: ', result);
          const data = result.data.getS3POSTUploadToken;
          console.log('FILE IS: ', file);
          // construct the FormData manually for sending to S3
          const formData = new FormData();
          // formData.append('Content-Type', file.type)
          formData.append('Content-Type', file.type);

          // add all the required presigned fields
          Object.entries(data.fields).forEach(([k, v]) => {
            formData.append(k, v as any);
          });

          // add the object key in the bucket (lbi-avatars/USER_ID/image.png)
          // @ts-ignore
          formData.append('key', `event-logo/${id}/${file.name}`);

          // ACL must be public read
          formData.append('acl', 'public-read');

          // and finally add the file itself (this should be last)
          formData.append('file', file);

          const res: any = await uploadPresignedS3(data.url, formData);
          if (res.status !== 204) {
            // TODO: show nice error to user
            console.error('File could not be uploaded to S3');
          } else {
            let previewUrl = `https://user-assets.synkd.life/event-logo/${id}/${file.name}`;
            if (previewUrl) {
              setPhoto(previewUrl);
              const {
                data: {
                  updateEvent: { error: errMessage },
                },
              }: any = await updateEventOneField(id, keyName, previewUrl);
              if (errMessage) {
                alert(errMessage);
              }
              client.writeData({
                data: {
                  ...data,
                  event: {
                    ...data.event,
                  },
                },
              });
            }
          }
        } else {
          alert('Error getting upload token for avatar upload');
        }
      } catch (error) {
        console.log(error);
      }
    },
    [id, data, event]
  );

  const menusDict = useMemo(() => {
    // @ts-ignore
    const selectedMenus = menus && menus.length ? menus : PAGE_MAPPING[eventType];


    return (selectedMenus || []).reduce((acc: any, curr: any) => {
      acc[curr.type] = curr;
      return acc;
    }, {});

  }, [menus, eventType]);

  const toggleModal = (modal: string) => {
    showModal(modal, 'sm', null, null, {
      slug,
      qr_code_url,
    });
  };

  useEffect(() => {
    setCurrentPage('Dashboard');
  }, []);

  const isOrganiser = userIsOrganiser(user, organiser);

   const MobileTitle = styled.div`
     /* display: flex;
    justify-content:center;
    width:100% ;
    height:100% ;
    position:relative ;
    top:0 ;
    padding-bottom:1rem ; */
     top: 140px;
     z-index: 150;
     display: flex;
     align-items: center;
     justify-content: center;
     width: 100%;
     height: 3.5rem;
     padding-bottom: 1rem;
          /* background: #efefef; */
     h1 {
       font-size: 2rem;
       color: #111;
     }

     @media only screen and (min-width: 576px) {
       display: none;
     }

     @media only srceen and (max-width: 450px) {
       padding: 0px 0px !important;
     }
   `;

  return (
    <Container ui={ui} theme={theme} className="page-container">
      {isOrganiser && (
        <div className="action-button" style={{ right: 20 }}>
          <button className="btn btn-edit btn-purple" onClick={() => setIsViewMode(!ui.isViewMode)}>
            <FontAwesomeIcon icon={ui.isViewMode ? faEyeSlash : faEye} />
          </button>
        </div>
      )}

      {name_check && (
        <MobileTitle>
          <h1>{eventName}</h1>
        </MobileTitle>
      )}

      {header_image_check && (
        <EditWrapper
          className="top-inner-banner"
          style={{ border: 'none', display: 'flex', justifyContent: 'center' }}
          ui={ui}
        >
          <div style={{ display: 'flex', position: 'relative' }}>
            {!ui.isViewMode && ui.isEdit && (
              <>
                <button
                  className="btn btn-edit"
                  onClick={async () => {
                    // setLoadingLeft(true)
                    // if (isEditImageLeft) {
                    //   await updateEventPhoto(imageLeftFile, setImageLeft, 'left_image')
                    // }
                    // setIsEditImageLeft(!isEditImageLeft)
                    // setLoadingLeft(false)
                    // @ts-ignore
                    TopImageref.current.value = '';
                    setImageTopFile(null);
                    setImageTop(null);
                    await updateEventPhoto(null, setImageTop, 'header_image');
                  }}
                  disabled={isEditImageTop && loadingTop}
                >
                  <FontAwesomeIcon
                    icon={'times-circle'}
                    style={{
                      color: 'red',
                      backgroundColor: 'white',
                      borderRadius: 25,
                    }}
                  />
                </button>
              </>
            )}
            {isEditImageTop ? (
              // <input className="fileInput" type="file" onChange={(e) => changePhoto(e)} />
              <>
                <label htmlFor={'topImageFileInput'} className="top-inner-banner">
                  {imageTop ? (
                    <img
                      className="nav_logo_sml"
                      alt="Inspired logo"
                      src={imageTop}
                      style={{
                        maxHeight: '250px',
                        width: '100vw',
                        maxWidth: '970px',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <>
                      <div className="topImage d-none d-md-block">970 x 250</div>
                      <div className="topImage d-md-none">300 x 100</div>
                    </>
                  )}
                </label>
                <input
                  ref={LeftImageref}
                  id={'leftImageFileInput'}
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e: any) => changePhoto(e, setImageLeft, setImageLeftFile, 'left_image')}
                />
              </>
            ) : imageTop ? (
              <img src={imageTop} className="_imgTop" />
            ) : (
              <>
                <div className="topImage d-none d-md-block" style={{ maxHeight: '250px' }}>
                  970 x 250
                </div>
                <div
                  className="topImage d-md-none"
                  style={{
                    maxHeight: '100px',
                    width: '100vw',
                    maxWidth: '300px',
                  }}
                >
                  300 x 100
                </div>
              </>
            )}
          </div>
        </EditWrapper>
      )}
      <div
        className={`content-wrapper  ${header_image_check ? '' : 'no-image'}`}
        style={{
          marginTop: header_image_check ? '20px' : '100px',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        {!left_image_check && <div style={{ ...imagePlaceHolderStyle }} />}
        {left_image_check && (
          <EditWrapper ui={ui}>
            {!ui.isViewMode && ui.isEdit && (
              <>
                <button
                  className="btn btn-edit"
                  onClick={async () => {
                    // setLoadingLeft(true)
                    // if (isEditImageLeft) {
                    //   await updateEventPhoto(imageLeftFile, setImageLeft, 'left_image')
                    // }
                    // setIsEditImageLeft(!isEditImageLeft)
                    // setLoadingLeft(false)
                    // @ts-ignore
                    LeftImageref.current.value = '';
                    setImageLeftFile(null);
                    setImageLeft(null);
                  }}
                  disabled={isEditImageLeft && loadingLeft}
                >
                  <FontAwesomeIcon
                    icon={'times-circle'}
                    style={{
                      color: 'red',
                      backgroundColor: 'white',
                      borderRadius: 25,
                    }}
                  />
                </button>
              </>
            )}
            {isEditImageLeft ? (
              // <input className="fileInput" type="file" onChange={(e) => changePhoto(e)} />
              <>
                <label htmlFor={'leftImageFileInput'} className="top-inner-banner">
                  {imageLeft ? (
                    <img
                      className="nav_logo_sml sideImg"
                      alt="Inspired logo"
                      src={imageLeft}
                      style={{ ...imageContainerStyle }}
                    />
                  ) : (
                    <div className="right-leftImage sideImg" style={{ ...imagePlaceHolderStyle }}>
                      300 x 600
                    </div>
                  )}
                </label>
                <input
                  ref={TopImageref}
                  id={'topImageFileInput'}
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e: any) => changePhoto(e, setImageTop, setImageTopFile, 'header_image')}
                />
              </>
            ) : imageLeft ? (
              <div className="right-leftImage sideImg">
                <img src={imageLeft} style={{ ...imageContainerStyle }} />
              </div>
            ) : (
              <div className="right-leftImage sideImg" style={{ ...imagePlaceHolderStyle }}>
                300 x 600
              </div>
            )}
          </EditWrapper>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '3.5vw', marginRight: '3.5vw' }}>
          {/* {description_check && <div className='desstyle' style={{ textAlign: 'center', marginBottom: '3rem' }}>{description.substring(0,100)+"..."}</div>} */}
          {description_check && <div className="desstyle">{description.substring(0, 100)}</div>}
          <div
            className={`menu-wrapper `}
            style={{
              marginTop: '10px',
              justifyItems: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            {MENU_LIST.map((menu: any) => {
              if (menu.menu) {
                if (isOrganiser) {
                  if (menu.key === 'qr' && !qr_code_url_check && ui.isViewMode) return null;
                  if (menu.menu_key && menusDict[menu.menu_key] && !menusDict[menu.menu_key].show && ui.isViewMode)
                    return null;
                } else {
                  //if (menu.key === 'qr' && !qr_code_url_check) return null;
                  if (menu.menu_key && menusDict[menu.menu_key] && !menusDict[menu.menu_key].show) return null;
                }
              }
              if (menu.key === 'admin' && (ui.isViewMode || !isOrganiser)) return null;

              return (
                <div
                  // className="menu-item"
                  key={menu.url}
                  onClick={(e) => {
                    menu.modal && toggleModal(menu.modal);
                  }}
                >
                  <NavTile theme={theme} icon={menu.icon} target={!menu.modal ? `/${slug}${menu.url}` : undefined}>
                    {menu.menu_key ? menusDict[menu.menu_key] && menusDict[menu.menu_key].label : menu.name}
                  </NavTile>
                </div>
              );
            })}
          </div>
        </div>
        {!right_image_check && <div style={{ ...imagePlaceHolderStyle }} />}
        {right_image_check && (
          <EditWrapper>
            {!ui.isViewMode && ui.isEdit && (
              <>
                <button
                  className="btn btn-edit"
                  onClick={async () => {
                    //@ts-ignore
                    RightImageref.current.value = '';
                    setImageRightFile(null);
                    setImageRight(null);
                  }}
                  disabled={isEditImageRight && loadingRight}
                >
                  <FontAwesomeIcon
                    icon={'times-circle'}
                    style={{
                      color: 'red',
                      backgroundColor: 'white',
                      borderRadius: 25,
                    }}
                  />
                </button>
              </>
            )}
            {isEditImageRight ? (
              <>
                <label htmlFor={'RightImageFileInput'} className="top-inner-banner">
                  {imageRight ? (
                    <img
                      className="nav_logo_sml sideImg"
                      alt="Inspired logo"
                      src={imageRight}
                      style={{ ...imageContainerStyle }}
                    />
                  ) : (
                    <div className="right-leftImage sideImg" style={{ ...imagePlaceHolderStyle }}>
                      300 x 600
                    </div>
                  )}
                </label>
                <input
                  ref={RightImageref}
                  id={'RightImageFileInput'}
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e: any) => changePhoto(e, setImageRight, setImageRightFile, 'right_image')}
                />
              </>
            ) : imageRight ? (
              <div className="right-leftImage sideImg">
                <img src={imageRight} style={{ ...imageContainerStyle }} />
              </div>
            ) : (
              <div className="right-leftImage sideImg" style={{ ...imagePlaceHolderStyle }}>
                300 x 600
              </div>
            )}
          </EditWrapper>
        )}
      </div>
    </Container>
  );
};
const IMAGE_HEIGHT = 55;
const imagePlaceHolderStyle = {
  maxWidth: `${IMAGE_HEIGHT / 2}vh`,
  maxHeight: `${IMAGE_HEIGHT}vh`,
};
const imageContainerStyle = {
  maxWidth: `${IMAGE_HEIGHT / 2}vh`,
  maxHeight: `${IMAGE_HEIGHT}vh`,
  ObjectFit: 'cover',
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
      showModal,
      setCurrentPage,
      setIsEditPage,
      setIsViewMode,
    },
    dispatch
  );
};

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(Home);
