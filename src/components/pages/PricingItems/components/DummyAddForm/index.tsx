import React, { useState } from 'react';

/** Utils */
import moment from 'moment';

/** Request */
import { createPlatformEventContentPricing } from '../../../../../providers/pricing';

interface Props {
  employees: any[];
  contents: any[];
  eventId: string;
}

const DummyAddForm: React.FC<Props> = ({ employees, contents, eventId }) => {
  const [values, setValues] = useState<any>({
    contentId: '',
    price: 0,
    currency: 'GBP',
    employee: [],
    duration: 30
  })

  const set = (name: string) => {
    return ({ target: { value } }: any) => {
      setValues((oldValues: any) => ({...oldValues, [name]: value }));
    }
  };

  const setMultiple = (name: string) => {
    return ({ target: { selectedOptions } }: any) => {
      setValues((oldValues: any) => ({...oldValues, [name]: Array.from(selectedOptions, (option: any) => option.value) }));
    }
  };

  const onSubmit = async (event: any) => {
    event.preventDefault();
    try {
      await createPlatformEventContentPricing({
        ...values,
        price: +values.price,
        eventId
      });
      setValues({
        contentId: '',
        price: 0,
        currency: 'GBP',
        employee: [],
        duration: 30
      });
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <label>Content*:</label>
      <select value={values.contentId} onChange={set('contentId')}>
        <option value="">Select color</option>
        {
          contents.map((item: any) => (
            <option value={item.id}>{item.name}</option>
          ))
        }
      </select>

      <label>Employee*:</label>
      <select value={values.employee} onChange={setMultiple('employee')}>
        <option value="">Select color</option>
        {
          employees?.map((item: any) => (
            <option value={item.id}>{item.email}</option>
          ))
        }
      </select>

      <label>Price*:</label>
      <input type="number" value={values.price} onChange={set('price')} />

      <button className="btn" type="submit">Submit</button>
    </form>
  )
}

export default DummyAddForm
