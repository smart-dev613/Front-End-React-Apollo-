import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Input from '../Form/Input';
import imageSolid from '../../assets/images/icons/image-solid.svg';
export const ImageField = ({
  name,
  disable,
  upload,
  value,
  style = {},
  size = '8x',
  imageStyle,
}: any) => {
  const { values, setValues }: any = useFormikContext();
  

  const [image, setImage] = useState(value || values[name]);


  const handleImageChange = (e: any) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    let files = e.target.files;

    reader.onloadend = async () => {
      setImage(reader.result);
      const result = upload && (await upload(files));
      if (result) {
        setImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (name.includes('.')) {
      let token = name.split('.');
      const newImages = [...values[token[0]]];
      newImages[token[1]] = image;
      setValues({
        ...values,
        [token[0]]: newImages,
      });
    } else {
      setValues({
        ...values,
        [name]: image,
      });
    }
  }, [image]);

  useEffect(() => {
   const imgVal =values[name]
   if (values[name] ===  ''){
    setImage("")
   }
  }, [values[name]])

  return (
    <div style={{ width: 'inherit', height: 'inherit' }}>
      <label
        htmlFor={name}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {!image ? (
          <FontAwesomeIcon icon={faImage} size={size} style={style} />
        ) : (
          <img className="image-input" style={imageStyle} alt="logo" src={image || imageSolid}  />
        )}
      </label>
      <input
        id={name}
        type="file"
        style={{ ...style.input, display: 'none' }}
        onChange={handleImageChange}
        disabled={disable}
      />
    </div>
  );
};

export default ImageField;
