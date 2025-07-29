import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Field, FieldArray, useFormikContext } from 'formik';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Input from '../Form/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTimes, faArrowUp, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/images/inspired_logo.png';
import styled from 'styled-components';
import FormRow from '../Form/FormRow';
import { updateEventOneField, updateEventThemeField } from '../../providers/events';
import { getAvatarUploadToken } from '../../providers/user';
import { uploadPresignedS3 } from '../../providers/core/common';
import './InputTypeFieldStyle.css'

const InputTypeField = ({
  theme,
  logo_image,
  client,
  id,
  name,
  label,
  width,
  type = 'text',
  placeholder = '',
  colSize = '6',
  disable,
  disable_text,
  disable_check,
  imageIcon = false,
  addClassName,
  header_image,
  header_image_check,
  left_image_check,
  right_image_check,
  logo_image_check,
  setFieldValue,
  left_image,
  right_image,
}: any) => {
  const { errors }: any = useFormikContext();

  const [imageLeft, setImageLeft] = useState(left_image);
  const [imageLeftFile, setImageLeftFile] = useState(null);
  const [leftImageCheck, setLeftImageCheck] = useState<boolean>(left_image_check);

  const [imageTop, setImageTop] = useState(header_image);
  const [imageTopFile, setImageTopFile] = useState(null);
  const [topImageCheck, setTopImageCheck] = useState<boolean>(header_image_check);

  const [imageRight, setImageRight] = useState(right_image);
  const [imageRightFile, setImageRightFile] = useState(null);
  const [rightImageCheck, setRightImageCheck] = useState<boolean>(right_image_check);

  const [imageLogo, setImageLogo] = useState(logo_image);
  const [imageLogoFile, setImageLogoFile] = useState(null);
  const [logoImageCheck, setLogoImageCheck] = useState<boolean>(logo_image_check);

  const [isLoading, setIsLoading] = useState(false);

  // const [logoStatus, setLogoStatus]  = useState((): boolean =>{
  //   localStorage.getItem('logoChecked')
  //     ? JSON.parse(localStorage.getItem('logoChecked')) == true
  //       ? false
  //       : true
  //     : false;
  // })

  const LeftImageref = useRef();
  const RightImageref = useRef();
  const TopImageref = useRef();
  const LogoImageref = useRef();

  const changePhoto = async (e: any, setPhoto: any, setFile: any, label: string) => {
    e.preventDefault();
    e.persist();
    setIsLoading(true);
    // setLoadingRight(true)
    let reader = new FileReader();
    let file = e.target.files[0];
    if (label === 'logo_image') {
      await updateLogoEventPhoto(e.target.files[0]);
    } else {
      await updateEventPhoto(e.target.files[0], setPhoto, label);
    }

    reader.onloadend = () => {
      setFile(file);
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
    setIsLoading(false);
  };

  const updateLogoEventPhoto = useCallback(
    async (file) => {
      try {
        // const file = eventPhotoFileForm

        const key = file.name
        const result: any = await getAvatarUploadToken(id, key);
        if (result.data.getS3POSTUploadToken) {
          const data = result.data.getS3POSTUploadToken;
          const url = data.generatedPresign

          const res: any = await uploadPresignedS3(url, file);
          if (res.status !== 200) {
            // TODO: show nice error to user
            console.error('File could not be uploaded to S3');
          } else {
            let previewUrl = `https://user-assets.synkd.life/event-logo/${id}/${file.name}`;
            if (previewUrl) {

              setImageLogo(previewUrl);

              const res: any = await updateEventThemeField(id, {
                ...theme,
                logoURL: previewUrl,
              });

              if (res.data.updateEvent.error) {
                return alert(res.data.updateEvent.error);
              }

              client.writeData({
                data: {
                  ...data,
                  theme: {
                    ...theme,
                    logoURL: previewUrl,
                  },
                  event: {
                    ...data.event,
                    theme: {
                      ...theme,
                      logoURL: previewUrl,
                    },
                  },
                },
              });
            }
          }
        } else {
          alert('Error getting upload token for avatar upload');
        }
      } catch (error) {
      }
    },
    [id, event]
  );

  const clearEventPhoto = useCallback(

    async (setPhoto: any, keyName: string, file?: any) => {
      setPhoto(null)
      setIsLoading(true);

      let updateResponse: any;

      if(keyName === 'logo_image'){

       
        updateResponse = await updateEventThemeField(id, {
          ...theme,
          logoURL: "",
        });

      } else {

        updateResponse = await updateEventOneField(id, keyName, "");
        
      }


      const { 
        data: {
          updateEvent,
          updateEvent: { error: errMessage },
        },
      } = updateResponse;
   
      if (errMessage) {
      }
      
      //TODO: Delete the cleared image from S3Storage
      
      setIsLoading(false);

      client.writeData({
        data: {
          eventName: updateEvent.name,
          description: updateEvent.description,
          startTime: updateEvent.startAt,
          endTime: updateEvent.endAt,
          status: updateEvent.status,
          slug: updateEvent.slug,
          theme: {
            __typename: 'eventTheme',
            ...updateEvent.theme,
          },
          timezone: updateEvent.timezone,
          timezoneLocation: updateEvent.timezoneLocation,
          language: updateEvent.language,
          event: {
            __typename: 'eventAll',
            ...updateEvent,
            theme: {
              __typename: 'eventAllTheme',
              ...updateEvent.theme,
            },
            menus: updateEvent.menus.map((item: any) => ({
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
    },

    [id, event]
  );


  const logoCheckedhandler = ()=>{
    // alert(logoImageCheck);
    const status = localStorage.getItem('logoChecked')
      ? JSON.parse(localStorage.getItem('logoChecked')) == true
        ? false
        : true
      : false;
    localStorage.setItem('logoChecked', JSON.stringify(status) )
  }

  const updateEventPhoto = useCallback(

    async (file: any, setPhoto: any, keyName: string) => {
      try {
        const key = file.name
        const result: any = await getAvatarUploadToken(id, key);

        if (result.data.getS3POSTUploadToken) {

          const data = result.data.getS3POSTUploadToken;
          const url = data.generatedPresign

          
          const res: any = await uploadPresignedS3(url, file);

          if (res.status !== 200) {
            // TODO: show nice error to user
            console.error('File could not be uploaded to S3');
          } else {

            let previewUrl = `https://user-assets.synkd.life/event-logo/${id}/${file.name}`;
            if (previewUrl) {

              setPhoto(previewUrl);
              
              const { 
                data: {
                  updateEvent,
                  updateEvent: { error: errMessage },
                },
              }: any = await updateEventOneField(id, keyName, previewUrl);

              if (errMessage) {
                alert(errMessage);
              }

              client.writeData({
                data: {
                  eventName: updateEvent.name,
                  description: updateEvent.description,
                  startTime: updateEvent.startAt,
                  endTime: updateEvent.endAt,
                  status: updateEvent.status,
                  slug: updateEvent.slug,
                  theme: {
                    __typename: 'eventTheme',
                    ...updateEvent.theme,
                  },
                  timezone: updateEvent.timezone,
                  timezoneLocation: updateEvent.timezoneLocation,
                  language: updateEvent.language,
                  event: {
                    __typename: 'eventAll',
                    ...updateEvent,
                    theme: {
                      __typename: 'eventAllTheme',
                      ...updateEvent.theme,
                    },
                    menus: updateEvent.menus.map((item: any) => ({
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

              
            }
          }
        } else {
          alert('Error getting upload token for avatar upload');
        }
      } catch (error) {
      }
    },
    [id, event]
  );
  if (isLoading) {
    return <p>uploading image...</p>;
  }
  return (
    <div
      // style={{
      //   display: 'flex',
      //   flexDirection: 'row',
      //   minWidth: '100%',
      //   maxWidth: '100%',
      //   flexWrap: 'wrap',
      //   gap: 20,
      // }}
      className="imgContainer"
    >
      <LogoImageWrapper>
        <LogoImageContent>
       
          <Label  labelFor={"hero_image"}>
            Cover Image
          </Label>
          {
            //@ts-ignore
            <Input
              colSize="1"
              name={`header_image_check`}
              id={`header_image_check`}
              type={'checkbox'}
              disabled={disable_check || disable}
              checked={topImageCheck}
              onChange={(e) => {
                setTopImageCheck((prevState) => !prevState);
                setFieldValue('header_image_check', !topImageCheck);
              }}
              // {...field}
              // checked={field.value}
              // fieldError={!!errors[name]}
            />
          }
          <div>
            <label htmlFor={'topImageFileInput'}>
              {imageTop ? (
                <div>
                  <img
                    alt="Inspired logo"
                    src={imageTop}
                    className="imgTop"
                    // style={{ height: '100px', width: '100px', objectFit: 'cover' }}
                  />
                  {disable_check || disable ? null : (
                    <div style={{ position: 'absolute', right: 0, top: 0 }}>
                      <button
                        onClick={async () => {
                         
                          clearEventPhoto(setImageTop, 'header_image')
                         
                        }}
                        // disabled={isEditImageTop && loadingTop}
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
                    </div>
                  )}
                </div>
              ) : (
                <div className='imgTopPlaceholder'>
                <FontAwesomeIcon icon={faArrowUp} size={'2x'} style={{ color: '#bbb' }} />
                <span style={{ marginLeft: '10px', color: '#555', fontSize: '18px'}}> 970 x 250 or 728 x 90</span>
              </div>
              )}
            </label>
            <input
              ref={TopImageref}
              id={'topImageFileInput'}
              type="file"
              style={{ display: 'none', position: 'absolute' }}
              onChange={(e: any) => changePhoto(e, setImageTop, setImageTopFile, 'header_image')}
              disabled={disable_check || disable}
            />
          </div>
        </LogoImageContent>
        {/* <div className='imgsec' style={{ ...centerStyle }}> */}
        <LogoImageContent >
        <Label  labelFor={"left_image"}>
            Left Image
          </Label>
          {
            //@ts-ignore
            <Input
              colSize="1"
              name={`left_image_check`}
              id={`left_image_check`}
              type={'checkbox'}
              disabled={disable_check || disable}
              checked={leftImageCheck}
              onChange={(e) => {
                setLeftImageCheck((prevState) => !prevState);
                setFieldValue('left_image_check', !leftImageCheck);
              }}
              // {...field}
              // checked={field.value}
              // fieldError={!!errors[name]}
            />
          }
          <div>
            <label htmlFor={'leftImageFileInput'}>
              {imageLeft ? (
                <div>
                  <img
                    alt="Inspired logo"
                    src={imageLeft}
                    style={{ height: '300px', width: '110px', objectFit: 'cover' }}
                  />
                    {disable_check || disable ? null : (
                    <div style={{ position: 'absolute', right: 0, top: 0 }}>
                      <button
                        onClick={async () => {

                          clearEventPhoto(setImageLeft, 'left_image')
 
                        }}
                        // disabled={isEditImageTop && loadingTop}
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
                    </div>
                  )}
                </div>
                
              ) : (
                <div
                  style={{
                    backgroundColor: 'rgb(230,230,230)',
                    height: '300px',
                    width: '110px',
                    display: 'flex',
                    flex: 1,
                    alignItems: 'center',
                    justifyItems: 'center',
                    position: 'relative',
                    paddingLeft: "20px",
                  }}
                >
                 
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    size={'2x'}
                    style={{
                      color: '#bbb',
                      justifySelf: 'center',
                      alignSelf: 'center',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute', // Place the text absolutely inside the div
                      transform: 'rotate(-90deg)', // Rotate the text 90 degrees counterclockwise
                      color: '#555',
                      fontSize: '18px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    300 x 600
                  </span>
                </div>
              )}
            </label>
            <input
              ref={LeftImageref}
              id={'leftImageFileInput'}
              type="file"
              style={{ display: 'none', position: 'absolute' }}
              onChange={(e: any) => changePhoto(e, setImageLeft, setImageLeftFile, 'left_image')}
              disabled={disable_check || disable}
            />
          </div>
        </LogoImageContent>
        <LogoImageContent>
        <Label  labelFor={"right_image"}>
            Right Image
          </Label>
          {
            //@ts-ignore
            <Input
              colSize="1"
              name={`right_image_check`}
              id={`right_image_check`}
              type={'checkbox'}
              disabled={disable_check || disable}
              checked={rightImageCheck}
              onChange={(e) => {
                setRightImageCheck((prevState) => !prevState);
                setFieldValue('right_image_check', !rightImageCheck);
              }}
              // {...field}
              // checked={field.value}
              // fieldError={!!errors[name]}
            />
          }
          <div>
          </div>
            <label htmlFor={'RightImageFileInput'}>
              {imageRight ? (

                <div>
                  <img
                    alt="Inspired logo"
                    src={imageRight}
                    style={{ height: '300px', width: '110px', objectFit: 'cover' }}
                  />
                  {disable_check || disable ? null : (
                      <div style={{ position: 'absolute', right: 0, top: 0 }}>
                        <button
                          onClick={async () => {

                            clearEventPhoto(setImageRight, 'right_image')
                           
                          }}
                          // disabled={isEditImageTop && loadingTop}
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
                      </div>
                    )}
                </div>
                
              ) : (
                <div
                  style={{
                    backgroundColor: 'rgb(230,230,230)',
                    height: '300px',
                    width: '110px',
                    display: 'flex',
                    flex: 1,
                    alignItems: 'center',
                    justifyItems: 'center',
                    paddingLeft: "20px",
                  }}
                >
                  
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    size={'2x'}
                    style={{
                      color: '#bbb',
                      justifySelf: 'center',
                      alignSelf: 'center',
                    }}
                  />
                   <span
                    style={{
                      position: 'absolute', // Place the text absolutely inside the div
                      transform: 'rotate(-90deg)', // Rotate the text 90 degrees counterclockwise
                      color: '#555',
                      fontSize: '18px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    300 x 600
                  </span>
                </div>
              )}
            </label>
            <input
              ref={RightImageref}
              id={'RightImageFileInput'}
              type="file"
              style={{ display: 'none', position: 'absolute' }}
              onChange={(e: any) => changePhoto(e, setImageRight, setImageRightFile, 'right_image')}
              disabled={disable_check || disable}
            />
          </LogoImageContent>

          <LogoImageContent>
        <Label colSize={`1`} labelFor={name}>
          {'Logo'}
        </Label>
        {
          //@ts-ignore
          <Input
            colSize="1"
            name={`logo_image_check`}
            id={`$logo_image_check`}
            type={'checkbox'}
            disabled={disable_check || disable}
            checked={logoImageCheck}
            // checked={
            //   localStorage.getItem('logoChecked')
            // ? JSON.parse(localStorage.getItem('logoChecked')) == true
            //   ? true
            //   : false
            // : false
            // }
            onChange={(e) => {
              setLogoImageCheck((prevState) => !prevState);
              setFieldValue('logo_image_check', !logoImageCheck); 
            }}
            // onChange={() => setLogoImageCheck(!logoImageCheck)}
            fieldError={!!errors[name]}
          />
        }
        <div>
          <label htmlFor={'logoImageFileInput'}>
            {imageLogo && imageLogo !== 'undefined' ? (
              <img
                alt="Inspired logo"
                src={imageLogo}
                style={{ width: '300px', height: '100px', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  height: '100px',
                  width: '300px',
                  display: 'flex',
                  flex: 1,
                  justifyItems: 'center',
                  alignItems: 'center',
                }}
              >
                <img src={logo} className="logoImg" />
              </div>
            )}

            {disable_check || disable ? null : (
              <div style={{ position: 'absolute', right: 0, top: 0 }}>
                <button
                  onClick={async () => {
                    // setLoadingLeft(true)
                    // if (isEditImageLeft) {
                    //   await updateEventPhoto(imageLeftFile, setImageLeft, 'left_image')
                    // }
                    // setIsEditImageLeft(!isEditImageLeft)
                    // setLoadingLeft(false)
                    clearEventPhoto(setImageLogo, 'logo_image')
                    // @ts-ignore
                    // LogoImageref.current.value = "";
                    // setImageLogo(null)
                    // setImageLogoFile(null)
                  }}
                  // disabled={isEditImageTop && loadingTop}
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
              </div>
            )}
          </label>
          <input
            ref={LogoImageref}
            id={'logoImageFileInput'}
            type="file"
            style={{ display: 'none', position: 'absolute' }}
            onChange={(e: any) => changePhoto(e, setImageLogo, setImageLogoFile, 'logo_image')}
            disabled={disable_check || disable}
          />
        </div>

      </LogoImageContent>
        </LogoImageWrapper>
    
     
      {errors[name] && <div>{errors[name]}</div>}
    </div>
  );
};
const centerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 10,
};

const LogoImageContent = styled.div<any>`
display: flex;
justify-content: center;
align-items: center;
gap: 0.5rem;


@media screen and (min-width: 639px) {
  scale: 80%;
}
@media screen and (min-width: 767px) {
  
  margin-right: 1rem;
}
`

const LogoImageWrapper = styled.div<any>`
display: grid;
grid-gap: 0.5rem;
grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
margin: 0.5rem;
width: 100%;


@media screen and (min-width: 639px) {
  display: flex; 
  align-items: center;
  flex-wrap: wrap;
  padding: 1rem;
  box-sizing: border-box;
}
`

const EditWrapper = styled.div<any>`
  border: ${(props) => (props.ui && props.ui.isEdit ? '1px solid white' : 'none')};
  position: relative;

  .btn-edit {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 0.8rem;
    padding: 0.3rem;
    width: 30px;
  }
`;

export default InputTypeField;
