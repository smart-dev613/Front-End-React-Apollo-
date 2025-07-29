import React, { Component } from 'react';
import styled from 'styled-components';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';

interface DatePickerProps {
  size?: any;
  inForm?: boolean;
  startDate?: string;
  endDate?: string;
  maxDate?: string;
  minDate?: string;
  drops?: 'down' | 'up';
  addClassName?: string;
  noTime?: boolean;
  increment?: number;
  onDateApply?: (e: Event, picker: daterangepicker) => void;
  dateMessage: string;
  fieldError?: boolean;
  noPaddingLeft?: boolean;
  singleDatePicker?: boolean;
  disabled?: boolean;
}

class DatePicker extends Component<DatePickerProps> {
  constructor(props: any) {
    super(props);
    this.state = ({
      minDate: new Date(),
      masDate: new Date()
    })
  }

  public render() {

    return (
      <StyledDatePicker
        className={
          ' input-select ' +
          'col-sm-' +
          this.props.size +
          ' ' +
          (this.props.inForm ? 'in-form ' : '') +
          (this.props.noPaddingLeft ? 'pl-0' : '' + ' ' + (this.props.addClassName || ''))
        }
      >
        {this.props.startDate && this.props.endDate && this.props.minDate && this.props.maxDate ? (
          <DateRangePicker
            key={`${this.props.startDate}-${this.props.endDate}-${this.props.minDate}-${this.props.maxDate}`}
            drops={this.props.drops ? this.props.drops : 'down'}
            minDate={this.props.minDate && moment(this.props.minDate)}
            maxDate={this.props.maxDate && moment(this.props.maxDate)}
            timePicker={false}
            onApply={this.props.onDateApply}
            startDate={this.props.startDate ? new Date(this.props.startDate) : ''}
            endDate={this.props.endDate ? new Date(this.props.endDate) : ''}
            locale={{
              format: 'DD/MM/YYYY',
            }}
          >
            <button
              type="button"
              disabled={this.props.disabled}
              className={`form-control date-picker select-input ${!this.props.inForm ? 'depth-shadow' : ''} ${
                this.props.fieldError ? 'red-b' : ''
              } ${this.props.disabled ? 'disabled_color' : ''}`}
            >
              {this.props.dateMessage}
            </button>
          </DateRangePicker>
        ) : (
          <DateRangePicker
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
            drops={this.props.drops ? this.props.drops : 'down'}
            timePicker={false}
            onApply={this.props.onDateApply}
            singleDatePicker={this.props.singleDatePicker}
            locale={{
              format: 'DD/MM/YYYY',
            }}
          >
            <button
              type="button"
              disabled={this.props.disabled}
              className={`form-control select-input date-picker ${!this.props.inForm ? 'depth-shadow' : ''} ${
                this.props.fieldError ? 'red-b' : ''
              } ${this.props.disabled ? 'disabled_color' : ''} `}
            >
              {this.props.dateMessage}
            </button>
          </DateRangePicker>
        )}
      </StyledDatePicker>
    );
  }
}

const StyledDatePicker = styled.div`
  &.in-form {
    padding-left: 0px;
    padding-right: 0px;

    div.react-bootstrap-daterangepicker-container {
      width: 100%;
      margin: auto;

      button.date-picker {
        padding-left: 10px;
        padding-right: 10px;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      button.red-b {
        border: 1px solid red;
      }
    }
  }

  button.date-picker {
    background-color: #fff;
  }
`;

export default DatePicker;
