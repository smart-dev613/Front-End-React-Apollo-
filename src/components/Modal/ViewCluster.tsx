import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, compose } from 'redux'
import { closeCurrentModal } from '../../store/modal/action'
import { setLoadingOverlay } from '../../store/ui/action'
import Table  from '../pages/_shared/Table';


import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Select from '../Form/Select';

import { Translation } from 'react-i18next'
import { withApollo } from 'react-apollo'
import ApolloClient from 'apollo-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faTimes,
    faTrash
  } from '@fortawesome/free-solid-svg-icons';


interface StateProps {
  user: any;
  ui: any;
  client: ApolloClient<any>
  clicked: string
  info: any
}

interface DispatchProps {
  closeCurrentModal: (type: string) => void
  setLoadingOverlay: (loading: boolean) => void
}

type Props = DispatchProps & StateProps

interface ViewClusterState {
  selectedSubCluster: any,
  members: any[]
}

export const columns = [
    // {
    //   name: 'Order Id',
    //   dataIndex: 'order',
    //   accessor: 'order',
    //   sortFilter: true,
    //   isSearchFilter: true
    // },
    {
      name: 'First Name',
      dataIndex: 'firstName',
      accessor: 'firstName',
      width: "100%",
      thClass: "text-left",
      tdClass: "text-left",
      sortFilter: true,
      isSearchFilter: true
    },
    {
      name: 'Last Name',
      dataIndex: 'lastName',
      accessor: 'lastName',
      thClass: "text-left",
      tdClass: "text-left",
      width: "100%",
      sortFilter: true,
     
    },
    {
      name: 'Email',
      dataIndex: 'email',
      accessor: 'email',
      thClass: "text-left",
      tdClass: "text-left",
      width: "100%",
      sortFilter: true,
     
    }
  ]
  



class ViewCluster extends Component<Props, ViewClusterState> {

    constructor(props: Props) {
        super(props);
        
        this.state ={
            selectedSubCluster: {value: "ALL", label: "All"},
            members: []
        };
    }

    componentDidMount(): void {

        const { cluster } = this.props.info?.additionalData
        this.setState({
            members: cluster.users
        })

    }

    removeMember = () => {
        console.log("removing..")
        
    }

    closeModal = () => {

        this.props.closeCurrentModal('VIEW_CLUSTER')
    }
    configColumns = () => {
        return [
          ...columns,
          {
            Header: 'Action',
            name: 'Action',
            sortFilter: false,
            accessor:  (record: any) => (
                <button className="btn btn-danger cart-btn-qr" onClick={() => this.removeMember()} style={{fontSize: '1.5rem'}} >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            ),
          },
          // {
          //   name: 'Refund',
          //   Header: 'refund',
          //   accessor: (record: any) => <FontAwesomeIcon style = {{cursor:"pointer", color:"rgb(164, 137, 172)", transform: 'scaleX(-1)'}} icon={faRedo} size={"lg"} />
          // }
        ]
      }

  
  public render() {
    const { cluster } = this.props.info?.additionalData
    const subClusters = cluster?.subClusters ? cluster?.subClusters?.map(subCluster => {
        return {value: subCluster.id, label: subCluster.name}
    }) : []

    return (
      <Translation>
        {
          () =>
            <StyledQrCodeModal className='modal-content'>
                <div className='modal-header'>
                    <h4>
                    Cluster : {cluster?.name}
                    </h4>
                    <div style={{ display: 'flex', gap: 10 }}>
                    {/* <button type="submit" className="btn btn-purple btn-edit">
                        <FontAwesomeIcon icon={faTimes} />
                    </button> */}
                    <button type="button" className="btn btn-red" onClick={() => this.closeModal()}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                </div>
                <div className="modal-body">
                   { subClusters.length ? (

                        <div className="d-flex justify-content-center py-4">
                        <div className="col-md-6 col-sm-6">
                        <div className="row">
                            <div className="col-md-3 col-sm-12 px-0">
                                <Label labelFor={"subcluster"} labelCol={"col-md-12"}>
                                    Sub Cluster
                                </Label>
                            </div>
                                <div className="col-md-9 col-sm-12">
                                    <Select
                                        id={"clusterName"}
                                        name={'subCluster'}
                                        addClassName={'p-0 col-md-12 col-sm-12"'}
                                        type={"text"}
                                        defaultValue={{value: "ALL", label: "All"}}
                                        onChange={(selectedItem) => {
                                            if(selectedItem?.value == "ALL"){
                                                this.setState(
                                                    { selectedSubCluster: {value: "ALL", label: "All"},
                                                    members: cluster?.users?.length ? cluster?.users : []
                                                    }
                                                )
                                            } else {
                                                let subCluster = cluster?.subClusters?.find(subCluster => subCluster?.id === selectedItem?.value)
                                                if(subCluster){

                                                    this.setState(
                                                        { selectedSubCluster: selectedItem,
                                                        members: subCluster?.users?.length ? subCluster?.users : []
                                                        }
                                                    )
                                                }

                                            }
                                        
                                        }}
                                        value={this.state.selectedSubCluster}
                                        options={[{value: "ALL", label: "All"}, ...subClusters]}
                                        placeholder={"---Select subcluster---"}
                                    
                                    />
                                </div>
                            </div>
                        </div>
                        </div>
                                            
                   ) : "" }
                   

                    {this.state.members?.length ? (
                        <Table
                            columns={this.configColumns()}
                            data={this.state.members || []}
                            className='table table-design table-hover'
                        />
                    ): (
                        <p className='text-center'>No data</p>
                    )}
                    
                    
                </div>
              
            </StyledQrCodeModal>
        }
      </Translation>
    )
  }
}

const StyledQrCodeModal = styled.div`
  @media (max-width: 768px) {
    .wrap {
      flex-wrap: wrap-reverse;
    }
  }

  .modal-header {
    border-bottom: none;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  #venueOptions {
    margin-top: 1em;
    width: 50%;
  }

  .display {
    display: inline;
  }

  .space {
    border: 1px solid #ced4da;
    padding: 1% 3%;
  }

  .display {
    display: inline;
    margin: 0 5px;
  }
`

const mapStateToProps = function (state: any) {
  return {
    ui: state.ui,
    user: state.user,
    selectedSubCluster: state.selectedSubCluster
  }
}

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators({
    closeCurrentModal,
    setLoadingOverlay
  }, dispatch)
}

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(ViewCluster)
