import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, compose } from "redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppState } from "../store/root";
import { UIState } from "../store/ui/types";
import { UserState } from "../store/user/types";
import { getCompaniesDetails } from "../store/user/action";
import KeywordList from "./pages/KeywordList";
import { Link } from "react-router-dom";
import { withApollo } from "react-apollo";
import ApolloClient from "apollo-client";  
import { userIsOrganiser } from "../util/common";
import whitepaper from "../assets/images/whitepaper.png";
import { faCartPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import Form from "../components/Form/Form";
import FormGroup from "../components/Form/FormGroup";
import FormRow from "../components/Form/FormRow";
import Label from "../components/Form/Label";
import Input from "../components/Form/Input";
import Button from "../components/Form/Button";
import Textarea from "../components/Form/Textarea";
import { GET_EVENT_INFO } from "../gql/queries";
import { closeCurrentModal } from "../store/modal/action";
import { setLoadingOverlay } from "../store/ui/action";
import { updateContent } from "../providers/events";
import KeywordsContainer from "./Form/KeywordsContainer";
import { getAvatarUploadToken } from "../providers/user";
import { addContentToCart } from "../providers/pricing";
import { uploadPresignedS3 } from "../providers/core/common";
interface IntroductionObject {
  bio: string;
  keywords: string[];
}

interface CompanyProps {
  data: {
    name: string
    Introduction: string
    logoUrl: string
    type?: string
    Keywords?: string[]
    id: string
    [profileEn: string]: any
  },
  props?: {
    loadEvents?: (arg1: string) => void
  }
}




interface DetailsProps {
  detail: CompanyProps;
  getCompaniesDetails: any;
  client: ApolloClient<any>;
}

interface DispatchProps {
  ui: UIState;
  user: UserState;
  closeCurrentModal: (type: string) => void;
  setLoadingOverlay: (loading: boolean) => void;
}

interface CompanyState {
  Keywords: string[];
  title: string;
  Img: string;
  isEditing: boolean;
  name: string;
  body: string;
  imageurl: string;
  linkurl: string;
  formFieldErrors: string[];
  formErrorMsg: string;
  newKeyword: string;
  contentID: string;
  file: string;
  imagePreviewUrl: any;
  inputFile: File;
  eventId: string;
  logoURL: string;
  // isOrganiser: boolean
}

type Props = DetailsProps & DispatchProps;

class ContentItem extends Component<Props, CompanyState> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      isEditing: false,
      title: "",
      Img: "",
      Keywords: ["#events", "#marketing", "#artistic", "#design"],
      name: "",
      body: "",
      imageurl: "",
      linkurl: "",
      formFieldErrors: [],
      formErrorMsg: "",
      newKeyword: "",
      contentID: "",
      file: "",
      imagePreviewUrl: "",
      inputFile: null,
      eventId: "",
      logoURL: "",
    };

    this.cancelEdit = this.cancelEdit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.editMode = this.editMode.bind(this);
    this.handleKeywordChange = this.handleKeywordChange.bind(this);
    this.downloadLink = this.downloadLink.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  public componentDidMount() {
    const { eventId } = this.props.client.readQuery({ query: GET_EVENT_INFO });
    if (this.props.detail) {
      
      this.setState({
        name: this.props.detail.data.name,
        body: this.props.detail.data.bio,
        Keywords: this.props.detail.data.keywords,
        linkurl: this.props.detail.data.linkURL ? this.props.detail.data.linkURL : '',
        logoURL: this.props.detail.data.logoUrl ? this.props.detail.data.logoUrl : '',
        contentID: this.props.detail.data.id,
        eventId,
      });
    }
  }

  public closeModal() {
    this.props.closeCurrentModal("DATA_DETAIL_MODAL");
  }

  public inputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    e.persist();
    let keys = ["name", "imageurl", "linkurl", "body"];
    let target = Reflect.get(e, "target");

    let stateChange = {};

    keys.forEach((thisKey) => {
      if (Reflect.get(target, "id") === thisKey) {
        Reflect.set(stateChange, thisKey, Reflect.get(target, "value"));
      }
    });
    this.setState(stateChange);
  }
  // public componentDidMount () {
  //   const { user } = this.props
  //   let iteration = 0

  //   if (Object.keys(user.companyData).length > 0 && this.state.isOrganiser !== true && iteration === 0) {
  //     let isOrganiser = userIsOrganiser(user, getEvent.organiser)
  //     console.log('isOrganiser-content', isOrganiser)
  //     iteration++
  //     this.setState({
  //       isOrganiser: isOrganiser
  //     })
  //   }
  // }
  public cancelEdit() {
    this.setState({ isEditing: !this.state.isEditing });
  }

  public editMode() {
    if (this.state.isEditing) {
      this.setState({ isEditing: !this.state.isEditing });
    } else {
      this.setState({ isEditing: !this.state.isEditing });
    }
  }

  public downloadLink() {
    window.open(this.state.linkurl, "_blank");
  }

  public async addToCart () {
    try {
      const { eventId } = this.props.client.readQuery({ query: GET_EVENT_INFO });
      await addContentToCart({
        eventId,
        itemId: this.state.contentID,
        priceId: this.props.detail.data.pricing?.id
      });
      alert('Item added to cart');
      this.closeModal();
    } catch (error) {
    }
  }

  public handleSubmit(e: React.MouseEvent | React.FormEvent) {
    const { eventId } = this.props.client.readQuery({ query: GET_EVENT_INFO });
    // this.setState({ isEditing: !this.state.isEditing })
    e.preventDefault();
    this.props.setLoadingOverlay(true);

    let formData = {
      contentId: this.state.contentID,
      eventId,
      name: this.state.name,
      body: this.state.body,
      imageURL: this.state.logoURL,
      linkURL: this.state.linkurl,
      keywords: this.state.Keywords,
    };
    let errorArr = [];

    // form validation
    if (!formData.name) errorArr.push("name"); // everything else is optional except name

    this.setState({ formFieldErrors: errorArr, formErrorMsg: null }, () => {
      if (this.state.formFieldErrors.length >= 1) {
        this.setState(
          { formErrorMsg: "Please complete the missing fields" },
          () => this.props.setLoadingOverlay(false)
        );
      } else {
        updateContent(formData)
          .then((result: any) => {
            this.props.detail.props.loadEvents(eventId);
            this.closeModal();
            this.props.setLoadingOverlay(false);
            // this.closeModal()
            this.props.setLoadingOverlay(false)
            // this.props.info.additionalData.loadArticles(eventId)
          })
          .catch((err: any) => {
            if (err instanceof DOMException) {
              this.props.setLoadingOverlay(false);
            } else {
              this.props.setLoadingOverlay(false);
            }
          });
      }
    });
  }

  public handleKeywordChange(keywords: string[]) {
    this.setState({
      Keywords: keywords,
    });
  }

  public removeImage(e: any) {
    e.preventDefault();
    this.setState({
      file: "",
      imagePreviewUrl: "",
      inputFile: null,
    });
  }

  public handleImageChange(e: any) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      // console.log('file', file)

      this.setState(
        {
          file: file,
          imagePreviewUrl: reader.result,
          inputFile: file,
        },
        () => this.handleFileUpload(file)
      );
    };
    reader.readAsDataURL(file);
  }

  public handleFileUpload(files: FileList | null) {
    if (files === null) return;

    // use first file
    const file = files[0];

    // this.props.setLoadingOverlay(true)
    const key = file.name
    getAvatarUploadToken(this.state.eventId, key)
      .then((result: any) => {
        if (result.data.getS3POSTUploadToken) {
          const data = result.data.getS3POSTUploadToken;

          // construct the FormData manually for sending to S3
          const formData = new FormData();
          // formData.append('Content-Type', file.type)
          formData.append("Content-Type", this.state.inputFile.type);

          // add all the required presigned fields
          Object.entries(data.fields).forEach(([k, v]) => {
            formData.append(k, v as any);
          });

          // add the object key in the bucket (lbi-avatars/USER_ID/image.png)
          // @ts-ignore
          formData.append(
            "key",
            `event-logo/${this.state.eventId}/${this.state.inputFile.name}`
          );

          // ACL must be public read
          formData.append("acl", "public-read");

          // and finally add the file itself (this should be last)
          formData.append("file", this.state.inputFile);

          return uploadPresignedS3(data.url, file).then((res: any) => {
            if (res.status !== 204) {
              // TODO: show nice error to user
              console.error("File could not be uploaded to S3");
            } else {
              let previewUrl = `https://user-assets.synkd.life/event-logo/${this.state.eventId}/${this.state.inputFile.name}`;
              if (previewUrl) {
                this.setState({
                  imagePreviewUrl: previewUrl,
                  logoURL: previewUrl,
                });
              }
              // const updatedEmployee = {
              //   ...this.state.employee,
              //   // @ts-ignore
              //   avatar: `https://user-assets.synkd.life/lbi-avatars/${this.props.match.params.employeeId}/${file.name}`
              // }
              // this.setState({
              //   employee:updatedEmployee
              // })
              // TODO: update in the database otherwise this won't persist after a refresh
              // TODO: CloudFront (CDN) purging/cache control for files with the same name
            }
          });
        } else {
          alert("Error getting upload token for avatar upload");
        }
      })
      .catch((err: any) => {
        console.error(err);
      });
  }

  public render() {
    const logoUrl = this.state.logoURL
      ? this.state.logoURL
      : this.props.detail.data.logoUrl;
    return (
      <StyledContentModal className="container-fluid">
        <div className="header-button-container">
          {this.state.isEditing ? (
            <button
              type="submit"
              className="btn btn-primary btn-tick"
              onClick={this.handleSubmit}
            >
              <FontAwesomeIcon icon="check" />
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary btn-edit"
              onClick={this.editMode}
            >
              <FontAwesomeIcon icon="pencil-alt" />
            </button>
          )}
          {/* {
            this.props.detail.data["pricing"] && (
              <button
                type="submit"
                className="btn btn-primary btn-tick"
                onClick={() => this.addToCart()}
              >
                <FontAwesomeIcon icon={faCartPlus} />
              </button>
            )
          } */}
        </div>

        {!this.state.isEditing ? (
          <div>
            <div className="image-title-container">
              <div className="company-image-container">
                <label htmlFor="file-input">
                  <img
                    className="company-image"
                    alt="logo"
                    src={logoUrl ? logoUrl : ''}
                    onClick={this.downloadLink}
                  />
                </label>
              </div>
              <h5>{this.props.detail.data.name} </h5>
            </div>
            {this.props.detail.data["bio"] ? (
              <div className="company-description">
                {this.props.detail.data["bio"]}{" "}
              </div>
            ) : (
              ""
            )}

            <div className="keywords">
              {this.state.Keywords.length > 0 ? (
                <KeywordList Keywords={this.state.Keywords} isModal = {true}/>
              ) : (
                ["No keywords provided"]
              )}
            </div>

            {this.props.detail.data["linkURL"] ? (
              <div className="actionLinks">
                <Button
                  text="Download"
                  addClassName="btn-success"
                  onClick={this.downloadLink}
                />
              </div>
            ) : (
              ""
            )}

            {this.props.detail.data["pricing"] && this.props.detail.data.pricing?.map((pricing: any) =>
              <div className="pricing" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex' }}>
                  <input type="text" disabled value={pricing.currency} style={{width: '50%'}} />
                  <input type="text" disabled value={pricing.price} style={{width: '50%'}} />
                </div>
                <div style={{ display: 'flex' }}>
                  <input type="text" disabled value={pricing.employee.map((item: any) => item.email).join(',')} style={{width: '50%'}} />
                  <input type="text" disabled value={pricing.duration} style={{width: '50%'}} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <Form
            id="NewCompany"
            addClassName="newCompany"
            onSubmit={this.handleSubmit}
          >
            <div className="image-title-container image-title-container-edit">
              <div className="company-image-container">
                <label htmlFor="file-input">
                  <img
                    className="company-image"
                    alt="logo"
                    src={logoUrl ? logoUrl : whitepaper}
                  />
                  <button className="btn" onClick={(e) => this.removeImage(e)}>
                    <FontAwesomeIcon icon="times" />
                  </button>
                </label>
                {/* <input id="file-input"
                    type="file"
                    style={{ display: "none" }} /> */}
                <input
                  id="file-input"
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => this.handleImageChange(e)}
                  disabled={!this.state.isEditing}
                />
              </div>
              <Input
                onChange={(e) => this.inputChange(e)}
                id="name"
                name="name"
                type="text"
                placeholder="Title"
                aria-label="content name"
                inputValue={this.state.name}
                fieldError={this.state.formFieldErrors.includes("name")}
                addClassName={this.state.isEditing ? "editInput" : ""}
              />
            </div>
            <div className="description-container-edit">
              <Label labelFor="body">
                Descriptiondsfkjsdfjk
              </Label>
              <Textarea
                name="body"
                id="body"
                value={this.state.body}
                onChange={(e) => this.inputChange(e)}
                fieldError={this.state.formFieldErrors.includes("body")}
                addClass={this.state.isEditing ? "editInput" : ""}
              />
            </div>
                <div className="description-container-edit">
                  <Label labelFor="linkurl">
                    Download URL
                  </Label>
                  <Input
                    onChange={(e) => this.inputChange(e)}
                    id="linkurl"
                    name="linkurl"
                    type="text"
                    inputValue={this.state.linkurl}
                    fieldError={this.state.formFieldErrors.includes("linkurl")}
                    addClassName={this.state.isEditing ? "editInput" : ""}
                  />
                </div>
            <FormRow>
              <FormGroup>
                <KeywordsContainer
                  isEditing={this.state.isEditing}
                  keywords={this.state.Keywords}
                  handleKeywordChange={this.handleKeywordChange}
                />
              </FormGroup>
            </FormRow>

            {this.props.detail.data["pricing"] && this.props.detail.data.pricing?.map((pricing: any) =>
              <div className="pricing" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex' }}>
                  <input type="text" disabled value={pricing.currency} style={{width: '50%'}} />
                  <input type="text" disabled value={pricing.price} style={{width: '50%'}} />
                </div>
                <div style={{ display: 'flex' }}>
                  <input type="text" disabled value={pricing.employee.map((item: any) => item.email).join(',')} style={{width: '50%'}} />
                  <input type="text" disabled value={pricing.duration} style={{width: '50%'}} />
                </div>
              </div>
            )}
          </Form>
        )}
        {/* <button className='download-icon'>Download</button> <button className='share-icon'>Share</button> */}
        {/* <span className='icon-download'><FontAwesomeIcon icon="download" title="Download" size='1x'/></span>
          <span><FontAwesomeIcon icon="share-alt" title="Share" size='1x'/></span> */}
      </StyledContentModal>
    );
  }
}

const StyledContentModal = styled.div`
  padding-bottom: 2em;

  .header-button-container {
    position: absolute;
    top: 0.77em;
    right: 2.2em;
    display: flex;
    justify-content: flex-end;
    gap: 0.5em;
    .btn {
      font-size: 22px;
      line-height: 2px;
      background: #a489ac;
      color: white;
      border: 0;
    }
    .btn-tick {
      padding: 0.2em 0.2em;
    }
    .btn-edit {
      padding: 0.225em;
    }
  }

  .image-title-container {
    display: flex;
    align-items: center;
    margin-bottom: 2em;
    .company-image-container {
      margin-right: 2em;
      .company-image {
        border: 1px solid lightgray;
        border-radius: 50%;
        width: 80px;
        height: 80px;
        object-fit: cover;
        cursor: pointer;
      }
    }
  }

  //To Fix: stop words from breaking at any character
  .company-description {
    margin-bottom: 2em;
    word-wrap: break-word;
  }

  .keywords {
    margin-bottom: 2em;
  }

  // EDITING STATE

  .image-title-container-edit {
    margin-top: 1em;
  }

  .description-container-edit {
    display: flex;
    align-items: center;
    gap: 1em;
    margin-bottom: 1em;
    label {
      min-width: 120px;
      padding-left: 0;
      padding-right: 0;
    }
    textarea {
      max-width: 70%;
    }
  }

  @media(max-width: 700px){
    .description-container-edit {
      flex-direction: column; 
      gap: .5em;
      label {
        padding: 0;
      }
      textarea { 
        max-width: 100%;
      }
    }
  }
`;

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  ui: state.ui,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      getCompaniesDetails,
      setLoadingOverlay,
      closeCurrentModal,
    },
    dispatch
  );
};

export default compose(
  withApollo,
  connect(mapStateToProps, mapDispatchToProps)
)(ContentItem);
