import React, { useMemo, useEffect, useState } from 'react';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';
import { useData } from './hooks/useData';

/** Components */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Container, HeaderWrapper } from './components/general';
import SearchComponent from '../../SearchComponent';
import ListFormatAttendees from '../../ListFormatAttendees';

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
import { List } from 'antd';

const Attendees: React.FC<Props> = (props: Props) => {
  const {
    ui,
    user,
    user: { isUserSelected },
    setCurrentPage,
    showModal,
  } = props;
  const {
    data: { theme, slug, eventType, organiser, eventId, menus },
  }: any = useQuery(GET_EVENT_INFO);

  const title = useMemo(() => {
    const menu = (menus || []).find((item: any) => item.type === PlatformEventMenuPage.ATTENDEES);
    return menu ? menu.label : 'Attendees';
  }, [menus]);

  let { data: attendees } = useData(eventId, ui);

  // let attendees = [{
  //   name: user.userData.firstName+" "+user.userData.lastName,
  //   email: user.userData.email,
  //   company: user.userData.company.name,
  //   avatar: "",
  //   eventType: "",
  //   id: "",
  //   invitationStatus: "",
  //   invitee: {
  //     avatar: user.userData.selectedCompanyMembership.avatar,
  //     user: {
  //       firstName : user.userData.firstName,
  //       lastName : user.userData.lastName
  //     },
  //     profiles: user.userData.selectedCompanyMembership.profiles,
  //   }
  // }]
  const [filter, setFilter] = useState('');

  const isOrganiser = userIsOrganiser(user, organiser);

  const filteredCompanies = useMemo(() => {
    const lowercasedFilter = filter.toLowerCase();
    let userCompanyData = {};

    if (isUserSelected) {
      userCompanyData = {
        companyId: user.userData?.company?.id,
        userId: user.userData.id,
        avatar: user.userData.avatar,
        name: [user.userData.firstName, user.userData.lastName].filter((item: any) => item).join(' '),
        company: user?.userData?.company.name,
        email: user.userData.email,
        status: '',
        profiles: user.userData.profiles,
        keywords: [''],
      };
    } else {
      userCompanyData = {
        companyId: user.userData?.company?.id,
        userId: user.userData.id,
        avatar: user.userData.selectedCompanyMembership?.avatar,
        name: [user.userData.firstName, user.userData.lastName].filter((item: any) => item).join(' '),
        company: user.userData?.selectedCompanyMembership?.company,
        email: user.userData.selectedCompanyMembership?.email,
        status: '',
        profiles: user.userData.selectedCompanyMembership?.profiles,
        keywords: [''],
      };

      // this.setState({ currentCompany: { name: this.props.userCompany.name, id: this.props.userCompany.id, _id: this.props.userCompany._id } })
    }

    const attendeesUser = (attendees || [])
      .filter((item: any) => {
        if (
          item.name?.toLowerCase().includes(lowercasedFilter) ||
          item.company?.toLowerCase().includes(lowercasedFilter) ||
          item.email?.toLowerCase().includes(lowercasedFilter) ||
          item.keywords
            ?.map((v: any) => v.toLowerCase())
            .toString()
            .includes(lowercasedFilter)
        ) {
          return item;
        }
      })
      .filter((item: any) => item.user.id !== user.userData.id);

    return [userCompanyData, ...attendeesUser];
  }, [filter, attendees, isUserSelected, user.userData]);

  const truncateText = (str: string) => {
    return str.length > 140 ? str.substring(0, 140) + ' ...' : str;
  };

  const openModal = (params = {}) => {
    showModal('ATTENDEE_PREFERENCE', 'sm', null, null, params);
  };

  useEffect(() => {
    setCurrentPage('Attendees');
  }, []);

  console.log('The List: ', filteredCompanies);
  console.log('Attendees: ', attendees);
  console.log('user: ', user);

  return (
    <Container ui={ui} theme={theme} className="container-fluid page-container py-4">
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
          placeholder="Name, company, email, keyword..."
        />
      )}
      {filteredCompanies.map((list: any) => (
        <ListFormatAttendees key={list?.id + Date.now()} ListData={list} truncateText={truncateText} />
      ))}
    </Container>
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

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(Attendees);
