import React, { useMemo, useEffect, useState } from 'react';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';
import { useData } from './hooks/useData';
import { useRouterQuery } from '../../_hooks/useRouterQuery';

/** Components */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Container, HeaderWrapper } from './components/general';
import SearchComponent from '../../SearchComponent';
import ListFormat from '../../ListFormat';
import ListFormatPricing from '../../ListFormatPricing';

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
import { getPlatformEventMembers } from '../../../../providers/events';

const Contents: React.FC<Props> = (props: Props) => {
  const [platformEventMembers, setPlatformEventMembers] = useState([]);

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

  const [queries] = useRouterQuery();

  const title = useMemo(() => {
    if (queries.type) {
      const menu = (menus || []).find(
        (item: any) => item.type === PlatformEventMenuPage.CONTENT_CUSTOM && item.parameter === `type=${queries.type}`
      );
      return menu ? menu.label : 'Contents';
    } else {
      const menu = (menus || []).find((item: any) => item.type === PlatformEventMenuPage.CONTENT);
      return menu ? menu.label : 'Contents';
    }
  }, [menus, queries.type]);

  const isAdmin = useMemo(() => {
    if (queries.type) {
      const menu = (menus || []).find(
        (item: any) => item.type === PlatformEventMenuPage.CONTENT_CUSTOM && item.parameter === `type=${queries.type}`
      );
      return menu && (menu.userAdmin || []).map((uv: any) => uv.id).includes(user.userData.id);
    } else {
      return false;
    }
  }, [menus, queries.type, user]);

  const { data: contents, setRefetch } = useData(eventId);

  const [filter, setFilter] = useState('');

  const isOrganiser = userIsOrganiser(user, organiser);

  const filteredContents = useMemo(() => {
    const lowercasedFilter = filter.toLowerCase();
    return (contents || []).filter((item) => {
      let keywordMatch: string[] = [];
      if (item.keywords) {
        keywordMatch = item.keywords.filter((keyword: any) => {
          if (keyword.toLowerCase().includes(lowercasedFilter)) {
            return keyword;
          }
        });
      }

      if (item.name.toLowerCase().includes(lowercasedFilter) || keywordMatch.length > 0) {
        return item;
      }
    });
  }, [filter, contents]);

  const truncateText = (str: string) => {
    return str.length > 140 ? str.substring(0, 140) + ' ...' : str;
  };

  const openModal = (params = {}) => {
    showModal('NEW_CONTENT_ITEM', 'lg', null, null, params);
  };

  useEffect(() => {
    setCurrentPage('Contents');
  }, []);

  useEffect(() => {
    getPlatformEventMembers(eventId).then((response: any) => {
      setPlatformEventMembers(response?.data?.getPlatformEventMembers);
    });
  }, []);

  return (
    <Container ui={ui} theme={theme} className="container-fluid page-container py-4">
      <HeaderWrapper>
        <h3>{title}</h3>
        <div className="extra">
          {(isOrganiser || isAdmin) && (
            <button
              className="btn-edit btn-purple btn"
              onClick={() =>
                openModal({
                  props: {
                    loadEvents: () => setRefetch(true),
                    organiser: organiser,
                  },
                })
              }
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          )}
        </div>
      </HeaderWrapper>
      {ui.showSearch && (
        <SearchComponent
          filter={filter}
          click={(e: any) => setFilter(e.target.value)}
          placeholder="Event name, keyword..."
        />
      )}
      {!isUserSelected &&
        filteredContents
          .filter((content) => {
            if (isOrganiser || isAdmin) {
              return true;
            } else {
              return content?.contentStatus !== 'ARCHIVED';
            }
          })
          .sort((a: { createdAt?: string }, b: { createdAt?: string }) => {
            const dateA = a?.createdAt ? new Date(a.createdAt) : null;
            const dateB = b?.createdAt ? new Date(b.createdAt) : null;

            return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
          })
          .sort((a, b) => {
            const statusA = a.contentStatus || ''; // If contentStatus is null, treat it as an empty string
            const statusB = b.contentStatus || '';

            if (statusA === 'ARCHIVED' && statusB !== 'ARCHIVED') {
              return 1;
            } else if (statusA !== 'ARCHIVED' && statusB === 'ARCHIVED') {
              return -1;
            } else {
              return 0;
            }
          })
          .map((list: any) => {
            return (
              <>
                <ListFormatPricing
                  titleStyle={{ cursor: 'pointer' }}
                  type="content"
                  key={list.id}
                  platformEventMembers={platformEventMembers}
                  ListData={list}
                  truncateText={truncateText}
                  loadEvents={() => setRefetch(true)}
                />
              </>
            );
          })}
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

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(Contents);
