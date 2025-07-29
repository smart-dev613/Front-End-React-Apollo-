import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { closeCurrentModal } from '../../store/modal/action'
import { setLoadingOverlay, errorHandlerGeneral } from '../../store/ui/action'
import styled from 'styled-components'
import autobind from 'auto-bind/react'
// import { ReactComponent as CrossSvg } from '../../assets/images/svg/cross.svg'
// import { ReactComponent as CheckSvg } from '../../assets/images/svg/check.svg'
import CrossSvg from '../IconComponents/Cross'
import CheckSvg from '../IconComponents/Check'

import Input from '../Form/Input'
import { switchCompany } from '../../providers/user'
import { getCompaniesBySearchtermGQL } from '../../providers/admin'

interface CompanySwitchMasterModalProps {
  closeCurrentModal: any;
  setLoadingOverlay: any;
  errorHandlerGeneral: any;
  info: any;
}

interface CompanySwitchMasterModalState {
  selectedCompany: any;
  searchTerm: any;
  searching: boolean;
  isSearching: boolean;
  nullSearchRecords: boolean;
  matchingCompanies: any[];
  error: any;
  campaignData?: any;
  searchData?: any;
  event: any;
}

let timeout: any = null

class CompanySwitchMasterModalContent extends Component<CompanySwitchMasterModalProps, CompanySwitchMasterModalState> {
  public constructor (props: CompanySwitchMasterModalProps) {
    super(props)

    this.state = {
      selectedCompany: {},
      searchTerm: '',
      searching: false,
      isSearching: false,
      nullSearchRecords: false,
      matchingCompanies: [],
      event: {},
      error: ''
    }
    autobind(this)
  }



  public handleSubmit () {
    this.props.setLoadingOverlay(true)

    switchCompany(this.state.selectedCompany._id, this.state.selectedCompany.id,  this.props.info?.additionalData?.event?.id)
      .then((result: any) => {
        if (result.data === null || !Object.keys(result.data)) {
          this.setState({
            error: result.errors[0].message
          })
          this.props.setLoadingOverlay(false)
        } else {
          this.props.setLoadingOverlay(false)
           window.location.reload() // TODO: change this to update the User redux state with new session info without refreshing, this is a bandaid solution
        }
      })
      .catch(err => {
        this.props.errorHandlerGeneral(err)
        this.props.setLoadingOverlay(false)
      })
  }

  public closeModal () {
    this.props.closeCurrentModal('COMPANY_SWITCH_MASTER')
  }

  public searchChanging (e: any) {
    if (this.state.isSearching || (e.target.value === this.state.searchTerm)) {
      e.target.value = this.state.searchTerm
    } else {
      this.setState({ searchTerm: e.target.value })
    }
  }

  public searchChange (e: any) {
    if (!this.state.searchTerm) return
    if (!this.state.isSearching && (e.key !== 'Enter')) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.getAdminCompanies()
      }, 300)
    }
  }

  public handleCompanyClick (_id: any, id: any) {
    this.setState({
      selectedCompany: {
        _id,
        id
      },
      error: ''
    })
  }

  public getAdminCompanies () {
    let searchTerm = this.state.searchTerm.replace(/  +/g, ' ').replace(/-+/g, ' ')
    if (searchTerm.length >= 2) {
      this.setState({ nullSearchRecords: false, error: '', selectedCompany: {}, isSearching: true })
      getCompaniesBySearchtermGQL(searchTerm)
        .then((result: any) => {
          this.setState({ searching: true, isSearching: false })
          if (!result.data) {
            this.setState({ nullSearchRecords: true })
          } else {
            this.setState({ matchingCompanies: result.data.getCompanyBySearch })
          }
        })
        .catch((err: any) => {
          this.props.errorHandlerGeneral(err)
          this.setState({ isSearching: false })
        })
    } else if (!this.state.searchTerm.length) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(
            this.setState({ campaignData: this.state.searchData, searching: false })
          )
        }, 1000)
      })
        .then(() => {
        })
        .catch(err => {
          this.props.errorHandlerGeneral(err)
        })
    }
  }

  public render () {
    return (
      <StyledCompanySwitchMasterModalContent className='modal-content'>
        <div className='modal-header'>
          <h5 className='modal-title'>
            Switch Company
          </h5>
          <div>
            <CheckSvg 
              width='40px'
              height='40px'
              className='p-2 rounded'
              color='whitesmoke'
              // disabled={Object.keys(this.state.selectedCompany).length === 0} 
              onClick={this.handleSubmit} 
              style={{ backgroundColor: '#a489ac', cursor: 'pointer' }}

            />
            <CrossSvg 
              width='40px' 
              height='40px' 
              className='p-2 rounded' 
              color='whitesmoke' 
              onClick={this.closeModal} 
              style={{ backgroundColor: '#ed1c24', cursor: 'pointer', marginLeft: "8px" }} 
            />
          </div>

        </div>
        <div className='modal-body'>
          <p>You have master access and can switch to any company. Please search for a company below.</p>
          <p><strong>Note: The search is case sensitive.</strong></p>
          <Input
            onChange={this.searchChanging}
            onKeyUp={this.searchChange}
            type='text'
            name='companySearch'
            colSize='12'
            id='companySearch'
            value={this.state.searchTerm}
            placeholder='Search...'
            addClassName='company-search-bar mb-2'
          />
          <StyledCompanySwitchList className='list-group'>
            {
              this.state.matchingCompanies.length
                ? this.state.matchingCompanies.map(company => {
                  return (
                    <a className={'list-group-item list-group-item-action d-flex justify-content-between align-items-center' + ((this.state.selectedCompany && this.state.selectedCompany._id === company._id) ? ' selectedCompany' : '')} key={company._id} onClick={() => this.handleCompanyClick(company._id, company.id)}>
                      <h6>{company.name}</h6>
                    </a>
                  )
                })
                : <div />
            }
          </StyledCompanySwitchList>
          {this.state.error ? <span style={{ color: 'red' }}>{this.state.error}</span> : ''}
        </div>
       
      </StyledCompanySwitchMasterModalContent>
    )
  }
}

const StyledCompanySwitchList = styled.div`
  h6 {
    margin-bottom: 0px;
  }
  overflow-y: auto;
  max-height: 100%;
  a.list-group-item {
    cursor: pointer;

    div.badge-area {
      span.badge {
        width: 6em;
      }
      span.badge:not(:last-child) {
        margin-right: 5px;
      }
    }
  }

  .selectedCompany {
    background-color: #f5e9d3;
  }
`

const StyledCompanySwitchMasterModalContent = styled.div`
  .badge {
    line-height: 1.75;
  }
`

const mapDispatchToProps = function (dispatch: any) {
  return bindActionCreators({
    closeCurrentModal,
    setLoadingOverlay,
    errorHandlerGeneral,
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(CompanySwitchMasterModalContent)
