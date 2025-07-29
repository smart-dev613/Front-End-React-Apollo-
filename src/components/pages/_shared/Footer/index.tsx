import React from 'react';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';

/** Components */
import { FooterWrapper } from './components/general';

/** Utils */
import { GET_EVENT_INFO } from '../../../../gql/queries';

import logo from '../../../../assets/images/inspired_logo.png';

const Footer: React.FC = () => {
  const {
    data: {
      event: {
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
      }
    }
  }: any = useQuery(GET_EVENT_INFO);

  return (
    <FooterWrapper>
      <div>
        Powered by <strong>Synkd</strong>
        {/* <img src={logo} style={{width: '50px', height: '20px'}}/> */}
      </div>
      <ul className="footer-info">
       
        {
          privacy_check && (
            <li>
              <a href={privacy} target="_blank">Privacy</a>
            </li>
          )
        }
        {
          legal_check && (
            <li>
              <a href={legal} target="_blank">Legal</a>
            </li>
          )
        }
        {
          contact_us_check && (
            <li>
              <a href={`mailto:${contact_us}`} target="_blank">Contact Us</a>
              {/* ${contact_us} */}
            </li>
          )
        }
        {
          your_data_check && (
            <li>
              <a href={your_data} target="_blank">Your Data</a>
              {/* ${contact_us} */}
            </li>
          )
        }
      </ul>
    </FooterWrapper>
  )
}

export default Footer;
