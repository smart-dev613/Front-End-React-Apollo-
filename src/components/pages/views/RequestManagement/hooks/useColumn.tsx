import React from 'react';

/** Components */
import Action from '../components/Action';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faTimes } from '@fortawesome/free-solid-svg-icons';

/** Constants */
import { columns } from '../columns';

export const useColumn = (setRefetchCalendar: any) => {
  return [
    ...columns
  ]
}
