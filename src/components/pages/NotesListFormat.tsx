import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface ListFormatProps {
  ListData: {
    event: string,
    name: string,
    person: string,
    location: string,
    time: string,
    date: string,
    id: string,
    type: string,
  }
  action: string
  //truncateText: (arg0: string) => string
  accept: (arg1: string, arg2: string) => void
  reject: (arg1: string, arg2: string) => void
}

const NotesListFormat = (props: ListFormatProps) => (
  <StyledList>
    <li className="companyList">

      {/* <span className="row center-content">
        <span className='notif-icons'>
          <span><button className='icon-button' onClick={props.accept}><FontAwesomeIcon icon='check-circle' /></button></span>
          <span><button className='icon-button' onClick={props.reject}><FontAwesomeIcon icon='times-circle' /></button></span>
        </span>
      </span> */}
      

      <span className="main-info">
      <span className="day-time">{props.ListData.date} {props.ListData.time}</span>
        <span className="itemCompanyName newLine-style">{props.ListData.event}</span>
      </span>
        
      <span className="newLine-style">{props.ListData.person}</span>

      {
        props.ListData.type === 'invitation' ? (
          <span className="icons-style">
            <span className='notif-icons'>
              <span><button className='icon-button' onClick={() => props.accept('accept', props.ListData.id)}><FontAwesomeIcon icon='check-circle' /></button></span>
              <span><button className='icon-button cancel-button' onClick={() => props.reject('deny', props.ListData.id)}><FontAwesomeIcon icon='times-circle' /></button></span>
            </span>
            {/* <span className="day-time">{props.ListData.date}</span> */}
          </span>
        ) : (
          <span className="icons-style"></span>
        )
      }
      
      {/* <div className="row"> */}
      {/* <div className="col-sm-3 companyLogo">
          
          <span className="companyImage">
            <img src={props.ListData.Img} alt="company name" />
          </span>
        </div> */}

      {/* <div className="col-sm-9 companyDescription">
          <span className="companyIntro">
            <p>
              {props.ListData.Introduction}
            </p>
          </span>
          <span className="keywords">
            <KeywordList Keywords={props.ListData.Keywords} />
          </span>
        </div> */}
      {/* </div> */}
    </li>
  </StyledList>
)

const StyledList = styled.div`
  img{
      border-style:none;
      height: 100%;
      width: 100%;
      width: 200px;
      max-width: 250px;
      min-height: 200px;
      max-height: 200px;
    }

    .icons-style {
      margin: 0px;
      padding: 0px;
    }

    .itemCompanyName {
      font-weight: bold;
    }

    .keywords {
      padding: 20px;
      font-size: inherit;
    }
  
    .companyList {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      list-style-type: none;
      margin-top: -1px;
      border-bottom: 1px solid #dfdfdf;
      padding: 10px;
      color: black;
      .main-info {

      }
    }

    .companyIntro {
      p{
        font-size: inherit;
        padding: 10px; 
      }
    }

    .search-icon {
      display: flex;
      align-items: center;
      width: 0;
    }

    .center-content {
      justify-content: center;
    }

    .day-time {
      float: left;
      clear: left;
      font-size: small;
      color: grey
    }

    .icon-button {
      border: 0;
      background-color: transparent;
      color: #81D1D0;
      font-size: 20px;
      outline: none;
    }

    .notif-icons {
      margin-left: auto;
    }

    .newLine-style {
      display: block;
    }

    .cancel-button {
      color: red;
    }
`

export default NotesListFormat 