import React, { Component } from 'react';
import styled from 'styled-components';
import KeywordList from './KeywordList';
import { showModal } from '../../store/modal/action';
import { ShowModal } from '../../store/modal/types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { AppState } from '../../store/root';
import userImg from '../../assets/images/profile_placeholder.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import DeailsModal from '../components/Modal/NotesModal'
import { UserData } from '../../store/user/types';
// import { ListStyle } from './ListStyle';

interface ListFormatAttendeesProps {
  ListData: {
    companyId: string;
    userId: string;
    avatar: string;
    name: string;
    company: any;
    profile: any;
    email: string;
    status: string;
    profiles: any[];
    keywords: [''];
  };

  ui: {
    language: string;
  };
  truncateText: (arg0: string) => string;
}

interface DispatchProps {
  showModal: ShowModal;
}
interface FamilyMember {
  name: string;
  rating: number;
}

const linkedFamilyMembers: FamilyMember[] = [
  { name: 'Maya', rating: 4 },
  { name: 'Annika', rating: 5 },
  { name: 'Dilan', rating: 3 },
];

// interface ListFormatState {

// }

type Props = DispatchProps & ListFormatAttendeesProps;

class ListFormatAttendees extends Component<Props, {}> {
  public constructor(props: Props) {
    super(props);
    this.state = {};

    this.openModal = this.openModal.bind(this);
  }

  public openModal(params) {
    this.props.showModal('DATA_DETAIL_MODAL', 'lg', null, null, { data: params });
  }

  public renderKeywords = () => {
    console.log('Debug - All profiles:', this.props.ListData?.profiles);
    console.log('Debug - Current UI language:', this.props.ui.language);

    const filteredProfiles = this.props.ListData?.profiles?.filter((profile: any) =>
      this.props.ui.language.includes(profile.locale)
    );
    console.log('Debug - Filtered profiles by language:', filteredProfiles);

    const attendeeKeywords = filteredProfiles?.[0]?.categorisedKeywords || [];
    console.log('Debug - Extracted keywords:', attendeeKeywords);

    // Fallback to English if no keywords found in current language
    if (attendeeKeywords.length === 0) {
      const englishProfile = this.props.ListData?.profiles?.find((profile: any) => profile.locale === 'en');
      console.log('Debug - English profile:', englishProfile);
      const englishKeywords = englishProfile?.keywords || [];
      console.log('Debug - English keywords:', englishKeywords);

      return <KeywordList isModal={false} Keywords={englishKeywords} />;
    }

    return <KeywordList isModal={false} Keywords={attendeeKeywords} />;
  };

  public render() {
    return (
      <ListStyle>
        <li className="companyList" onClick={this.openModal.bind(this, this.props.ListData)}>
          <div className="companyDescriptionContainer">
            {/* Logo on the left */}
            <div className="companyLogo">
              <img
                src={this.props.ListData.avatar ? `${this.props.ListData.avatar}` : `${userImg}`}
                alt={this.props.ListData.name}
              />
            </div>

            {/* Main content (title, description, tags) */}
            <div className="companyDescription">
              {/* Title and description on the left */}
              <div className="textContent">
                <h3 className="itemCompanyName">{this.props.ListData.name}</h3>
                <div className="companyIntro">
                  {/* <p> */}
                  {this.props.ListData.profiles?.filter((profile: any) => profile.locale === this.props.ui.language)[0]
                    ? this.props.ListData.profiles?.filter(
                        (profile: any) => profile.locale === this.props.ui.language
                      )[0].bio
                    : this.props.ListData.profiles?.filter((profile: any) => profile.locale === 'en')[0]
                    ? this.props.ListData.profiles?.filter((profile: any) => profile.locale === 'en')[0].bio
                    : 'This user has no description.'}
                  {/* </p> */}
                </div>
              </div>
              <div className="familyDescription">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  style={{ marginRight: '5px' }}
                >
                  <path d="M6.354 5.5H4a3 3 0 0 0 0 6h2.354a.5.5 0 0 1 0 1H4a4 4 0 0 1 0-8h2.354a.5.5 0 0 1 0 1z" />
                  <path d="M9.646 10.5H12a3 3 0 0 0 0-6H9.646a.5.5 0 0 1 0-1H12a4 4 0 0 1 0 8H9.646a.5.5 0 0 1 0-1z" />
                  <path d="M8.354 7.5a.5.5 0 0 1 0 1h-1.707a.5.5 0 0 1 0-1h1.707z" />
                </svg>
                {linkedFamilyMembers.map((member, index) => (
                  <span key={index}>
                    {member.name}
                    {index < linkedFamilyMembers.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
              {/* Tags in the middle */}
              <div className="tagsWrapper">{this.renderKeywords()}</div>
              <div className="ratingTag">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="#001F4D" // dark blue color
                  viewBox="0 0 16 16"
                  style={{ marginRight: '3px' }}
                >
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.32-.158-.888.283-.95l4.898-.696 2.01-4.37c.197-.428.73-.428.927 0l2.01 4.37 4.898.696c.441.062.612.63.283.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                </svg>
                <span>{linkedFamilyMembers[0].rating}/5</span>
              </div>
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
    border-radius: 50%;
  }

  .companyLogo img {
    width: 100%;
    height: auto;
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
    flex: 0 0 40%;
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
  .familyDescription {
    flex: 0 0 20%;
  }

  .tagsWrapper {
    flex: 0 0 20%;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: flex-start;
  }
  .ratingTag {
    flex: 0 0 20%;
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
      border-radious: 50%;
    }

    .companyDescription {
      flex-direction: row;
      gap: 0.5rem;
    }

    .textContent {
      flex: 0 0 75%;
      max-width: 75%;
      flex-shrink: 1;
    }

    .tagsWrapper {
      display: none;
    }

    .itemCompanyName {
      font-size: 0.8rem;
      margin-bottom: 0.5rem;
    }
    .tagsWrapper {
      flex: 1;
      justify-content: center;
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

export default connect(mapStateToProps, mapDispatchToProps)(ListFormatAttendees);
