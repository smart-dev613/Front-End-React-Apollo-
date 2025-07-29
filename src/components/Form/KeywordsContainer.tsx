import React, { Component, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Trans } from "react-i18next";
import styled from "styled-components";

interface KeywordsContainerProps {
  isEditing: boolean;
  keywords: string[];
  handleKeywordChange?: (profilesData: any) => void;
}

interface KeywordsContainerState {
  keywords: string[];
  currentKeyword: string;
}

class KeywordsContainer extends Component<
  KeywordsContainerProps,
  KeywordsContainerState
> {
  public constructor(props: KeywordsContainerProps) {
    super(props);

    this.state = {
      keywords: [],
      currentKeyword: "",
    };

    this.removeKeyword = this.removeKeyword.bind(this);
    this.addKeyword = this.addKeyword.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  public componentDidMount() {
    if (this.props.keywords) {
      this.setState({
        keywords: this.props.keywords,
      });
    }
  }

  public removeKeyword(keyword: string) {
    const keywords = this.state.keywords.filter((word) => word !== keyword) || [];

    this.setState(
      {
        keywords,
      },
      () => {
        this.props.handleKeywordChange(this.state.keywords);
      }
    );
  }

  public addKeyword() {
    //Check for empty spaces
    if (this.state.currentKeyword.trim().length === 0) return;

    this.setState(
      {
        keywords: [... this.state.keywords, this.state.currentKeyword],
        currentKeyword: "",
      },
      () => {
        this.props.handleKeywordChange(this.state.keywords);
      }
    );
  }

  public inputChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({
      currentKeyword: e.currentTarget.value,
    });
  }
  public handleKeyPress(e: React.KeyboardEvent) {
    if(e.key==="Enter"){
      this.addKeyword()
    }
  }

  public render() {
    const { isEditing } = this.props;

    return (
      <StyledKeywordsContainer>
        <div className="label-input-container">
          <label htmlFor="keywords">
            <Trans i18nKey="Keywords">trans</Trans>:
          </label>

          {isEditing && (
            <div className="keyword-input-container">
              <input
                type="text"
                value={this.state.currentKeyword}
                onChange={this.inputChange}
                onKeyPress={this.handleKeyPress}
                className="add-keyword"
                placeholder="Enter content keywords"
              />
              <div className="btn btn-purple" onClick={() => this.addKeyword()}>
                <FontAwesomeIcon icon="check" />
              </div>
            </div>
          )}
        </div>

        <div className="keywords-container">
        {this.state.keywords.map((keyword, index) =>
          !isEditing ? (
            <div className="keyword-container" key={`${keyword}-${index}`}>
              <input name="keyword2" value={keyword} disabled type="text" />
            </div>
          ) : (
              <div
                className="keyword-container"
                key={`${keyword}-${index}-edit`}
              >
                <div className="keyword">{keyword}</div>
                <span
                  className="remove-keyword"
                  onClick={() => this.removeKeyword(keyword)}
                >
                  <FontAwesomeIcon icon="times" />
                </span>
              </div>
          )
          )}
        </div>
      </StyledKeywordsContainer>
    );
  }
}

const StyledKeywordsContainer = styled.div`
  .label-input-container {
    display: flex;
    align-items: center;
    gap: 1em;
    margin: 1em 0;
    padding: 0 5px;
    
    label {
      font-weight: bold;
      margin: 0;
    }
    .keyword-input-container {
      display: flex;
      align-items: center;
      gap: .5em;
      width: 100%;
      input {
        border: 1px solid #ced4da;
        padding: .375em .75em;
        border-radius: 5px;
      }
      .btn {
        color: white;
        padding: 0.2em 0.5em;
      }
    }
  }

  .keywords-container {
    display: flex;
    flex-direction: row;
    flex-flow: row wrap;
    gap: 1em;
    align-items: center;
    justify-items: flex-start;
    .keyword-container {
      display: flex;
      gap: 1em;
      padding: 0.5em;
      border-radius: 5px;
      background: #e7e7e7;
      .remove-keyword {
        color: #c83f3f;
      }
    }
  }

  @media(max-width: 700px){
    .label-input-container label {
      display: none;
    }
  }
`;

export default KeywordsContainer;
