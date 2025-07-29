import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../store/root';
import { getUserCompanies, switchCompany } from '../providers/user';
import Dropdown from './Form/Dropdown';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// @ts-ignore
import onClickOutside from 'react-onclickoutside';
import { compose } from 'redux';

interface CompanyInformation {
  address: object;
  _id: string | number;
  id: string;
  name: string;
  email: string;
  currency: string;
}

interface CurrentCompany {
  company: CompanyInformation;
  id: string;
  role: string;
}

interface SwitcherProps {
  user: any;
}

interface SwitcherState {
  currentCompany: any;
  companiesList: any;
  dropdownVisible: boolean;
}

class CompanySwitcher extends Component<SwitcherProps, SwitcherState> {
  public constructor(props: SwitcherProps) {
    super(props);
    this.state = {
      currentCompany: {},
      companiesList: [],
      dropdownVisible: false,
    };

    this.getCompanies = this.getCompanies.bind(this);
  }

  public handleClickOutside(evt: any) {
    if (this.state.dropdownVisible) {
      this.setState({
        dropdownVisible: false,
      });
    }
  }

  public async componentDidMount() {
    await this.getCompanies();
  }

  public toggleDropdown() {
    this.setState({
      dropdownVisible: !this.state.dropdownVisible,
    });
  }

  public hideDropdown() {
    this.setState({
      dropdownVisible: false,
    });
  }

  public companyUpdate(name: string, id: string, _id: string) {
    if (id && _id) {
      switchCompany(_id, id, '')
        .then((result: any) => {
          window.location.reload(); // TODO: change this to update the User redux state with new session info without refreshing, this is a bandaid solution
        })
        .catch((err) => {
          // do some error handling?
        });
    }
  }

  public async getCompanies() {
    // let userCompanies: any = await getUserCompanies()
    // try {
    //   if (!Object.keys(userCompanies.data)) {
    //     // do some error handling
    //   } else {
    //     let companyList = userCompanies.data.myCompanies.companyMemberships
    //     let formattedCompanyName: any = []
    //     if (this.props.user.allCompanies.length > 0) {
    //       let currentCompany = this.props.user.allCompanies.find((ele: any) => {
    //         return ele.company.id === this.props.user.companyData.id
    //       })
    //       this.setState({ currentCompany: { name: currentCompany.name, id: currentCompany.company.id, _id: currentCompany.company._id } })
    //     }
    //     companyList.map((cmp: any) => {
    //       formattedCompanyName.push({ text: cmp.company.name, id: cmp.company.id, onClick: () => this.companyUpdate(cmp.company.name, cmp.company.id, cmp.company._id) })
    //     })
    //     if (formattedCompanyName.length > 0) {
    //       this.setState({ companiesList: formattedCompanyName })
    //     }
    //   }
    // } catch (err) {
    //   console.error(err)
    // }
  }

  public renderDropdownOptions() {
    let { isEventAttendee } = this.props.user;

    let validCompanies = [];
    for (let att of isEventAttendee) {
      validCompanies.push({ name: att.invitee.company.name, id: att.invitee.company.id, _id: att.invitee.company._id });
    }
    // @ts-ignore
    validCompanies = [...new Map(validCompanies.map((item) => [item['id'], item])).values()];

    return validCompanies.map((comp: any) => {
      return (
        <a href="#" onClick={() => this.companyUpdate(comp.name, comp.id, comp._id)} key={comp.id}>
          {comp.name}
        </a>
      );
    });

    // return this.state.companiesList.map((cmp) => {
    //   return <a href="#" onClick={cmp.onClick} key={cmp.id}>{cmp.text}</a>
    // })
  }

  public render() {
    const { companyData } = this.props.user;

    return (
      <StyledSwitcher onClick={() => this.toggleDropdown()}>
        <span className="switcher-company">{companyData.name}</span>
        {/* <div className='switcher-drop'><FontAwesomeIcon icon="edit" /></div>  */}
        {this.state.dropdownVisible && <div className="switcher-dropdown">{this.renderDropdownOptions()}</div>}
      </StyledSwitcher>
    );
  }
}

const StyledSwitcher = styled.div`
  background: white;
  padding: 0.25em 1em;
  margin-right: 1em;
  color: black;
  border-radius: 0.5em;
  font-size: 14px;
  cursor: pointer;
  user-select: none;

  .switcher-drop {
    display: inline-block;
    color: grey;
    margin-left: 0.5em;
  }

  .switcher-dropdown {
    position: absolute;
    background-color: #f1f1f1;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;

    a {
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
    }
  }
`;

const mapStateToProps = function (state: AppState) {
  return {
    user: state.user,
  };
};

let component = onClickOutside(CompanySwitcher);
component = connect(mapStateToProps, null)(component);

export default component;
