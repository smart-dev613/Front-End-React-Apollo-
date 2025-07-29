import React, { useMemo, useEffect, useState } from 'react';
import styled from 'styled-components';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';
import { useData } from '../Companies/hooks/useData';

/** Components */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Container, HeaderWrapper } from './components/general';
import SearchComponent from '../../SearchComponent';
import ListFormat from '../../ListFormat';

/** Utils */
import { bindActionCreators, Dispatch, compose } from 'redux';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { GET_EVENT_INFO } from '../../../../gql/queries';
import { userIsOrganiser } from '../../../../util/common';

/** Store */
import { showModal } from '../../../../store/modal/action';
import { setCurrentPage, setIsEditPage } from '../../../../store/ui/action';

/** Types */
import { Props } from './types';
import { AppState } from '../../../../store/root';
import { PlatformEventMenuPage } from '../../../../constants/menu';

const Companies: React.FC<Props> = (props: Props) => {
  const { ui, user, setCurrentPage, showModal } = props;
  const { companyData, isUserSelected } = user;
  const {
    data: {
      theme,
      slug,
      eventType,
      organiser,
      eventId,
      menus,
      event: { company_preferences },
    },
  }: any = useQuery(GET_EVENT_INFO);

  const title = useMemo(() => {
    const menu = (menus || []).find((item: any) => item.type === PlatformEventMenuPage.COMPANIES);
    return menu ? menu.label : 'Companies';
  }, [menus]);

  const { data: attendeesData } = useData(eventId, isUserSelected);

  let companies = [];

  let currentCompanyIsAvailable = companies.findIndex((tempCompany) => tempCompany.id == companyData.id);

  if (currentCompanyIsAvailable == -1 && companyData.id) {
    companies.unshift(companyData);
  }

  const [filter, setFilter] = useState('');
  const [personalProfile, setPersonalProfile] = useState(false);

  const isOrganiser = userIsOrganiser(user, organiser);

  const [filteredCompaniesList, setFilteredCompaniesList] = useState([]);

  // if(window.sessionStorage.getItem(`isPersonelProfile-${props.user.userData.id}`) === 'yes'){
  //   filteredCompanies = [];
  // }

  const truncateText = (str: string) => {
    return str.length > 140 ? str.substring(0, 140) + ' ...' : str;
  };

  const openModal = (params = {}) => {
    showModal('COMPANY_PREFERENCE', 'sm', null, null, params);
  };
  const isPersonalProfile = window.sessionStorage.getItem(`isPersonelProfile-${props.user.userData.id}`);

  useEffect(() => {
    const key = `isPersonelProfile-${props.user.userData.id}`;
    const stored = window.sessionStorage.getItem(key);
    setPersonalProfile(stored === 'yes');

    const channel = new BroadcastChannel('profile_mode_channel');
    channel.onmessage = (event) => {
      if (event.data?.type === 'profileModeChanged') {
        const updated = window.sessionStorage.getItem(key);
        setPersonalProfile(updated === 'yes');
      }
    };

    return () => {
      channel.close();
    };
  }, [props.user.userData.id]);
  
  useEffect(() => {
    if (attendeesData?.length) {
      const uniqueCompanyIds: Record<string, boolean> = {};
      const newFilteredCompanies = attendeesData
        .filter((attendee) => attendee?.profile?.company && attendee.profile.company.id)
        .map((attendee) => {
          const company = attendee.profile.company;
          if (!uniqueCompanyIds[company.id]) {
            uniqueCompanyIds[company.id] = true;
            return company;
          }
          return null;
        })
        .filter(Boolean) as any[];

      setFilteredCompaniesList(newFilteredCompanies);
    }
  }, [attendeesData, isUserSelected]);

  useEffect(() => {
    setCurrentPage('Companies');
  }, [setCurrentPage]);

  console.log('filteredCompaniesListfilteredCompaniesList', filteredCompaniesList);

  return (
    <>
      <div className="container-fluid page-container py-4">
        <HeaderWrapper>
          <h3>{title}</h3>
          <div className="extra">
            {isOrganiser && (
              <button className="btn-edit btn-purple btn" onClick={() => openModal()}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </button>
            )}
          </div>
        </HeaderWrapper>

        {ui.showSearch && (
          <SearchComponent
            filter={filter}
            click={(e: any) => setFilter(e.target.value)}
            placeholder="Company name, keyword..."
          />
        )}

        {filteredCompaniesList.map((list: any) => (
          <ListFormat
            type="company"
            key={list?.id + Date.now()}
            ListData={list}
            truncateText={truncateText}
            company_preferences={company_preferences}
          />
        ))}
      </div>
    </>
  );
};

const mapStateToProps = function (state: AppState) {
  return {
    ui: state.ui,
    user: state.user,
  };
};

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      showModal,
      setCurrentPage,
      setIsEditPage,
    },
    dispatch
  );
};

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(Companies);
