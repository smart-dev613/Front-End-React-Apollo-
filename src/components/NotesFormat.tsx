import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface NotesFormatProps {
  ListData: {
    heading: string,
    time: string,
    date: string,
    content: string
  }
  action: string
  delete: () => void
//   truncateText: (arg0: string) => string
}

const NotesFormat = (props: NotesFormatProps) => (
  <StyledList>
    <li className="companyList">
      
      <span className="col-sm">
        <span>
          <p className="content-header newLine-style">{props.ListData.heading}</p>
          <p className='time-style'>{props.ListData.date} {props.ListData.time}</p></span>
        {/* <span className="day-time">{props.ListData.date}</span> */}
      </span>

      <span>
        <span className="notes-content newLine-style">{props.ListData.content}</span>
      </span>

      <span className="row center-content">
        <span className='notif-icons'>
          <span className='booking-icons'><button className='icon-button' onClick={props.delete}><FontAwesomeIcon icon='trash' /></button></span>
        </span>
      </span>
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

  .time-style {
    float: right;
  }

    .content-header {
      float: left;
      font-weight: bold;
      margin-bottom: 0px;
    }

    .keywords {
      padding: 20px;
      font-size: inherit;
    }
  
    .companyList {
      list-style-type: none;
      margin-top: -1px;
      border-bottom: 1px solid black;
      padding: 10px;
      color: black;
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
      padding: 0px 20px 0px 0px;
      font-size: small;
    }

    .icon-button {
      border: 0;
      background-color: transparent;
      color: #81D1D0;
    }

    .notif-icons {
      margin-left: auto;
    }

    .newLine-style {
      display: block;
    }
`

export default NotesFormat