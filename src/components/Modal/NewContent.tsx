import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, compose } from "redux";
import { closeCurrentModal } from "../../store/modal/action";
import { setLoadingOverlay } from "../../store/ui/action";
// import { getAllCompanies } from '../../store/user/action'
import { newContent } from "../../providers/events";
// import { validateEmail } from '../../utils/helper'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Form from "../Form/Form";
import FormGroup from "../Form/FormGroup";
import FormRow from "../Form/FormRow";
import Input from "../Form/Input";
import Textarea from "../Form/Textarea";
import { Translation, Trans } from "react-i18next";
import { withApollo } from "react-apollo";
import ApolloClient from "apollo-client";
import { GET_EVENT_INFO } from "../../gql/queries";
import IMG from "../../../src/assets/images/whitepaper.png";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import KeywordsContainer from "../Form/KeywordsContainer";
import { getAvatarUploadToken } from "../../providers/user";
import { uploadPresignedS3 } from "../../providers/core/common";

interface DayData {
  day: string;
  date: string;
}

interface StateProps {
  client: ApolloClient<any>;
  clicked: string;
  info: {additionalData: AdditionalData};
  selectedDay: DayData;
}

interface AdditionalData {
  callback?: any;
  loadArticles: any
  additionalData: {
    venueDetails: {
      name: string,
      maxAttendees: number,
      id: string
    },
    loadVenues: () => void
    callback?: any
  },
}
interface DispatchProps {
  closeCurrentModal: (type: string) => void;
  setLoadingOverlay: (loading: boolean) => void;
}

type Props = DispatchProps & StateProps;

interface NewVenueState {
  name: string;
  body: string;
  imageurl: string;
  linkurl: string;
  formFieldErrors: string[];
  formErrorMsg: string;
  imagePreviewUrl: string | ArrayBuffer;
  isEditing: boolean;
  isHovering: boolean;
  Keywords: string[];
  file: string;
  inputFile: string | Blob;
  eventId: string;
  logoURL: string;
  inputErrors: {
    name: boolean;
    linkurl: boolean;
  };
}

class NewContent extends Component<Props, NewVenueState> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      name: "",
      body: "",
      imageurl: "",
      linkurl: "",
      formFieldErrors: [],
      formErrorMsg: "",
      imagePreviewUrl: "",
      isEditing: false,
      isHovering: false,
      Keywords: [],
      file: "",
      inputFile: "",
      eventId: "",
      logoURL: "",
      inputErrors: {
        name: false,
        linkurl: false,
      },
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleKeywordChange = this.handleKeywordChange.bind(this);
  }

  public handleSubmit(e: React.MouseEvent | React.FormEvent) {
    const { eventId } = this.props.client.readQuery({ query: GET_EVENT_INFO });

    e.preventDefault();
    this.props.setLoadingOverlay(true);
    let formData = {
      eventId,
      name: this.state.name,
      body: this.state.body,
      imageURL: this.state.imagePreviewUrl,
      linkURL: this.state.linkurl,
      keywords: this.state.Keywords,
    };
    let errorArr = [];

    // form validation
    if (!formData.name) {
      errorArr.push("name"); // everything else is optional except name
    }
    if (!this.checkUrlValidity(formData.linkURL)) {
      errorArr.push("linkurl");
    }

    this.setState({ formFieldErrors: errorArr, formErrorMsg: null }, () => {
      if (this.state.formFieldErrors.length >= 1) {
        this.setState(
          { formErrorMsg: "Please complete the missing fields" },
          () => this.props.setLoadingOverlay(false)
        );
      } else {
        newContent(formData)
          .then((result: any) => {
            this.closeModal();
            // this.props.info.additionalData.loadArticles(eventId);
            this.props.info.additionalData.callback && this.props.info.additionalData.callback(eventId);
            this.props.setLoadingOverlay(false);
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

  public handleKeywordChange(Keywords: string[]) {
    this.setState({
      Keywords,
    });
  }

  public handleImageChange(e: any) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
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
          // formData.append('Content-Type', this.state.inputFile.type)

          // add all the required presigned fields
          Object.entries(data.fields).forEach(([k, v]) => {
            formData.append(k, v as any);
          });

          // add the object key in the bucket (lbi-avatars/USER_ID/image.png)
          // @ts-ignore
          formData.append(
            "key",
            `event-logo/${this.state.eventId}/${this.state.inputFile}`
          );

          // ACL must be public read
          formData.append("acl", "public-read");

          // and finally add the file itself (this should be last)
          formData.append("file", this.state.inputFile);

          return uploadPresignedS3(data.url, formData).then((res: any) => {
            if (res.status !== 204) {
              // TODO: show nice error to user
              console.error("File could not be uploaded to S3");
            } else {
              // let previewUrl = `https://user-assets.synkd.life/event-logo/${this.state.eventId}/${this.state.inputFile.name}`
              let previewUrl = "";
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

  public closeModal() {
    this.props.closeCurrentModal("NEW_CONTENT");
  }

  public checkUrlValidity(url: string | undefined): boolean {
    if (!url) return true;

    return /^https?:\/\/.+/.test(url);
  }

  public inputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    e.persist();
    let keys = ["name", "imageurl", "linkurl", "body", "keywrds"];
    let target = Reflect.get(e, "target");

    let stateChange = {};

    if (Reflect.get(target, "id") === "name") {
      this.setState({
        inputErrors: {
          ...this.state.inputErrors,
          name: !Reflect.get(target, "value").length,
        },
      });
    }

    if (Reflect.get(target, "id") === "linkurl") {
      this.setState({
        inputErrors: {
          ...this.state.inputErrors,
          linkurl: !this.checkUrlValidity(Reflect.get(target, "value")),
        },
      });
    }

    keys.forEach((thisKey) => {
      if (Reflect.get(target, "id") === thisKey) {
        Reflect.set(stateChange, thisKey, Reflect.get(target, "value"));
      }
    });
    this.setState(stateChange);
  }

  public cancelEdit() {
    this.setState({ isEditing: !this.state.isEditing });
  }
  public handleSubmitEdit(e: React.MouseEvent | React.FormEvent) {
    this.props.setLoadingOverlay(true)
    if (this.state.isEditing) {
      this.setState({ isEditing: !this.state.isEditing })
    }
    const { eventId } = this.props.client.readQuery({ query: GET_EVENT_INFO });
    e.preventDefault();
    this.props.setLoadingOverlay(true);
    let formData = {
      eventId,
      name: this.state.name,
      body: this.state.body,  
      // imageURL: this.state.imagePreviewUrl,
      linkURL: this.state.linkurl,
      keywords: this.state.Keywords
    };
    let errorArr = [];
    // form validation
    if (!formData.name) errorArr.push("name"); // everything else is optional except name
    if (!this.checkUrlValidity(formData.linkURL)) {
      errorArr.push("linkurl");
    }
    this.setState({ formFieldErrors: errorArr, formErrorMsg: null }, () => {
      if (this.state.formFieldErrors.length >= 1) {
        this.setState(
          { formErrorMsg: "Please complete the missing fields" },
          () => this.props.setLoadingOverlay(false)
        );
      } else {
        newContent(formData)
          .then((result: any) => {
            this.closeModal();
            this.props.setLoadingOverlay(false);
            // this.props.info.additionalData.loadArticles(eventId);
            this.props.info.additionalData.callback && this.props.info.additionalData.callback(eventId);
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

  public _handleImageChange(e: any) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  }

  public render() {
    const { formFieldErrors, formErrorMsg } = this.state;
    return (
      <Translation>
        {() => (
          <StyledNewContentModal
            className="modal-content"
            isHovering={this.state.isHovering}
          >
            <div className="button-container">
              <button
                type="submit"
                className="btn btn-danger btn-close"
                onClick={this.closeModal}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <button
                type="submit"
                className="btn-primary btn-tick btn-purple btn"
                onClick={(this.handleSubmitEdit)}
              >
                <FontAwesomeIcon icon="check" />
              </button>
            </div>
            <Form id="NewCompany" onSubmit={this.handleSubmit}>
              <FormRow>
                <FormGroup>
                  <div className="image-title-container">
                    <div
                      className="image-container" 
                      onMouseEnter={() => this.setState({ isHovering: true })}
                      onMouseLeave={() => this.setState({ isHovering: false })}
                    >
                      <label htmlFor="imageurl">
                        <img
                          src={
                            this.state.imageurl === ""
                              ? IMG
                              : this.state.imageurl
                          }
                        ></img>
                      </label>
                      <input
                        className="fileInput"
                        onChange={(e) => this._handleImageChange(e)}
                        id="imageurl"
                        name="imageurl"
                        type="file"
                        value={this.state.imageurl}
                        style={{ display: "none" }}
                      />
                    </div>
                    <Input
                      aria-label="Content Name"
                      onChange={this.inputChange}
                      id="name"
                      placeholder="Title"
                      name="name"
                      type="text"
                      inputValue={this.state.name}
                      fieldError={formFieldErrors.includes("name")}
                    />
                    {this.state.inputErrors.name ? (
                      <span className={"errorField"}>Name is required</span>
                    ) : (
                      <div />
                    )}
                  </div>
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <Textarea
                    rows={3}
                    name="body"
                    id="body"
                    placeholder="Descriptionsssossosososososo"
                    aria-label="Description"
                    value={this.state.body}
                    onChange={this.inputChange}
                    fieldError={this.state.formFieldErrors.includes("body")}
                  />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <div className="url-input">
                    <Input
                      onChange={this.inputChange}
                      id="linkurl"
                      name="linkurl"
                      type="text"
                      placeholder="URL"
                      aria-label="URL"
                      inputValue={this.state.linkurl}
                      fieldError={formFieldErrors.includes("linkurl")}
                    />
                    {this.state.inputErrors.linkurl ? (
                      <span className={"errorField"}>Invalid Url</span>
                    ) : (
                      <div />
                    )}
                  </div>
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <KeywordsContainer
                    isEditing={true}
                    keywords={this.state.Keywords}
                    handleKeywordChange={this.handleKeywordChange}
                  />
                </FormGroup>
              </FormRow>
            </Form>
          </StyledNewContentModal>
        )}
      </Translation>
    );
  }
}

const StyledNewContentModal = styled.div<{ isHovering: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  padding: 1em;
  background: white;

  .button-container {
    display: flex;
    justify-content: flex-end;
    gap: 0.5em;
    .btn-tick {
      padding: 0.5em 0.55em;
      border: none;
    }
  }

  .image-title-container {
    display: flex;
    align-items: center;
    gap: 2em;
    width: 100%;
    margin-bottom: 2em;
    .image-container {
      margin-left: 1em;
      &::after {
        margin-left: 1em;
        padding: .5em;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0;
        left: 2%;
        content: "add image";
        width: 75px;
        height: 75px;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        font-size: 0.9rem;
        text-align: center;
        border-radius: 50%;
        pointer-events: none;
        opacity: ${({ isHovering }) => (isHovering ? "1" : "0")};
        transition: ease-in-out 200ms;
      }
      img {
        cursor: pointer;
        border: 1px solid gray;
        border-radius: 50%;
        width: 75px;
        object-fit: cover;
      }
    }
    input {
      max-width: 68%;
    }
  }

  .url-input {
    margin-top: 1em;
    width: 100%;
  }
`;

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      closeCurrentModal,
      setLoadingOverlay,
    },
    dispatch
  );
};

export default compose(
  withApollo,
  connect(null, mapDispatchToProps)
)(NewContent);
