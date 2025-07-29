import React, { useMemo, useEffect, useState } from 'react';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';

/** Components */
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StyledNavigation, SidebarMobileWrapper } from './components/general';
import SidebarLink from "../../../SidebarLink";
import {
  
  ColorPickerField,
  
} from '../../../FormikItem';
/** Utils */
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withApollo } from 'react-apollo';
import { GET_EVENT_INFO } from '../../../../gql/queries';
import { userIsOrganiser } from '../../../../util/common';

/** Types */
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Props } from './types';
import { AppState } from "../../../../store/root";

/** Constants */
import { PAGE_MAPPING } from '../../../../constants/menu';
import { PlatformEventMenuPage, DEFAULT_MENUS_ORDER, MENUS_DATA } from './constants';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Sidebar: React.FC<Props> = (props: Props) => {
  const { ui, currentPage, user } = props;
  const { data: { theme, slug, menus, eventName, menusOrder, eventType, organiser, event: { name_check } } }: any = useQuery(GET_EVENT_INFO);
  const [moreServices, setMoreServices] = useState([]);
  const [showMoreServices, setshowMoreServices] = useState(false)

  const menusDict = useMemo(() => {
    // @ts-ignore
    const selectedMenus = menus && menus.length ? menus : PAGE_MAPPING[eventType];


    return (selectedMenus || []).reduce((acc: any, curr: any) => {

      acc[curr.type] = curr;

      return acc;

    }, {});

    

  }, [menus, eventType]);

  useEffect(()=> {

    const moreServices = menus.filter((item: any) => item.type === PlatformEventMenuPage.CONTENT_CUSTOM);

    setMoreServices(moreServices)
  

  }, [menus])

  const isOrganiser = userIsOrganiser(user, organiser)

  return (
    <>
      <StyledNavigation className="sb" theme={theme} slug={slug}>
        {/* {
          (name_check) && (
            <div className="navbar-text">
              <h3>{eventName}</h3>
            </div>
          )
        } */}
        <div id="wrapper">
          <div id="sidebar-wrapper">
            <aside id="sidebar">
              <ul id="sidemenu" className="sidebar-nav">

                {(menusOrder && menusOrder.length ? menusOrder : DEFAULT_MENUS_ORDER).map(
                  (item: PlatformEventMenuPage) => {
                    // return menusDict[item].adminOnly && (

                    return (
                      ((!ui.isViewMode && isOrganiser) || menusDict[item]?.show) && (
                        <SidebarLink
                          name={(menusDict[item] || {}).label}
                          icon={MENUS_DATA[item].icon as IconProp}
                          pageKey={(menusDict[item] || {}).type}
                          target={`/${slug}${MENUS_DATA[item].link}`}
                        />
                      )
                    );
                  }
                )}

                {menus
                  .filter((item: any) => item.type === PlatformEventMenuPage.ADMIN)
                  .map((item: any) => {
                    // return menusDict[item].adminOnly && (

                    return (
                      ((!ui.isViewMode && isOrganiser) || (item?.show && (item.userVisible || []).map((uv: any) => uv.id).includes(user.userData.id))) && (
                        <SidebarLink
                          name={item.label}
                          icon={MENUS_DATA[PlatformEventMenuPage.CONTENT].icon as IconProp}
                          pageKey={item.label}
                          target={`/${slug}${item.link}`}
                        />
                      )
                    );
                  })}

                {menus
                  .filter((item: any) => item.type === PlatformEventMenuPage.CONTENT_CUSTOM)
                  .map((item: any) => {
                    // return menusDict[item].adminOnly && (

                    return (
                      ((!ui.isViewMode && isOrganiser) || (item?.show && (item.userVisible || []).map((uv: any) => uv.id).includes(user.userData.id))) && (
                        <SidebarLink
                          name={item.label}
                          icon={MENUS_DATA[PlatformEventMenuPage.CONTENT].icon as IconProp}
                          pageKey={item.label}
                          target={`/${slug}${MENUS_DATA[PlatformEventMenuPage.CONTENT].link}?${item.parameter}`}
                        />
                      )
                    );
                  })}
              </ul>
            </aside>
          </div>
        </div>
      </StyledNavigation>

      <SidebarMobileWrapper
        theme={theme}
        ui={ui}
        className="navbar navbar-expand-sm navbar-light fixed-top navbar-style borders-style mobile-sidebar"
      >
        {(menusOrder && menusOrder.length ? menusOrder : DEFAULT_MENUS_ORDER).map(
          (item: PlatformEventMenuPage, index: any) => {
            // return menusDict[item].adminOnly && (
            return (
              ((!ui.isViewMode && isOrganiser) || menusDict[item]?.show) && (
                <Link
                  to={`/${slug}${MENUS_DATA[item].link}`}
                  className={
                    `mobile-sidebar-link-${index}` + (currentPage || '').toLowerCase() ===
                    ((menusDict[item] || {}).type || '').toLowerCase()
                      ? 'active'
                      : ''
                  }
                >
                  <FontAwesomeIcon icon={MENUS_DATA[item].icon as IconProp} />
                </Link>
              )
            );
          }
        )}

        {moreServices ? (
          <div className='more-services'>
            <FontAwesomeIcon
              onClick={() => setshowMoreServices((prevCheck) => !prevCheck)}
              className={`sidebarIcon-plus ${showMoreServices ? 'sidebarIcon-plus-x' : ''}`}
              icon={faPlus}
            />
            {
              showMoreServices ? <ul className='more-services-link'>{moreServices.map(service => {
                return (
                  <li style={{
                    paddingBottom: "3px",
                    paddingTop: "4px"
                  }}>
                    <Link  style={{
                    fontSize: "14px"
                  }} to={`/${slug}${MENUS_DATA[PlatformEventMenuPage.CONTENT].link}?${service.parameter}`}>
                      {service.label}
                    </Link>
                  </li>
                );
              })}</ul> : ''
            }
          </div>
        ) : (
          ''
        )}
      </SidebarMobileWrapper>
    </>
  );
}

const mapStateToProps = (state: AppState) => ({
  ui: state.ui,
  user: state.user,
  currentPage: state.ui.page
});

export default compose(withApollo, connect(mapStateToProps))(Sidebar);
