import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from 'react-i18next';
const icons = require.context('../assets/images');
const iconsArr = [
  'ticketA',
  'adminB',
  'agendaB',
  'calB',
  'companyB',
  'notesB',
  'qrB',
  'adminsB',
  'agendasB',
  'attendeesB',
  'companyBagB',
  'languagesB',
  'setupB',
  'spacesB',
  'pricingB',
  'timezoneB',
  'leaf',
  'employeesB',
  'cluster-managementB',
  'request-managementB',
  'transactionsB',
];

interface NavTileProps {
  target: any;
}

interface ParentProps {
  icon?: any; // @@TODO - fix this to work with FontAwesome types
  white?: boolean;
  fontAwesome?: boolean;
  image?: string;
  externalLink?: boolean;
  comingSoon?: boolean;
  addmargin?: boolean;
  addClassName?: string;
  theme?: any;
}

type Props = NavTileProps & ParentProps;

export class NavTile extends Component<Props, {}> {
  public constructor(props: Props) {
    super(props);

    this.showIcon = this.showIcon.bind(this);
  }

  public showIcon(): any {
    
    // @@TODO - fix this any type
    let icon = this.props.icon;
    let color = this.props.white ? 'W' : 'B';
    let image = this.props.image;

    if (this.props.fontAwesome) {

      return <FontAwesomeIcon icon={icon.toLowerCase()} size="4x" className="icon" />;

    } else if (image) {

      let imgSrc = icons(`./icons/${image}.png`);
      return <img src={imgSrc} alt={`${icon} icon`} className="icon" />;

    } else {

      if (!iconsArr.includes(icon + color)) return; // @TODO - better way to include images and check if they exist on directory?

      let imgSrc = icons(`./icons/${icon + color}.png`);
      return (
        <img
          src={imgSrc}
          style={{
            maxWidth: this.props.addmargin ? '100px' : 'auto',
          }}
          alt={`${icon} icon`}
          className="icon"
        />
      );
    }
  }

  public render() {
    const { comingSoon } = this.props;
    // console.log('comingSoon', this.props)
    const additionalClasses = this.props.addClassName ? this.props.addClassName : '';

    return (
      <StyledNavTile
        autoWidth={this.props.addmargin}
        className={`margin-btm col-sm${additionalClasses}`}
        theme={this.props.theme}
      >
        {comingSoon ? (
          <div className="box coming-soon position-relative">
            <span className="soon-text">
              <Trans i18nKey="SoonText">trans</Trans>
            </span>
            <div className="icon-wrapper">
              {this.showIcon()}
              <StyledP className="mb-0" fontAwesome={this.props.fontAwesome ? true : false}>
                {this.props.children}
              </StyledP>
            </div>
          </div>
        ) : this.props.externalLink ? (
          <a className="box" href={this.props.target} target="_blank" rel="noopener noreferrer">
            <div className="icon-wrapper">
              {this.showIcon()}
              <StyledP className="mb-0" fontAwesome={this.props.fontAwesome ? true : false}>
                {this.props.children}
              </StyledP>
            </div>
          </a>
        ) : (
          <Link className="box" to={this.props.target}>
            <div className="icon-wrapper">
              {this.showIcon()}
              <StyledP className="mb-0" fontAwesome={this.props.fontAwesome}>
                {this.props.children}
              </StyledP>
            </div>
          </Link>
        )}
      </StyledNavTile>
    );
  }
}

interface TitleProps {
  autoWidth?: boolean;
}

const StyledNavTile = styled.div<TitleProps>`
  padding: 0 7.5px 8px 7.5px;
  /* height: 120px !important; */
  min-width: 34%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* margin-bottom: 15px; */
  flex-grow: 1;
  width: 100%;
  height: 100%;

  .coming-soon {
    color: #757575;
    transition: all 0.3s ease-in;
  }

  .coming-soon:hover {
    color: #292929;
    text-decoration: none;
  }

  .soon-text {
    display: flex;
    opacity: 0;
    position: absolute;
    background-color: grey;
    color: #fff;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    transition: opacity 0.1s ease-in;
    z-index: 1;
    border-radius: 4px;
  }
  &:nth-child(odd) {
      padding-left: 0px;
      padding-right: 7.5px;
    }
    &:nth-child(even) {
      padding-left: 7.5px;
      padding-right: 0px;
    }
  @media only screen and (max-width: 768px) {
    flex-direction: row;
    position: relative;
    width: 100%;
    flex: 0 0 50%;
    &:nth-child(odd) {
      padding-left: 0px;
      padding-right: 7.5px;
    }
    &:nth-child(even) {
      padding-left: 7.5px;
      padding-right: 0px;
    }
  }

  .box {
    display: flex;
    flex-direction: column;
    /* background: #e2d4e5; */
    background-color: ${(props) => (props.theme && props.theme.primaryColour ? props.theme.primaryColour : '#e2d4e5')};
    border-radius: 4px;
    box-shadow: 1px 2px 5px 0px rgba(0, 0, 0, 0.2);
    /* border: 1px solid rgba(0,0,0,.125); */
    transition: all 0.3s ease;
    align-self: center;
    width: 120px;
    height: 120px;
    min-height: 100px;
    min-width: 100px;
    /* color: #757575; */
    color: #ffffff;

    .icon-wrapper {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      img {
        max-height: 80px;
        max-width: 80px;
        transition: all 0.3s ease;
        opacity: 0.8;
      }
    }
  }
  .box:hover {
    background: #ffdfff;
    color: #092935;
    box-shadow: 1px 2px 5px 0px rgba(0, 0, 0, 0.4);

    img {
      opacity: 1;
    }

    span.soon-text {
      opacity: 1;
    }
  }
`;

const StyledP = styled.p<{ fontAwesome: boolean }>`
  font-size: 0.8rem;
  // margin-top: ${(props) => (!props.fontAwesome ? '-0.5em' : '0')};
  text-align: center;
  text-transform: capitalize;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 100px;
  min-height: 20px;
`;

export default NavTile;
