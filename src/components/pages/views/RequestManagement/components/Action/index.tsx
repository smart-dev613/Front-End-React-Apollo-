import React, { useCallback } from 'react';

/** Components */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

/** Request */
import { eventInvitationUpdate } from '../../../../../../providers/user';

/** Types */
import { Props } from './types';

const Action: React.FC<Props> = ({ record, setRefetch }: Props) => {

  const accept = useCallback(async () => {
    try {
      await eventInvitationUpdate(record.id, 'ACCEPTED', record.platformEventPricingSlot.id)
      setRefetch(true)
    } catch (error) {
      console.log(error)
    }
  }, [record, setRefetch])

  const decline = useCallback(async () => {
    try {
      await eventInvitationUpdate(record.id, 'DECLINED', record.platformEventPricingSlot.id)
      setRefetch(true)
    } catch (error) {
      console.log(error)
    }
  }, [record, setRefetch])

  if (record.table_status !== 'AWAITING') {
      return (
      <span>{record.table_status === "ARCHIVED" ? "REJECTED": record.table_status}</span>
    )
  }

  return (
    // <div>
    //   <a
    //     href='#'
    //     onClick={() => accept()}
    //   >
    //     <FontAwesomeIcon icon={faCheckSquare} size={"lg"} />
    //   </a><a
    //     href='#'
    //     onClick={() => decline()}
    //     style={{ margin: '0 10px',borderRadius: "25%", backgroundColor: 'red', padding:'0px 4px', textAlign: 'center', color:'white'}}
    //   >
    //     <FontAwesomeIcon icon={faTimes} size={"sm"} />
    //   </a>
    // </div>
    <div>
      <button type="button" style={{width: "25px", height:'25px', position:'absolute'}} className="p-2 btn btn-purple" onClick={() => accept()}>  
        <FontAwesomeIcon icon={faCheck} size={"lg"} style={{position:'relative', color: 'white', top:"50%", left:'50%', transform:'translate(-50%,-50%)'}}/>
      </button>
      <button type="button" style={{ position:'relative', left:'35px', backgroundColor: 'red', color:"white", width: "25px", height:'25px'}} className="p-2 btn" onClick={() => decline()}>
        <FontAwesomeIcon style={{position:'relative', color: 'white', top:"50%", left:'50%', transform:'translate(-50%,-50%)'}} icon={faTimes} size={"lg"} />
      </button>
    </div>
  )
}

export default Action;
