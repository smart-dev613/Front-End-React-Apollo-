import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, compose } from "redux";
import { showModal } from "../../store/modal/action";
import { ShowModal } from "../../store/modal/types";

import { getAllEventContents } from "../../providers/events";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppState } from "../../store/root";
import { UIState } from "../../store/ui/types";
import { UserState, ListData } from "../../store/user/types";
import { setCurrentPage } from "../../store/ui/action";
import ListFormat from "./ListFormat";
import casestudy from "../../assets/images/casestudy.png";
import whitepaper from "../../assets/images/whitepaper.png";
import ApolloClient from "apollo-client";
import Button from "../Form/Button";
import { GET_EVENT_INFO } from "../../gql/queries";
import { userIsOrganiser } from "../../util/common";
import { withApollo } from "react-apollo";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import SearchComponent from "./SearchComponent";

interface EventsListProps {
  ui: UIState;
  user: UserState;
}

interface DispatchProps {
  setCurrentPage: any;
  getBrandingColour: any;
  showModal: any;
  client: ApolloClient<any>;
  showSearch: boolean;
}

interface MyItem {
  id: number;
  Name: string;
  Img: string;
  Introduction: string;
  Keywords?: string[];
  type: string;
}

interface EventsListState {
  filter: string;
  eventsArray: ListData[];
  organiser: object;
}

type Props = EventsListProps & DispatchProps;

class EventsList extends Component<Props, EventsListState> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      filter: "",
      eventsArray: [],
      organiser: {},
    };

    this.addNewContent = this.addNewContent.bind(this);
    this.getArticles = this.getArticles.bind(this);
  }

  public componentDidMount() {
    this.props.setCurrentPage("Content");

    const { eventId, organiser } = this.props.client.readQuery({
      query: GET_EVENT_INFO,
    });
    this.setState({
      organiser,
    });

    this.getArticles(eventId);
  }

  public getArticles(eventId: string) {
    getAllEventContents(eventId)
      .then((response: any) => {
        let contents = [];
        if (response.data && response.data.getAllEventContents) {
          contents = response.data.getAllEventContents.contents.map(
            (content: any) => {
              return {
                ...content,
                id: content.id,
                logoUrl: content.imageURL,
                bio: content.body,
                linkURL: content.linkURL,
                keywords: content.keywords ? content.keywords : [],
                name: content.name,
                type: "content",
                pricing: content.pricing,
                links: content.links,
                images: content.images
              };
            }
          );
        }
        contents.reverse();
        this.setState({
          eventsArray: contents,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  private truncateText = (str: string) => {
    if (str.length > 140) return str.substring(0, 140) + " ...";
    else return str;
  };

  private handleChange = (event: any) => {
    this.setState({ filter: event.target.value });
  };
  
  public addNewContent() {
    // this.props.showModal( 'NEW_CONTENT', 'lg', null, null, {
    //   callback: (eventId: any) => {
    //     this.getArticles(eventId)
    //   }
    // })
    this.props.showModal( 'NEW_CONTENT_ITEM', 'lg', null, null, {
      props: {
        loadEvents: this.getArticles
      }
    })
  }

  public render() {
    if (Object.keys(this.state.organiser).length === 0) return null;
    let isOrganiser = userIsOrganiser(this.props.user, this.state.organiser);

    const filter = this.state.filter;
    const data = this.state.eventsArray;
    const lowercasedFilter = filter.toLowerCase();

    const filteredData = data.filter((item) => {
      let keywordMatch:string[] = []
      if (item.keywords) {
        keywordMatch = item.keywords.filter((keyword) => {
          if (keyword.toLowerCase().includes(lowercasedFilter)) {
            return keyword;
          }
        });
      }

      if (item.name.toLowerCase().includes(lowercasedFilter) || keywordMatch.length > 0) {
        return item;
      }
    });
    // || item.Keywords.map(v => v.toLowerCase()).toString().includes(lowercasedFilter)
    return (
      <StyledList className="main-container container-fluid page-container py-4">
        {this.props.showSearch ? (
          <SearchComponent
            filter={filter}
            click={this.handleChange}
            placeholder="Event name, keyword..."
          />
        ) : null}

        <div className="content-admin">
          {/* <h3 className="page-title">{this.props.ui.page}</h3> */}
          {isOrganiser && <button
            className="btn-edit btn-purple btn"
            onClick={this.addNewContent}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>}

          {/* <button
                            type="submit"
                            className="btn-edit btn btn-primary"
                            onClick={this.addNewContent}
                          >
                            <FontAwesomeIcon
                              icon="pencil-alt"
                            />
                          </button> */}
        </div>

        {filteredData.map((list) => (
          <ListFormat
            key={list.id}
            type="content"
            ListData={list}
            truncateText={this.truncateText}
            loadEvents={this.getArticles}
          />
        ))}
      </StyledList>
    );
  }
}
const StyledList = styled.div`
  .page-title {
    margin-top: 10px;
  }

  .content-admin {
    margin: 1em 1em 0 1em;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .btn-purple {
      color: white;
      height: 40px;
      border: none;
      transition: ease-in-out 200ms;

      &:hover {
        background: #a47ead;
        transition: ease-in-out 200ms;
      }
    }
  }

  .inner {
    height: 380px;
    max-height: 400px;
    padding-bottom: 5px;
    overflow: hidden;
  }

  .desc {
    overflow: hidden;
  }
  @media screen and (max-width: 576px) {
    .page-title {
      font-size: large;
    }
  }
`;

const mapStateToProps = (state: AppState) => ({
  ui: state.ui,
  user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      setCurrentPage,
      showModal,
    },
    dispatch
  );
};

export default compose(
  withApollo,
  connect(mapStateToProps, mapDispatchToProps)
)(EventsList);
