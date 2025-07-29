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
// import { ListStyle } from './ListStyle'

interface ListFormatProps {
  ListData: any;
  ui: any;
  type?: any;
  titleStyle?: any;
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

class ListFormat extends Component<Props, {}> {
  public constructor(props: Props) {
    super(props);
    this.state = {};
    this.openModal = this.openModal.bind(this);
  }

  componentDidMount(): void {
    // console.log("pricing: "+this.props.ListData.pricingMaster.price)
  }

  public openModal(data: ListFormatProps) {
    console.log('list format this.props.type: ', this.props.type);
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
  public renderDescription = () => {
    // Move your bio rendering logic here
    return (
      <>
        {this.props.type === 'company' &&
          (this.props.ListData?.profiles.filter((profile: any) => profile.locale === this.props.ui.language)[0]?.bio ? (
            this.props.ListData?.profiles.filter((profile: any) => profile.locale === this.props.ui.language)[0].bio
          ) : this.props.ListData?.profiles.filter((profile: any) => profile.locale === 'en')[0]?.bio ? (
            this.props.ListData?.profiles.filter((profile: any) => profile.locale === 'en')[0].bio
          ) : (
            <i>This company has not provided an introduction.</i>
          ))}
        {this.props.type === 'content' &&
          (this.props.ListData?.bio ? this.props.ListData.bio : <i>This content has no body.</i>)}
      </>
    );
  };

  public renderKeywords = () => {
    // Move your keyword rendering logic here
    const companyKeywords = this.props.ListData?.profiles.filter((profile: any) =>
      this.props.ui.language.includes(profile.locale)
    )?.[0]?.categorisedKeywords || [''];
    return (
      <>
        {this.props.type === 'company' && <KeywordList isModal={false} Keywords={companyKeywords} />}
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
      </>
    );
  };

  public render() {
    const { company_preferences, ListData } = this.props;

    console.log('uidfdfdsffdssf', this.props.ui);

    // return (
    // <ListStyle>
    //     <li style={{cursor:'pointer', width:"100%"}} className="companyList">
    //       <div className="companyDescriptionContainer">
    //         <div className="companyLogo">
    //            <img src={this.props.ListData.logoURL  ? `${this.props.ListData.logoURL}` : `${companyLogo}` } />

    //         </div>
    //         <div style={{ cursor: "pointer" }} className="companyDescription" onClick={this.openModal.bind(this, this.props.ListData)}>
    //           <div className="companyDescriptionBody">
    //             <span className="itemCompanyName">xx {this.props.ListData.name}</span>
    //             <span className="companyIntro">
    //               <p>
    //                 {this.props.type === 'company' && (this.props.ListData?.profiles.filter((profile: any) => profile.locale ===    this.props.ui.language)[0]?.bio ? this.props.ListData?.profiles.filter((profile: any) => profile.locale === this.props.ui.language)[0].bio : this.props.ListData?.profiles.filter((profile: any) => profile.locale === "en")[0]?.bio ? this.props.ListData?.profiles.filter((profile: any) => profile.locale === "en")[0].bio : <i>This company has not provided an introduction.</i>)}
    //                 {this.props.type === 'content' && (this.props.ListData?.bio ? this.props.ListData.bio : <i>This content has no body.</i>)}
    //                 {
    //                   // company_preferences && company_preferences.length > 0 ? <>
    //                   //   {
    //                   //     company_preferences?.map(pref_field => (
    //                   //       this.renderField(pref_field) === '' ? null : <p>{this.renderField(pref_field)}</p>
    //                   //     ))
    //                   //   }
    //                   //   {/* company_preferences?.map((field: string) => {
    //                   //   return (<p>{ListData[field.toLowerCase()]}</p>);
    //                   // }) */}
    //                   // </> : null
    //                 }
    //               </p>
    //             </span>
    //           </div>
    //           <span className="keywords">
    //             {/* {this.props.type === 'company' && <KeywordList Keywords={(this.props.ListData?.profiles.filter((profile : any) => profile.locale === "en")[0]  && this.props.ListData.filter((profile : any) => profile.locale === "en")[0].keywords.length > 0) ? this.props.ListData.filter((profile : any) => profile.locale === "en")[0].keywords : ['No Keywords provided']} />} */}
    //             {this.props.type === 'company' && <KeywordList isModal={false} Keywords={this.props.ListData?.profiles.filter((profile: any) => profile.locale === this.props.ui.language)[0] ? this.props.ListData?.profiles.filter((profile: any) => profile.locale === this.props.ui.language)[0].keywords.length > 0 ? this.props.ListData?.profiles.filter((profile: any) => profile.locale === this.props.ui.language)[0].keywords : (this.props.ListData?.profiles.filter((profile: any) => profile.locale === "en")[0] ? this.props.ListData?.profiles.filter((profile: any) => profile.locale === "en")[0].keywords : ['']) : (this.props.ListData?.profiles.filter((profile: any) => profile.locale === "en")[0] ? this.props.ListData?.profiles.filter((profile: any) => profile.locale === "en")[0].keywords : [''])} />}
    //             {this.props.type === 'content' && <KeywordList isModal={false} Keywords={this.props.ListData.keywords ? this.props.ListData.keywords.length > 0 ? this.props.ListData.keywords : [''] : ['']} />}
    //           </span>
    //         {/* {this.props.ListData.pricingMaster.price !==null && (
    //              <span className="keywords">
    //              {this.props.ListData.pricingMaster.price > 0 ? this.props.ListData.pricingMaster.currency?.toUpperCase()+" "+this.props.ListData.pricingMaster.price?.toLocaleString() : ''}
    //            </span>
    //         )} */}

    //         </div>
    //       </div>
    //     </li>
    //   </ListStyle>
    // )

    // return (
    //   <ListStyle>
    //     <li className="companyList">
    //       <div className="companyDescriptionContainer">
    //         <div className="companyLogo">
    //           <img
    //             src={this.props.ListData.logoURL || companyLogo}
    //             alt={this.props.ListData.name}
    //           />
    //         </div>

    //         <div className="companyDescription" onClick={this.openModal.bind(this, this.props.ListData)}>
    //           <div className="textContent">
    //             <h3 className="itemCompanyName">{this.props.ListData.name}</h3>
    //             <div className="companyIntro">
    //               {this.renderDescription()}
    //             </div>
    //           </div>

    //           <div className="keywordsWrapper">
    //             {this.renderKeywords()}
    //           </div>
    //         </div>
    //       </div>
    //     </li>
    //   </ListStyle>
    // )
    return (
      <ListStyle>
        <li className="companyList">
          <div className="companyDescriptionContainer">
            {/* Logo on the left */}
            <div className="companyLogo">
              <img src={this.props.ListData.logoURL || companyLogo} alt={this.props.ListData.name} />
            </div>

            {/* Main content (title, description, tags, and price) */}
            <div className="companyDescription" onClick={this.openModal.bind(this, this.props.ListData)}>
              {/* Title and description on the left */}
              <div className="textContent">
                <h3 className="itemCompanyName">{this.props.ListData.name}</h3>
                <div className="companyIntro">{this.renderDescription()}</div>
              </div>

              {/* Tags in the middle */}
              <div className="tagsWrapper">{this.renderKeywords()}</div>

              {/* Price on the right */}
              {/* <div className="priceWrapper">
                {this.props.ListData.pricingMaster?.price !== null && (
                  <span className="price">
                    {this.props.ListData.pricingMaster?.price > 0
                      ? `${this.props.ListData.pricingMaster.currency?.toUpperCase()} ${this.props.ListData.pricingMaster?.price?.toLocaleString()}`
                      : 'Free'}
                  </span>
                )}
              </div> */}
            </div>
          </div>
        </li>
      </ListStyle>
    );
  }
}

const ListStyle = styled.div`
  .companyList {
    cursor: pointer;
    width: 100%;
    padding: 0.8rem;
    background-color: #f3f4f6;
    list-style: none;
    margin-bottom: 1rem;
    padding-left: 0;
  }

  .companyDescriptionContainer {
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
    padding-left: 1rem;
  }

  .companyLogo {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 65px;
    height: 65px;
    padding: 0;
    overflow: hidden;
  }

  .companyLogo img {
    width: 100%;
    height: auto
    display: block;
  }

  .companyDescription {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-shrink: 1;
  }

  .textContent {
    flex: 0 0 40%; /* Takes 60% of the width */
  }

  .itemCompanyName {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.25rem;
  }

  .companyIntro {
    font-size: 0.9rem;
    color: #666;
    line-height: 1.4;
  }

  .tagsWrapper {
    flex: 0 0 20%; /* Takes 30% of the width */
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem; /* Space between individual tags */
    justify-content: flex-start; /* Align tags to the start */
  }

  .priceWrapper {
    flex: 0 0 10%; /* Takes 10% of the width */
    display: flex;
    justify-content: flex-end; /* Align price to the end */
  }

  .price {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    white-space: nowrap; /* Prevents price from wrapping */
  }

  /* Responsive Styles */
  @media (max-width: 768px) {
    .companyDescriptionContainer {
      gap: 0.5rem;
      padding-left: 0.5rem;
    }

    .companyLogo {
      width: 50px;
      height: 50px;
    }
    .price {
      font-size: 0.8rem;
    }
    .tagsWrapper {
      display: none; /* Hide tags in mobile view */
    }

    .companyDescription {
      flex-direction: column;
      gap: 0.5rem;
      flex-direction: row;
    }

    .textContent {
      flex: 0 0 75%;
      max-width: 75%;
      flex-shrink: 1;
    }

    .tagsWrapper {
      flex: 1;
      justify-content: center;
    }

    .priceWrapper {
      flex: 0 0 15%;
      max-width: 15%;
      justify-content: flex-end;
    }

    .itemCompanyName {
      font-size: 0.8rem;
    }

    .companyIntro {
      font-size: 0.8rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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

export default connect(mapStateToProps, mapDispatchToProps)(ListFormat);
