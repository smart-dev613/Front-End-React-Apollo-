import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, compose } from 'redux'

import { AppState } from '../../store/root'
import { UIState } from '../../store/ui/types'
import { UserState } from '../../store/user/types'
import { setCurrentPage } from '../../store/ui/action'
import SearchComponent from './SearchComponent'
/*import Company from './Company'*/
import ListFormat from './ListFormat'
import { withApollo } from 'react-apollo'
import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'
import { GET_EVENT_INFO } from '../../gql/queries'
import { getEventCompanies } from '../../providers/events'
import { getCompany } from '../../providers/company'

interface MyItem {
  id: number
  name: string
  logoUrl: string
  profileEn: {
    bio: string,
    keywords: string[]
  }
}

interface CompaniesState {
  filter: string
  companiesArray: MyItem[]
  requiredItem: number
}

interface CompaniesProps {
  ui: UIState
  user: UserState
  client: ApolloClient<any>
  showSearch: boolean
}

interface DispatchProps {
  setCurrentPage: any,
  getBrandingColour: any,

}

type Props = CompaniesProps & DispatchProps

class Companies extends Component<Props, CompaniesState> {

  public constructor(props: Props){
    super(props)
    this.state = {
      filter: '',
      companiesArray: [
        // {id:1, Name:'Google', Img: 'https://images.theconversation.com/files/93616/original/image-20150902-6700-t2axrz.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1000&fit=clip', Introduction: `Google LLC is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware.`, Keywords:['#Microsoft1','#Office', '#MS Defender', '#Washington','#Meet', '#MS Tools']},
        // {id:2, Name:'Inspired', Img: 'https://www.inspired-mobile.com/77f83838fd8fe51741d15ff025755c88.png', Introduction: `Inspired is a GDPR compliant digital marketing platform that can help you reach, engage and manage your customers. All via one login!`, Keywords:['#Microsoft2','#Office', '#MS Defender', '#Washington','#Meet', '#MS Tools']},
        // {id:3, Name:'Facebook', Img: 'https://www.facebook.com/images/fb_icon_325x325.png', Introduction: `Facebook is the world's biggest social networking site, with a reach of millions upon millions of readers.`, Keywords:['#Microsoft3','#Office', '#MS Defender', '#Washington','#Meet', '#MS Tools']},
        // {id:4, Name:'McLaren', Img:'https://upload.wikimedia.org/wikipedia/en/thumb/f/f0/McLaren-Group-Logo.svg/440px-McLaren-Group-Logo.svg.png', Introduction: `McLaren Automotive (formerly known as McLaren Cars) is a British automotive manufacturer based in Woking, Surrey. The main products of the company are supercars, which are produced in-house in designated production facilities.`, Keywords:['#Microsoft4','#Office', '#MS Defender', '#Washington','#Meet', '#MS Tools']}
      ],
      requiredItem: 0
      //Keywords:['#Microsoft','#Office', '#MS Defender', '#Washington','#Meet', '#MS Tools']
    }
  }

  public componentDidMount(){
    this.props.setCurrentPage('Companies')
    
    const {eventId} = this.props.client.readQuery({query: GET_EVENT_INFO})

    let companies: MyItem[] = []

    getEventCompanies(eventId)
      .then((response: any) => {
        if (response.data && response.data.getEventCompanies) {
          if (response.data.getEventCompanies.length > 0) { 
            companies = [...response.data.getEventCompanies] 
          }
          this.setState({
            companiesArray: companies
          })
          return 
        }
      })
      .catch(err => {
        console.error(err)
      })
  }

  private updateCompanies = (index : number,data : any) => {
    let companies = [...this.state.companiesArray]
    let targetCompany : any = companies[index];

    targetCompany.profiles = data.getCompanyById.companies[0].profiles;
    
    this.setState({
      companiesArray: companies
    })

  }
  private handleChange = (event: any) => {
    this.setState({ filter: event.target.value })
  }

  private truncateText = (str: string) => {
    if (str.length > 140)
      return str.substring(0,140) + ' ...'
    else
      return str
  }

  public render () {
    // console.log('this.pr786', this.props)
    const filter = this.state.filter
    const data = this.state.companiesArray
    const requiredItem = this.state.requiredItem
    const modalData = data[requiredItem]
    const lowercasedFilter = filter.toLowerCase()
    const filteredData = data.filter((item) => {
      if(item.name.toLowerCase().includes(lowercasedFilter) ||  (item.profileEn  ? item.profileEn.keywords.length > 0 ? item.profileEn.keywords.map(v => v.toLowerCase()).toString().includes(lowercasedFilter) : '' : '')){
        return item
      }
    })
    
    return (
      <StyledList className='main-container  container-fluid page-container py-4'>
        {this.props.showSearch ? <SearchComponent filter={filter} click={this.handleChange} placeholder='Company name, keyword...'/> : null}
        {/* <h3 className='page-title'>{this.props.ui.page}</h3> */}
        
        
        {filteredData.map(list => (
          // <Link to={'/company/'+ list.id} key={list.id} style={{ textDecoration: 'none' }} >
          <ListFormat type='company' key={list.id} ListData={list} truncateText={this.truncateText} />
          // </Link>
        ))}
        {/* 
        <OrganizationDetails
          title={modalData.Name}
          intro={modalData.Introduction}
          Img={modalData.Img}
          // saveModalDetails={this.saveModalDetails}
          />
          onClick={this.openCompanyDetails.bind(this, index)} */}
      
      </StyledList>
    )
  }
}

const StyledList = styled.div`
  .inner {
    height: 380px;
    max-height: 400px;
    padding-bottom: 5px;
    overflow: hidden;
  }

  .desc {
    overflow: hidden;
  }
@media screen and (max-width:576px){
   .page-title {
      font-size:large;
    }
  }
`

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  ui: state.ui
})

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    setCurrentPage
  },
  dispatch
  )
}

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(Companies)