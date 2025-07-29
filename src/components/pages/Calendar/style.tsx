import styled from "styled-components"

import { UIState } from "../../../store/ui/types"

export const StyledList = styled.div<{ ui: UIState }>`
.custom-calander-header{
  width:100%;
  display : table;
}
.companyLogo{
  display : table-cell;
}
.box-align-employee{
  display : table-cell;
  width: 250px;
}
.box-align-employee button{
  background-color: ${props => (props.theme && props.theme.primaryColour) ? props.theme.primaryColour : '#4fb6c0'} !important;
  color: #fff;
  margin-right: 1rem;
  padding: 8px 8px 5px 8px;
}

.custom-calendar-table{
  height: 45vh;
  overflow-y: scroll;
}

.test-gray{
  background-color: #c3c0c0 !important;
}
.btn {
  background-color: ${props => (props.theme && props.theme.primaryColour) ? props.theme.primaryColour : '#4fb6c0'};
}
@media (min-width: 576px) { 
.col-sm { 
    flex-basis: auto; 
    /* flex-grow: 1; 
    max-width: 100%; */ 
} 
} 

.transparent-style{
  color: transparent;
}

.disabled-day {
  cursor: not-allowed;
  opacity: 0.5;
}

  .page-title {
    display: inline-block;
    border-bottom: 4px solid black;
    margin-bottom: .5em;
  }
  .calendarComponent {
    flex-direction: column;
  }

  .timeslot-main {
    white-space: nowrap;
    text-align: center;
  }

  .td-time-slots {
      /* border-left: 1px solid #092935;
      border-bottom: 1px solid #092935; */
      background-color: rgb(130,154,164);
      border: 1px solid #ffffff;
      color: white;
    }
  .cal-margin {
    
  }

    @media (min-width: 992px) { 
    .title { 
      text-align: left; 
      font-weight: bold; 
    } 
    .col-sm { 
      width: auto; 
      padding: 0;
  }

  .block {
      display: flex;
			padding:5px;
      justify-content: center;
      color: white;
  }

  .select-executive {
      float: right;
	}
	
	.back-color {
		margin: 2px;
		background-color: #F0F0F0;
	}

  table {
    display: flex;

    tr {
      text-align: center;
    }

    td .slider {
      padding:20px 0px;
      
      width: 100%;
      height:100%;
    }
  }

  .justify-cal-content {
    display: flex;
    justify-content: flex-end;
  }

  .week-day {
    //background-color: #f6f6f6;
    background-color: #EBEBEB;
    border: 1px solid #ffffff;
    padding: 20px 0;
  }

  .unavailable {
    background-color: rgb(216,216,216);
    border-bottom: 1px solid #ffffff;
    padding: 20px 0;
    cursor: not-allowed;
  }

  .calenderCell {
    border-left: 3px solid #fff
  }

  .slider {
    cursor: pointer;
	}
	
	.left-icon {
		justify-content: flex-start;
    align-items: center;
    height: 100%;
  }
  
  .right-icon {
		justify-content: flex-end;
    align-items: center;
    height: 100%;
	}


  .time-slot {
    font-weight: bold;
    background-color: transparent;
	}
	
	.booking-content {
		display: block;
		text-align: center;
  }
  
  .booking-content-icons {
    display: block;
    text-align: center;
  }

	 .booking-modal { 
      position: fixed; 
      top: 50%; 
      left: 50%; 
      width: auto; 
      height: auto; 
      background-color: #f8f8f8; 
      border-radius: 15px; 
      padding: 2px 15px; 
    } 
  
  .external-space {
    border-radius: 3px;
    padding: 6px 12px;
    margin-bottom: 10px;
  }

	.booking-icons {
		padding: 2px 10px;
	}

  .icon-button {
    border: 0;
    outline: none;
    background-color: transparent;
    color: #81D1D0;
    font-size: 20px;
  }

  .cancel-button {
    color: #092935;
  }
  
  .month-label {
      background-color: #a489ac;
      color: #fff;
      padding: 10px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      padding-bottom: 40px;
  }

  .select-executive {
    background-color: #2CBBBF;
    color: white;
    border-radius: .25rem;
    margin-bottom: 5px;
    padding: 10px;
    cursor: pointer;
  }

  .day-label {
    background-color: rgb(130,154,164);
    justify-content: space-around;
    display: inherit;
  }

  img {
    height: 100%;
    width: 100%;
    max-width: 200px;
    max-height: 180px;;
  }

  .timeslot-data {
    display: none;
  }

  .current-day-dk {
    background-color: #f6f6f6;
    padding: 20px 0;
    //border: 1px solid #ffffff;
    border: 2px solid #EBEBEB
  }

  .meeting-headline {
    text-align: center;
    font-weight: bold;
  }
}
  @media (min-width: 992px){
    .imageContainer {
      display: flex;
      justify-content: flex-end;
      padding: 0;
    }

    .bckgd {
      background: #fff;
    }

    .selected-day {
      color: #ffffff;
    }
    

    .company-desc {
      font-size: small;
    }
    .company-info {
      padding: 0;
      max-width: 100%;

    }

    .company-name {
      display: flex;
      align-items: center;
      flex: 1;
    }
  }

  		
  .selected-day {
    background-color: #a489ac;
    color: #ffffff;
  }

  .hourGap {
    border-bottom: 3px solid white;
  }

  .navPrevWeek {
    position: absolute;
    left: 0.5em;
    height: 100%;
  }

  .navNextWeek {
    position: absolute;
    right: 0.5em;
    height: 100%;
  }

  @media (max-width: 992px){
    .box-align {
      display: inline;
      margin: 0 5px;
    }
    .borderStyle {
      border-bottom: 1px solid black;
    }
    table {
      display: flex;
  
      tr {
        text-align: center;
      }
  
      td .slider {
        padding:20px 0px;
        
        width: 100%;
        height:100%;
      }
    }
    .page-title {
      display: inline-block;
      border-bottom: 4px solid black;
      margin-bottom: .5em;
    }

    .current-day-dk {
      padding: 0px;
      margin: 10px 0px;
    }

    td.current-day-dk {
      margin: 10px 0px;
      border-collapse: separate;
      border-bottom: 1px solid #092935;
      border-spacing: 100px;
    }
    

    .td-time-slots {
      padding: 0;
      width: 100% !important;
      border-bottom: 1px solid #092935;
      border-left: none;
    }

    span.title.slider {
      padding: 0px;
    }

    span {
      padding: 0px;
    }

    .week-day {
      display: block;
    }
    
    img {
      height: 100%;
      width: 100%;
      max-width: 150px;
      max-height: 150px;
    }
    
    .title {
      text-align: center;
      font-weight: bold;
    }
		
		.left-icon, .right-icon {
      // display: none;
      width: 0px;
		}

		.month-label {
      background-color: #a489ac;
      color: #fff;
      padding: 10px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      padding-bottom: 30px;
      margin: 0;
		}

		.day-label {
      background-color: rgb(130,154,164);
      justify-content: space-between;
      display: inherit;
		}

		
		.time-slot {
			display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 0px 10px 0px 0px;
      white-space: nowrap;
		}

		table {
      display: flex;	
      text-align: center;		
			
			td span{
        padding: 0px;
				display: inline-block;
        background-color: transparent;
        width: 100%;
        height: 70px;
        padding: 3px 0px 5px 5px;
      }
      
      p {
        padding: 0px;
        margin: 0px;
      }
		}
		
		.select-executive {
      float: none;
      background-color: #2CBBBF;
	  }


    .timeslot-data-dk {
      display: none;
    }

    .timeslot-data {
      display: block;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .slider {
      /* border-bottom: 1px solid #D3D3D3; */
    }

    .booking-modal {
      left: 15%;
      border: 1px solid;
    }

    .booking-content {
      
    }

    .dropdown-btn {
      margin-bottom: 5px;
    }

    .date-attr {
      display: block;
      color: white;
    }

    .btn-pad {
      padding: 1px;
      margin: auto;
    }

    .imageContainer {
      display: flex;
      justify-content: flex-end;
      padding: 0;
    }

    .company-desc {
      font-size: small;
    }
    .company-info {
      padding: 0;
      max-width: 100%;

    }

    .company-name {
      display: flex;
      align-items: center;
      flex: 1;
    }
    
  }
  
  @media (min-width: 1023px) and (max-width: 1024px){
    table {
      display: flex;
      text-align: center;			
			
			td span{
				display: inline-block;
        background-color: transparent;
        width: 100%;
        height: 100px;
        
      }

      td .slider {
        padding: 0px;
      }

      .current-day-dk {
        padding: 0px;
      }

      .week-day {
        padding-left: 0px;
        padding-right: 0px;
      }

      .td-time-slots {
        padding: 0;
        border-left: 2px solid grey;
        border-bottom: 2px solid grey;
      }

      .time-slot {
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        background-color: transparent;
      }

      .timeslot-data-dk {
        justify-content: center;
        align-items: center;
        display: flex;
        border: 1px solid #ffffff;
      }
  }
} 
`