import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { showModal } from '../../store/modal/action';
import styled from 'styled-components';
import { connect } from 'react-redux';
import autobind from 'auto-bind/react';
import CompanyDropdown from './CompanyDropdown';
import { getUserCompanies, switchCompany, sessionRequest } from '../../providers/user';
import { setLoadingOverlay, setChannelDataError, errorHandlerGeneral } from '../../store/ui/action';
import { setSelection, setUserData, setCompanyData, setAllCompanies } from '../../store/user/action';

interface UserCompanyProps {
  _id: number;
  id: string;
  name: string;
}

interface SwitcherProps {
  userCompany: UserCompanyProps;
  setChannelDataError: any;
  setLoadingOverlay: any;
  errorHandlerGeneral: any;
  userData: any;
  showModal: any;
  setSelection: any;
  event: any;
  setUserData: any;
  setCompanyData: any;
  setAllCompanies: any;
}

interface SwitcherState {
  currentCompany: any;
  companiesList: any[];
  isInspired: boolean;
  isUserProfile: boolean;
}

class CompanySwitcher extends Component<SwitcherProps, SwitcherState> {
  private tabId = Math.random().toString(36).substr(2, 9);
  private channel: BroadcastChannel | null = null;
  private isBroadcastUpdating = false;

  public constructor(props: SwitcherProps) {
    super(props);
    autobind(this);
    this.state = {
      currentCompany: { name: 'All', id: '' },
      companiesList: [],
      isInspired: false,
      isUserProfile: false,
    };
  }

  public async componentDidMount() {
    this.channel = new BroadcastChannel('profile_mode_channel');
    this.channel.onmessage = async (event) => {
      if (event.data?.type === 'profileModeChanged') {
        if (event.data.senderId === this.tabId) {
          return;
        }
        // Update the session value in sessionStorage
        const key = `isPersonelProfile-${this.props.userData.id}`;
        const newProfileMode = event.data.profileMode;
        window.sessionStorage.setItem(key, newProfileMode);
        // Fetch latest session and update Redux
        const sessionResult = await sessionRequest(this.props.event.id);
        if (sessionResult.result === 'success') {
          this.props.setUserData(sessionResult.User);
          this.props.setCompanyData(sessionResult.Company);
          this.props.setAllCompanies(sessionResult.AllCompanies);
          // Update isUserSelected in Redux
          const personalKey = `isPersonelProfile-${sessionResult.User.id}`;
          const isPersonalProfile = window.sessionStorage.getItem(personalKey) === 'yes';
          this.props.setSelection(isPersonalProfile);
          // Update currentCompany for button name
          let newCurrentCompany;
          if (isPersonalProfile) {
            newCurrentCompany = {
              name: sessionResult.User.firstName + ' ' + sessionResult.User.lastName,
              id: sessionResult.User.id,
            };
          } else {
            newCurrentCompany = {
              name: sessionResult.Company.name,
              id: sessionResult.Company.id,
              _id: sessionResult.Company._id,
            };
          }
          this.setState({ currentCompany: newCurrentCompany });
        }
      }
    };

    await this.getCompanies();
  }

  public componentWillUnmount() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
  }

  public companyUpdate(name: any, _id: any, id: any) {
    _id = id;
    this.props.setLoadingOverlay(true);
    // alert(id+" --"+_id);
    const isPersonalProfile = name === this.props.userData.firstName + ' ' + this.props.userData.lastName;
    this.setState({ isUserProfile: isPersonalProfile });
    // this.props.setSelection(isUserProfile);

    if (isPersonalProfile) {

      this.setState({ currentCompany: { name: name, id: id } });

      // window.sessionStorage.setItem(`isPersonelProfile-${this.props.userData.id}`, 'yes');

      switchCompany(_id, id, this.props.event.id)
        .then((result: any) => {
          if (result.data && !Object.keys(result.data)) {
            if (result.error?.Code === 'NO_SESSION') {
              window.location = '/' as any;
              return;
            }
            this.props.setChannelDataError(result.error);
            this.props.setLoadingOverlay(false);
          } else {

            window.sessionStorage.setItem(`isPersonelProfile-${this.props.userData.id}`, 'yes');
            this.props.setSelection(true);

            if (!this.isBroadcastUpdating) {
              const channel = new BroadcastChannel('profile_mode_channel');
              channel.postMessage({
                type: 'profileModeChanged',
                senderId: this.tabId,
                profileMode: 'yes',
              });
              channel.close();
            }
            this.props.setLoadingOverlay(false);
          }
        })
        .catch((err) => {
          this.props.errorHandlerGeneral(err);
          this.props.setLoadingOverlay(false);
        });

      // window.location.href = "https://my-dev.synkd.life/profile"
    } else {
      switchCompany(_id, id, this.props.event.id)
        .then((result: any) => {
          if (result.data && !Object.keys(result.data)) {
            if (result.error && result.error.Code === 'NO_SESSION') window.location = '/' as any;

            this.props.setChannelDataError(result.error);
            this.props.setLoadingOverlay(false);
          } else {
            this.setState({ currentCompany: { name: name, id: id } });
            window.sessionStorage.setItem(`isPersonelProfile-${this.props.userData.id}`, 'no');
            this.props.setSelection(false);
            if (!this.isBroadcastUpdating) {
              const channel = new BroadcastChannel('profile_mode_channel');
              channel.postMessage({
                type: 'profileModeChanged',
                senderId: this.tabId,
                profileMode: 'no',
              });
              channel.close();
            }

            this.props.setLoadingOverlay(false);
            // window.location.reload() // TODO: change this to update the User redux state with new session info without refreshing, this is a bandaid solution
            const url =
              window.location.pathname && typeof window.location.pathname === 'string'
                ? window.location.pathname.split('/')
                : '';
            //window.location = '/' + url[1] as any
          }
        })
        .catch((err) => {
          this.props.errorHandlerGeneral(err);
          this.props.setLoadingOverlay(false);
        });
    }
  }

  public async getCompanies() {
    let userCompanies: any = await getUserCompanies();

    try {
      if (!Object.keys(userCompanies.data)) {
        if (userCompanies.error.Code === 'NO_SESSION') window.location = '/' as any;
        this.props.setChannelDataError(userCompanies.error);
      } else {
        let companyList = userCompanies.data.myCompanies.companyMemberships;
        let formattedCompanyName: any[] = [];

        let inspired = companyList.find((ele: any) => {
          return ele.company.type === 10; // TODO: eventually check for type 10 instead
        });

        // if (inspired) {
        //   this.setState({
        //     isInspired: true
        //   })
        // }

        if (window.sessionStorage.getItem(`isPersonelProfile-${this.props.userData.id}`) === 'yes') {
          this.setState({
            currentCompany: {
              name: this.props.userData.firstName + ' ' + this.props.userData.lastName,
              id: this.props.userData.id,
            },
          });
        } else {
          this.setState({
            currentCompany: {
              name: this.props.userCompany.name,
              id: this.props.userCompany.id,
              _id: this.props.userCompany._id,
            },
          });
        }

        companyList.map((cmp: any) => {
          formattedCompanyName.push({
            text: cmp.company.name,
            id: cmp.company.id,
            onClick: () => this.companyUpdate(cmp.company.name, cmp.company._id, cmp.company.id),
          });
        });

        if (inspired) {
          formattedCompanyName.splice(1, 0, { text: 'Other...', id: 'master', onClick: () => this.inspiredClick() });
        }

        // Add personal profile at the top of companyList
        formattedCompanyName.unshift({
          text: this.props.userData.firstName + ' ' + this.props.userData.lastName,
          id: this.props.userData.id,
          onClick: () =>
            this.companyUpdate(
              this.props.userData.firstName + ' ' + this.props.userData.lastName,
              this.props.userData._id,
              this.props.userData.id
            ),
        });
        if (formattedCompanyName.length > 0) {
          this.setState({ companiesList: formattedCompanyName });
        }
      }
    } catch (err) {
      this.props.errorHandlerGeneral(err);
    }
  }

  public inspiredClick() {
    this.props.showModal('COMPANY_SWITCH_MASTER', 'xl', null, { event: this.props.event }, { event: this.props.event });
  }

  public render() {
    return (
      <StyledCompanySwitcher>
        <CompanyDropdown
          bsClass="ml-2"
          text={this.state.currentCompany.name}
          items={this.state.companiesList}
          disabled={this.state.companiesList.length === 0}
          color={'#FEFEFE'}
        />
      </StyledCompanySwitcher>
    );
  }
}

const StyledCompanySwitcher = styled.nav`
  a.dropdown-item {
    letter-spacing: normal;
    padding: 0 0 4px 12px;
  }
  .dropdown-menu {
    max-height: 450px;
    overflow: auto;
  }

  @media only screen and (max-width: 450px) {
    .dropdown-menu {
      min-width: 3rem !important;
    }
  }
`;

const mapStateToProps = function (state: any) {
  return {
    userCompany: state.user.userData.company,
    userData: state.user.userData,
  };
};

const mapDispatchToProps = function (dispatch: any) {
  return bindActionCreators(
    {
      setChannelDataError,
      setLoadingOverlay,
      errorHandlerGeneral,
      showModal,
      setSelection,
      setUserData,
      setCompanyData,
      setAllCompanies,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanySwitcher);
