import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, compose } from 'redux'
import { setCurrentLanguage } from '../store/ui/action'

type Props = any

function LanguagePicker(props: Props) {
  const { i18n } = useTranslation()

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)
  }

  const languages = [{id:2, name: 'en',flag:"🇬🇧"}, {id:1, name: 'cn',flag:"🇨🇳"},{id: 3, name: 'fr',flag:"🇫🇷"},{id: 4, name: 'ae',flag:"🇦🇪"},{id: 5, name: 'de',flag:"🇩🇪"},{id: 6, name: 'es',flag:"🇪🇸"}, {id: 7, name: 'id',flag:"🇮🇩"}, {id: 8, name: 'kr',flag:"🇰🇷"}, {id: 9, name: 'pt',flag:"🇵🇹"}, {id: 10, name: 'se',flag:"🇸🇬"}, {id: 11, name: 'th',flag:"🇹🇭"}]
  return (
    <StyledLanguagePicker>
      {/* <button className='btn' onClick={() => changeLanguage('cn')}>🇨🇳</button>
      <button className='btn' onClick={() => changeLanguage('en')}>🇬🇧</button> */}
  
      <select className='language-picker p-0' onChange={(e) => {changeLanguage(e.currentTarget.value); props.setCurrentLanguage(e.currentTarget.value)}} defaultValue={localStorage.getItem('i18nextLng')}>
        {
          languages.map(langue => (
            <option key={langue.id} value={langue.name}>{(langue.name).toUpperCase()}</option>
          ))
        }
      </select>

      {/* <select className='language-picker p-0' onChange={(e) => {changeLanguage(e.currentTarget.value); props.setCurrentLanguage(e.currentTarget.value)}} defaultValue={localStorage.getItem('i18nextLng')}>
        {
          languages.map(langue => (
            <option key={langue.id} value={langue.name}>{(langue.flag)}</option>
          ))
        }
      </select> */}
      

    </StyledLanguagePicker>
  )
}

const StyledLanguagePicker = styled.div`
  // position: absolute;    
  bottom: 50px; /* need to accurately position */
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .btn {
    padding: .375rem;
  }

  .language-picker {
    color: white;
    border:0px;
    outline:0px;
    background: transparent;
    padding: 5px;
    font-size: 14px;
    // text-decoration: underline;

    option { color: black; }
  }
`

const mapDispatchToProps = function(dispatch: Dispatch) {
  return bindActionCreators(
    {
      setCurrentLanguage
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(LanguagePicker)