import React, { useEffect, useMemo, useState, useRef } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChevronRight, faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import ImageField from './ImageField';
import styled from "styled-components";
// import { Slide } from "react-slideshow-image";
import 'react-slideshow-image/dist/styles.css'


const ImageListField = ({ name, label, placeholder, colSize = '6', upload, windowDimensions }: any) => {

  const { values }: any = useFormikContext();
  const [transformedWidth, setTransformedWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [isNext, setIsNext] = useState(false);
  const [isPrevious, setIsPrevious] = useState(false);
  const [show, setShow] = useState(false);
  const addHiddenButton = useRef(null);
  const [logoSize, setLogoSize] = useState('8x')
 

  useEffect(() => { 
    if(values[name].length){
      setShow(true);
    }
    
  }, []);
  const properties = {
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    indicators: true,
  };

  return (
    <FormGroup >
      <FormFieldContainer>
     
     <div>
              < FieldArray
                name={name}
                render={
                  (arrayHelper: any) => {
                    return (
                    <ImageListContainer>
                      <div className='image-list'>
                      {(values[name] || []).map((item: any, idx: number) => (
                     
                          <div className='image-input-container' >
                            {/* <div > */}
                            <ImageField
                              name={`${name}.${idx}`}
                              upload={upload}
                              value={item}
                             
                              size = {"8x"}
                             
                              />
                            {/* </div> */}
                            
                            <button
                              type="button"
                              className='remove-image'
                              style={{ height: "25px", width: "25px", color: 'white', background: 'red', borderRadius: 25 }}
                              onClick={() => {
                               
                                arrayHelper.form.values.images.length === 1 ? setShow(false):setShow(true);
                                arrayHelper.remove(idx)
                              }}>
                              <FontAwesomeIcon icon={faTimes} size={'1x'} />
                            </button>
                          </div>
                       
                      ))}
                      </div>

          <div className='add-new-btn'>
            <button type="button" className="btn btn-purple"  onClick={
                          () => {
                            setShow(true);
                            if (values[name].length > 3) {
                              setIsNext(true);
                            }
                            arrayHelper.push('');
                          }
                        } ><FontAwesomeIcon icon={faPlus} /></button>
          </div>

                   

                    </ImageListContainer>
                    );
                  }
                }
              />
   </div>

        
      </FormFieldContainer>
    </FormGroup>
  )
}

const FormFieldContainer = styled.div`
width: 100%;

`

const ImageListContainer = styled.div`
width: 100%;
display:grid;
.add-new-btn {
  margin-left: auto;
}

.image-list {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  grid-gap: 1rem;
  width: 100%;
  height: 100px;
}

.image-input-container {
  position: relative;
  height: inherit;
}

.image-input{
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute
  top:0;
  right: 0;
}
`;
const ImageListFieldMain = styled.div`
  .remove-button-cross {
        color: red;
      }
`;
const SlideStyle = styled.div`
.btn{
  margin-left:532px;
}
`;

export default ImageListField;
