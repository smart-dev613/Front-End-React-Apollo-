import React, { Component } from 'react';
import styled from 'styled-components';
import KeywordList from './KeywordList';
import { showModal } from '../../store/modal/action';
import { ShowModal } from '../../store/modal/types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { AppState } from '../../store/root';
// import DeailsModal from '../components/Modal/NotesModal'
import companyLogo from '../../assets/images/icons/company_placeholder.jpg';
import whitepaper from '../../assets/images/whitepaper.png';
import './ListStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { DirectiveLocation } from 'graphql';

interface ListFormatProps {
  ListData: any;
  ui: any;
  type?: any;
  titleStyle?: any;
  platformEventMembers?: any;
  company_preferences?: string[];
  truncateText?: (arg0: string) => string;
  loadEvents?: (arg0: string) => void;
}

interface DispatchProps {
  showModal: ShowModal;
}

// interface ListFormatState {

// }

type Props = DispatchProps & ListFormatProps;

class ListFormatPricing extends Component<Props, {}> {
  public constructor(props: Props) {
    super(props);
    this.state = {};
    this.openModal = this.openModal.bind(this);
  }
  public openModal(data: ListFormatProps) {
    if (this.props.type === 'content') {
      this.props.showModal('CONTENT_ITEM', 'lg', null, null, { data: data, props: this.props });
    } else {
      this.props.showModal('DATA_DETAIL_MODAL', 'lg', null, null, { data: data, props: this.props });
    }
  }

  public OpenURL(data: any) {
    if (data.linkURL) {
      window.open(data.linkURL, '_blank');
    } else {
      // this.props.showModal('CONTENT_ITEM', 'lg', null, null, { data: data, props: this.props })

      if (this.props.type === 'content') {
        this.props.showModal('CONTENT_ITEM', 'lg', null, null, { data: data, props: this.props });
      } else {
        this.props.showModal('DATA_DETAIL_MODAL', 'lg', null, null, { data: data, props: this.props });
      }
    }
  }

  public generateListImage() {
    const currentUrl = window.location.pathname.substring(1).split('/')[1];
    const logoURL = this.props.ListData?.logoUrl || this.props.ListData?.logoURL;

    if (logoURL) {
      return `url('${logoURL}')`;
    } else if (currentUrl === 'companies') {
      return `url('${companyLogo}')`;
    } else {
      return `url(${''}})`;
    }
  }

  public renderField = (fieldname: string) => {
    const { ListData } = this.props;
    if (fieldname === 'CATEGORY') return ListData['category'];
    else if (fieldname === 'LANDLINE') return ListData['landline'];
    else if (fieldname === 'EMAIL') return ListData['email'];
    else if (fieldname === 'ADDRESS') return ListData['address']['address'];
    else if (fieldname === 'ZIPCODE') return ListData['address']['postcode'];
    else if (fieldname === 'COUNTRY') return ListData['address']['country'];
    else if (fieldname === 'WEBSITE') return ListData['url'];

    return '';
  };
  public render() {
    const { company_preferences, ListData } = this.props;

    return (
      <>
        <StyledList
          backgroundImage={this.generateListImage()}
          archived={this.props.ListData.contentStatus === 'ARCHIVED'}
        >
          <li className="companyList">
            <div className="companyDescriptionContainer">
              <div className="avatar-logo" onClick={this.OpenURL.bind(this, this.props.ListData)}>
                {!(this.props.ListData.logoUrl || this.props.ListData.logoURL) ? (
                  <FontAwesomeIcon icon={faImage} size={'2x'} style={{ color: 'white' }} />
                ) : (
                  <img
                    className="avatar-img"
                    alt="logo"
                    src={this.props.ListData.logoUrl || this.props.ListData.logoURL}
                  />
                )}
              </div>

              <div
                style={{ cursor: 'pointer' }}
                className="companyDescription "
                onClick={this.openModal.bind(this, {
                  platformEventMembers: this.props.platformEventMembers,
                  ...this.props.ListData,
                })}
              >
                <div className="companyDescriptionBody mView">
                  <div className="itemCompanyName">{this.props.ListData.name}</div>
                  <div className="companyIntro">
                    <p>
                      {this.props.type === 'company' &&
                        (this.props.ListData?.profiles.filter(
                          (profile: any) => profile.locale === this.props.ui.language
                        )[0]?.bio ? (
                          this.props.ListData?.profiles.filter(
                            (profile: any) => profile.locale === this.props.ui.language
                          )[0].bio
                        ) : this.props.ListData?.profiles.filter((profile: any) => profile.locale === 'en')[0]?.bio ? (
                          this.props.ListData?.profiles.filter((profile: any) => profile.locale === 'en')[0].bio
                        ) : (
                          <i>This company has not provided an introduction.</i>
                        ))}
                      {this.props.type === 'content' &&
                        (this.props.ListData?.bio ? this.props.ListData.bio : <i>This content has no body.</i>)}
                      {company_preferences && company_preferences.length > 0 ? (
                        <>
                          {company_preferences?.map((pref_field) =>
                            this.renderField(pref_field) === '' ? null : <p>{this.renderField(pref_field)}</p>
                          )}
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>
                <span className="keywords">
                  {this.props.type === 'company' && (
                    <KeywordList
                      isModal={false}
                      Keywords={
                        this.props.ListData?.profiles.filter(
                          (profile: any) => profile.locale === this.props.ui.language
                        )[0]
                          ? this.props.ListData?.profiles.filter(
                              (profile: any) => profile.locale === this.props.ui.language
                            )[0].keywords.length > 0
                            ? this.props.ListData?.profiles.filter(
                                (profile: any) => profile.locale === this.props.ui.language
                              )[0].keywords
                            : this.props.ListData?.profiles.filter((profile: any) => profile.locale === 'en')[0]
                            ? this.props.ListData?.profiles.filter((profile: any) => profile.locale === 'en')[0]
                                .keywords
                            : ['']
                          : this.props.ListData?.profiles.filter((profile: any) => profile.locale === 'en')[0]
                          ? this.props.ListData?.profiles.filter((profile: any) => profile.locale === 'en')[0].keywords
                          : ['']
                      }
                    />
                  )}
                  {this.props.type === 'content' && (
                    <KeywordList
                      isModal={false}
                      Keywords={
                        this.props.ListData.keywords
                          ? this.props.ListData.keywords.length > 0
                            ? this.props.ListData.keywords
                            : ['']
                          : ['']
                      }
                    />
                  )}
                </span>
                {this.props.ListData?.pricingMaster?.price !== null && (
                  <div className="d-flex price">
                    {this.props.ListData?.pricingMaster?.price > 0 ? (
                      <>
                        <div>{this.props.ListData?.pricingMaster?.currency?.toUpperCase()}</div>
                        {/* <span style={{paddingLeft:"2px"}}>{this.props.ListData.pricingMaster.price?.toLocaleString()}</span> */}
                        <div style={{ paddingLeft: '2px' }}>
                          {this.props.ListData.pricingMaster?.price +
                            (this.props.ListData.pricingMaster?.price * this.props.ListData.pricingMaster.tax) / 100}
                        </div>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                )}
              </div>
            </div>
          </li>
        </StyledList>

        {/* <StyledList2 backgroundImage={this.generateListImage()}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              background: '#f4f4f4',
              padding: '.75rem',
              marginBottom: '3px',
            }}
            onClick={this.OpenURL.bind(this, this.props.ListData)}
          >
            <div style={{ flex: 1 }}>
              <div className="companyImage" onClick={this.OpenURL.bind(this, this.props.ListData)}></div>
            </div>

            <div style={{ flex: 2, display: 'flex', justifyContent: 'space-between' }}>
              <div
                style={{
                  paddingRight: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <span>{this.props.ListData.name.substring(0, 14)}</span>
                <span>
                  {this.props.type === 'content' &&
                    (this.props.ListData?.bio ? (
                      this.props.ListData.bio.substring(0, 8)
                    ) : (
                      <i>This content has no body.</i>
                    ))}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                {this.props.ListData.pricingMaster.price > 0 ? (
                  <span style={{ fontSize: '10px' }}>
                    {this.props.ListData.pricingMaster.currency?.toUpperCase()}
                    &nbsp;
                    {this.props.ListData.pricingMaster.price +
                      (this.props.ListData.pricingMaster.price * this.props.ListData.pricingMaster.tax)/100
                      }
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </StyledList2> */}
      </>
    );
  }
}

const StyledList = styled.div<{ backgroundImage: string; archived: boolean }>`
  /* General styles for price */
  .price {
    margin: 1rem 0;
  }

  /* Avatar logo styles */
  .avatar-logo {
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    flex-direction: column;
    background: ${({ archived }) => (archived ? 'red' : '#e6e6e6')};
    box-shadow: 0 0 5px ${({ archived }) => (archived ? 'red' : '#8a8a8a')};
    width: 65px !important;
    height: 65px !important;
  }

  /* Avatar image styles */
  .avatar-img {
    width: 65px !important;
    height: 65px !important;
    border-radius: 50%;
    object-fit: cover;
    display: block;
  }

  /* Text description */
  .textDesc {
    font-size: 14px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Company Info */
  .companyInfo {
    display: flex;
    flex: 0.7;
  }

  .companyName {
    margin: 0;
    margin-bottom: 1em;
  }

  .itemCompanyName {
    font-weight: bold;
    font-size: 16px !important;
    width: fit-content;
  }

  /* Company Description Container */
  .companyDescriptionContainer {
    display: flex;
    align-items: center;
    gap: 2em;
    flex-direction: row;
    padding: 1rem;

    .companyDescription {
      display: flex;
      flex-direction: row;
      justify-content: left;
      flex: 1;
      gap: 0;
      margin-left: 1em;
      max-width: 90%;

      .companyDescriptionBody {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 90%;
      }

      .pricing {
        display: flex;
        align-items: center;
        padding: 0;
        font-size: large;
        font-weight: bolder;
        width: 20%;
      }

      .keywords {
        padding: 0;
        font-size: large;
        font-weight: bolder;
        margin-top: 1rem;
        width: 20%;

        .keyword-pad {
          white-space: pre;
          overflow: hidden;
          text-overflow: ellipsis;
          ul {
            border-radius: 5px;
            margin: 0 10px 0 0;
            font-size: 16px;
            display: inline;
          }
        }
      }
    }
  }

  /* Company List */
  .companyList {
    background: ${({ archived }) => (archived ? '#fee2e2' : '#f3f4f6')} !important;
    box-sizing: border-box;
    border-radius: 5px;
    list-style-type: none;
    margin-top: -1px;
    margin-bottom: 15px;
    color: black;
  }

  /* Company Image */
  .companyImage {
    background-image: ${(props) => encodeURI(props.backgroundImage)};
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    width: 40px !important;
    height: 40px !important;
    border-radius: 50%;
  }

  /* Company Intro */
  .companyIntro {
    text-align: left;
    p {
      font-size: medium;
      padding: 0;
      margin-bottom: 0.5rem;
      margin-top: 0.5rem;
      white-space: pre;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  /* List Styling */
  ul {
    margin-bottom: 0;
    padding: 0 0 0 15px;
  }

  .search-icon {
    display: flex;
    align-items: center;
    width: 0;
  }

  /* Desktop Styles (>= 768px) */
  @media screen and (min-width: 768px) {
    .companyDescription {
      max-width: 55%;
      text-align: justify;
      font-size: smaller;

      p {
        font-size: 14px;
      }
    }

    ul {
      padding: 0 0 0 10px;
      font-weight: bolder;
    }

    .keyword-pad {
      padding: 3px 15px;
      font-size: 0.75em;
      white-space: pre;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Company Logo adjustments */
    .companyLogo {
      display: flex;
      justify-content: center;
      .companyImage {
        width: 40px !important;
        height: 40px !important;
        border-radius: 50%;
        margin: 0;
        object-fit: cover;
      }
    }

    /* Adjust company description and body */
    .companyDescriptionContainer {
      gap: 0.3em;
      padding: 0.5rem;
    }

    .companyDescriptionBody {
      gap: 0 !important;
      width: 85%;
    }
  }

  /* Mobile Styles (< 768px) */
  @media screen and (max-width: 768px) {
    .avatar-logo {
      width: 44px !important;
      height: 44px !important;
    }

    .icons {
      font-size: 15px;
    }

    .keywords {
      display: none;
      padding: 0;
      font-size: medium;
      font-weight: bolder;
      width: 70px;

      .keyword-pad {
        white-space: pre;
        text-overflow: ellipsis;

        img {
          border-style: none;
          height: 70px;
          width: 70px;
          margin: 15px 0;
          border-radius: 50%;
        }
      }
    }

    .companyLogo {
      padding: 0;
      margin-bottom: 1em;
    }

    .itemCompanyName {
      font-weight: bold;
      font-size: medium !important;
    }

    .companyDescriptionContainer {
      gap: 0.5em;
      padding: 0;
    }

    .companyDescription {
      display: flex;
      flex-wrap: none;
      gap: 0.5rem;
      justify-content: flex-start;
      text-align: justify;
      bottom: 13px;
      font-size: small;
      max-width: 70% !important;

      p {
        font-size: 14px;
      }
    }

    .companyDescriptionBody {
      gap: 0 !important;
      width: 85%;
    }

    .companyList {
      padding: none !important;
    }

    .companyIntro {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Mobile Specific */
    .companyIntro p {
      margin-bottom: 0;
    }

    .keywords {
      margin: 0;
      text-align: right;

      ul {
        margin: 0;
        padding: 0;
      }
    }

    /* Mobile-specific adjustments */
    .companyDescriptionContainer {
      gap: 0.5;
      padding: 0;
    }

    .companyDescription {
      margin: 0;
      margin-bottom: 2em;
      span {
        text-align: center;
        margin: auto;
      }
    }

    .keywords {
      margin: 0;
      text-align: right;
    }

    .companyImage {
      background-image: ${(props) => encodeURI(props.backgroundImage)};
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      width: 30px !important;
      height: 40px !important;
    }

    .pricing {
      display: block;
      padding: 0 !important;
    }
  }
`;

const StyledList2 = styled.div<{ backgroundImage: string; archived: boolean }>`

  .price {
    margin-bottom: 1rem;
    margin-top: 1rem
  }

  .avatar-logo {
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink : 0;
      flex-direction: column;
      background: ${({ archived }) => (archived ? 'red' : '#e6e6e6')};
      box-shadow: 0 0 5px ${({ archived }) => (archived ? 'red' : '#8a8a8a')} ;
      width: 65px !important;
      height: 65px !important;
  }

  .avatar-img {
    width: 65px !important;
    height: 65px !important;
  }
    
  .avatar-img {
    border-radius: 50%;
    object-fit: contain;
  }
    
  
  .textDesc {
    font-size: 14px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }




  @media only screen and (max-width: 768px) {
    width: 100%;
  }
  @media only screen and (min-width: 769px) {
    width: 100%;
    margin: auto;
  }


  .companyInfo {
    display: flex;
    flex: 0.7;
  }

  .companyName {
    margin: 0;
    margin-bottom: 1em;
  }

  .itemCompanyName {
    font-weight: bold;
    font-size: 16px!important;
    width: fit-content;
  }

  .companyDescriptionContainer {
    // padding-bottom: 0.5em;
    display: flex;
    align-items: center;
    gap: 2em;
    flex-direction: row;
    padding: 1rem 1rem;

    .companyDescription {
      display: flex;
      flex-direction: row;
      justify-content: left;
      flex: 1;
      gap: 0;
      margin-left: 1em;
      max-width: 90%;

      .companyDescriptionBody {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 90%;
      }
      .pricing{
        display: flex;
        align-items: center;
        padding: 0;
        font-size: large;
        font-weight: bolder;
        width: 20%;
      }

      .keywords {
        padding: 0;
        font-size: large;
        font-weight: bolder;
        margin-top: 1rem;
        width: 20%;
        .keyword-pad {
          white-space: pre;
          overflow: hidden;
          text-overflow: ellipsis;
          ul {
            border-radius: 5px;
            // padding: 0px 5px 0px 0px;
            margin: 0px 10px 0px 0px;
            font-size: 16px;
            display: inline;
          }
        }
      }
    }
   
  }

  .companyList {
    
    background: ${({ archived }) => (archived ? '#fee2e2' : '#f3f4f6')} !important;
    // //padding: 0em 1em 0em 1em;
    box-sizing: border-box;
    border-radius: 5px;
    list-style-type: none;
    margin-top: -1px;
    margin-bottom: 15px;
    color: black;
  }
  .companyImage {
    background-image: ${(props) => encodeURI(props.backgroundImage)};
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    width: 40px !important;
    height: 40px !important;
    border-radius:50%;
  }

  .companyIntro {
    text-align: left;
    p {
      font-size: medium;
      padding: 0;
      margin-bottom: 0.5rem;
      margin-top: 0.5rem;
      white-space: pre;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  ul {
    margin-bottom: 0em;
    padding: 0 0 0 15px;
  }

  .search-icon {
    display: flex;
    align-items: center;
    width: 0;
  }

  @media screen and (max-width: 950px) {
    .keywords {
      display: none;
    }

  }
  
  @media screen and (max-width: 765px) {

    .avatar-logo {
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink : 0;
      flex-direction: column;
      background: ${({ archived }) => (archived ? 'red' : '#e6e6e6')};
      box-shadow: 0 0 5px ${({ archived }) => (archived ? 'red' : '#8a8a8a')} ;
      width: 44px !important;
      height: 44px !important;
    }


    .icons {
      font-size: 15px;
    }

    .keywords {
      display: none;
      padding: 0px;
      font-size: medium;
      font-weight: bolder;
      width: 70px;
      .keyword-pad {
        white-space: pre;
        //overflow: hidden;
        text-overflow: ellipsis;
        //display: none;
        img {
          border-style: none;
          height: 70px;
          width: 70px;
          margin: 15px 0px;
          border-radius: 50%;
          
        }
      }
    }

    .companyLogo {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      padding: inherit;
      .companyImage {
        width: 40px !important;
        height: 40px !important;
        border-radius: 50%;
        margin: 0;
        object-fit: cover;
      }
    }

    .itemCompanyName {
      font-weight: bold;
      font-size: medium !important;
    }

    .companyDescriptionContainer {
      gap: 0.3em;
      padding: 0.5rem 0.5rem;
    }
    .companyDescription {
      display: flex;
      flex-direction: row;
      flex-wrap: none;
      gap: 0.5rem !important
      justify-content: flex-start;
      text-align: justify;
      bottom: 13px;
      font-size: small;
      max-width: 70% !important;
      
      p {
        font-size: 14px;
      }
    }
    

    .companyDescriptionBody {
      gap:  0 !important;
      width: 85%;
    }

    .companyList {
      list-style-type: none;
      margin-top: -1px;
      /* border-bottom: 1px solid #e8e8e8; */
      //padding: 15px 20px 0px 20px;
      padding: none !important;
      color: black;
    }
    .companyIntro {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  @media screen and (max-width: 350px) {

    .companyIntro {

      p {
        margin-bottom: 0px;
       
      }
    }
    
    .companyDescriptionContainer {
      gap: 0.5;
      padding: 0;
    }

    .companyLogo {
      padding: 0;
      margin-bottom: 1em;
    }

    .companyDescription {
      margin: 0;
      margin-bottom: 2em;
      span {
        text-align: center;
        margin: auto;
      }
    }

    .keywords {
      margin: 0;
      //margin-bottom: 2em;
      text-align: right;
      ul {
        margin: 0;
        padding: 0;
      }
    }

  }
  @media screen and (min-width: 768px) {

    .companyDescription {
      max-width: 55%;
      text-align: justify;
      bottom: 13px;
      font-size: smaller;
      p {
        font-size: 14px;
      }
    }
    ul {
      padding: 0px 0 0 10px;
      font-weight: bolder;
    }
  

    .keyword-pad {
      padding: 3px 15px 3px 15px;
      margin-top: 0px;
      font-size: 0.75em;
      white-space: pre;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  @media screen and (min-width: 1023px) {
    ul {
      padding: 0px 0 0 60px;
      font-size: inherit;
      font-weight: bolder;
    }
  }

  @media screen and (min-width: 768px) {
    .companyDescription {
      max-width: 100%;
      text-align: justify;
      bottom: 13px;
      font-size: smaller;
      p {
        font-size: 14px;
      }
    }
  }

  @media only screen and(min-width: 350px) {
    .companyImage {
      background-image: ${(props) => encodeURI(props.backgroundImage)};
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      width: 30px !important;
      height: 40px !important;
    }
  }

  @media only screen and (min-width:350px){
    .pricing{
        display: block;
        padding: 0!important;
    }
  }
`;

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      showModal,
    },
    dispatch
  );
};

const mapStateToProps = (state: AppState) => ({
  ui: state.ui,
});

export default connect(mapStateToProps, mapDispatchToProps)(ListFormatPricing);
