import React, { useEffect, useMemo, useState } from 'react';

/** Components */
import { Field, FieldArray, useFormikContext } from 'formik';
import TimePicker from 'rc-time-picker';
import styled from 'styled-components';
import FormGroup from '../Form/FormGroup';
import ReactSelect from 'react-select';
import Label from '../Form/Label';

/** Styles */
import 'rc-time-picker/assets/index.css';
import moment from 'moment';

const TimePickerField = ({ name, label, containerClassNames, labelClassNames, inputContainerClassNames }: any) => {
  const { values, errors, setValues }: any = useFormikContext();
  const [end_time_slot, setEnd_time_slot] = useState([]);
  const format = 'H:mm a';
  useEffect(() => {
    const intervalLabel = values?.pricingMaster?.interval?.label;
    const startTime = values[`start_${name}`];

    if (intervalLabel && startTime) {
      const sessionMinutes = parseSessionLengthToMinutes(intervalLabel);
      const startMoment = moment(startTime);
      const newEndTime = startMoment.clone().add(sessionMinutes, 'minutes');

      // 🟡 Generate dropdown end time options
      const generateEndTimes = (startMoment: moment.Moment, sessionMinutes: number) => {
        const options: { label: string; value: string }[] = [];
        let current = startMoment.clone().add(sessionMinutes, 'minutes');
        const endOfDay = moment('23:59', 'HH:mm');

        while (current.isSameOrBefore(endOfDay)) {
          options.push({
            label: current.format('h:mm A'),
            value: current.format('HH:mm'),
          });
          current = current.clone().add(sessionMinutes, 'minutes');
        }

        return options;
      };

      const timeOptions = generateEndTimes(startMoment, sessionMinutes);
      setEnd_time_slot(timeOptions); // 🟢 This sets the options for your ReactSelect

      // Set end time value
      setValues(
        {
          ...values,
          [`end_${name}`]: newEndTime,
        },
        true
      );
    }
  }, [values?.pricingMaster?.interval, values[`start_${name}`]]);

  // const changeTimeStart = (timeSelected: any) => {
  //   setValues(
  //     {
  //       ...values,
  //       [`start_${name}`]: timeSelected,
  //       // [`end_${name}`]: resultTimestampISO,
  //     },
  //     true
  //   );
  //   console.log('timeSelected', timeSelected);
  // };

  const parseSessionLengthToMinutes = (length: string): number => {
    const hrMinRegex = /(\d+)\s*hr(?:s)?\s*(\d+)?\s*m?/i;
    const minOnlyRegex = /(\d+)\s*m/i;

    if (hrMinRegex.test(length)) {
      const [, h, m] = length.match(hrMinRegex) || [];
      return parseInt(h || '0', 10) * 60 + parseInt(m || '0', 10);
    }

    if (minOnlyRegex.test(length)) {
      const [, m] = length.match(minOnlyRegex) || [];
      return parseInt(m || '0', 10);
    }

    return 0;
  };

  const changeTimeStart = (startMoment: moment.Moment) => {
    const sessionMinutes = parseSessionLengthToMinutes(values.sessionLength); // e.g., "1 hr 30 m"
    const endMoment = moment(startMoment).add(sessionMinutes, 'minutes');

    const latestEnd = moment('23:59', 'HH:mm');
    if (endMoment.isAfter(latestEnd)) {
      alert('Session exceeds the allowed time range.');
      return;
    }

    setValues(
      {
        ...values,
        [`start_${name}`]: startMoment,
        [`end_${name}`]: endMoment,
      },
      true
    );
  };

  // const changeTimeEnd = (timeSelected: any) => {
  //   const selectedStartTime = new Date(values.start_time);
  //   const selectedEndTime = new Date(values.end_time);

  //   setValues(
  //     {
  //       ...values,
  //       [`end_${name}`]: timeSelected,
  //     },
  //     true
  //   );
  // };
  return (
    <FormGroup addClassName={containerClassNames}>
      <Label addClassName={`${labelClassNames}`} labelFor={name}>
        {label}
      </Label>
      <div className={inputContainerClassNames}>
        <TimePicker
          showSecond={false}
          value={values[`start_${name}`]}
          className="time-select-input"
          onChange={changeTimeStart}
          format={format}
          use12Hours
          inputReadOnly
          id="timePiker"
        />
        <span>-</span>
        {/* <TimePicker
          showSecond={false}
          value={values[`end_${name}`]}
          className={`time-select-input`}
          onChange={changeTimeEnd}
          format={format}
          use12Hours
          disabled
          inputReadOnly
        /> */}
        <StyledReactSelect
          className="time-select-input"
          options={end_time_slot}
          value={end_time_slot.find((opt) => opt.value === moment(values[`end_${name}`]).format('HH:mm'))}
          onChange={(selected) => {
            const selectedMoment = moment(selected.value, 'HH:mm');
            setValues(
              {
                ...values,
                [`end_${name}`]: selectedMoment,
              },
              true
            );
          }}
          getOptionLabel={(e: any) => moment(e.value, 'HH:mm').format('h:mm A')}
          getOptionValue={(e: any) => e.value}
          menuPlacement="auto"
          maxMenuHeight={150}
          menuPortalTarget={document.body}
          // position="absolute"
          styles={{
            menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
          }}
        />
      </div>
      {(errors[`start_${name}`] || errors[`end_${name}`]) && (
        <div className="col-12 d-block invalid-feedback">{errors[`start_${name}`] || errors[`end_${name}`]}</div>
      )}
    </FormGroup>
  );
};

const StyledReactSelect = styled(ReactSelect)`
  &.red-b {
    > div:first-child {
      border: 1px solid red;
    }
  }
  &.campaign-select > div:first-of-type {
    box-shadow: 0 2px 4px 0 rgba(184, 184, 184, 0.5);
    width: 100%;
    height: 70%;
  }
`;

export default TimePickerField;
