import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { AppState } from "../../store/root";
import CustomDropdown from "../CustomDropdown";

interface StateProps {
  ProfileAvatar: string;
  firstName: string;
  lastName: string;
}

type Props = StateProps;

class Pricing extends Component<Props> {
  public render() {
    const { ProfileAvatar, firstName, lastName } = this.props;

    return (
      <StyledQrCodeModal className="modal-content">
        <div className="modal-header">
          <div className="title">Add Pricing</div>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <CustomDropdown values={["Haircut", "Treatment", "Chemical", "Perm","Colour"]} title="Type" />
          <div className="filler">&nbsp;</div>
          <CustomDropdown
            values={[
              "Nick McKenzie",
              "Darren Harbolt",
              "Hetty Arnson",
              "Brianne Burke",
              "Tammy Green",
            ]}
            title="Employee"
          />
          <CustomDropdown
            values={[
              "30mins",
              "1hr",
              "1hr 30mins",
              "2hrs",
              "2hrs 30mins",
              "Custom ✏",
            ]}
            title="Time"
          />
          <CustomDropdown values={["USD", "GBP", "CNY"]} title="Currency" />
          <input type="text" placeholder="Price" />
        </div>
        <div className="modal-footer">
          <button
            type="button"
            data-dismiss="modal"
            aria-label="Cancel"
            className="btn btn-danger text-white"
          >
            Cancel
          </button>
          <button className="btn btn-purple text-white">Create</button>
        </div>
      </StyledQrCodeModal>
    );
  }
}

const StyledQrCodeModal = styled.div`
  .modal-header {
    padding: 1em;
    padding-left: 2.5em;
    border-bottom: 1px solid #d8d8d8;
    .title {
      font-weight: bold;
      color: #6b6b6b;
    }
  }

  .modal-body {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1em;
    padding: 2em;
    input {
      padding: .5em 1em;
      border-radius: 5px;
      border: 1px solid gray;
      width: 100%;
      margin: auto;
    }
    .filler {
      display: none;
    }
  }

  .modal-footer {
    margin-right: 0.5em;
  }

  @media (max-width: 700px) {
    .modal-body {
      flex-wrap: wrap;
      justify-items: end;

      input {
        width: 40%;
        margin: auto 0;
      }
      .filler {
        display: initial;
        width: 40%;
      }
    }
  }
`;

const mapStateToProps = function (state: AppState) {
  return {
    ProfileAvatar: state.user.userData.avatar,
    firstName: state.user.userData.firstName,
    lastName: state.user.userData.lastName,
  };
};

export default connect(mapStateToProps)(Pricing);
