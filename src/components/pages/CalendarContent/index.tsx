import React from 'react';

/** Hooks */
import { useEffect } from 'react';
import { useData } from './hooks/useData';

/** Components */
import CalendarView from './components/CalendarView';

/** Utils */
import moment from 'moment';
import { bindActionCreators, compose } from 'redux';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';

/** Store */
import { setCurrentPage } from '../../../store/ui/action';
import { showModal } from '../../../store/modal/action';

/** Types */
import { Props } from './types';
import { AppState } from '../../../store/root';
import { Dispatch } from 'redux';
import { ShowModal } from '../../../store/modal/types';

const CalendarContent: React.FC<Props> = ({ theme, ui, client }) => {
  const { pricingDetail } = useData(client);
  
  useEffect(() => {
    console.log(pricingDetail)
  }, [pricingDetail])

  return (
    <>
      <div>

      </div>
      <div>
        <CalendarView
          events={[]}
          onDateClick={(datevalue: any) => {
            
          }}
          onEventClick={(value: any) => {
            alert(0)
          }}
        />
      </div>
    </>
  )
}

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  ui: state.ui,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      setCurrentPage,
      showModal,
    },
    dispatch
  );
};

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(CalendarContent);
