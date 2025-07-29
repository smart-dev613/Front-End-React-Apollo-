import React, { Component } from 'react';
import styled from 'styled-components';
import $ from 'jquery';
import { ModalInfo } from '../../store/modal/types';

import QrCode from './QrCode';
import ScannedAttendee from './ScannedAttendee';
import Pricing from './Pricing';
import Notification from './Notification';
import NotesModal from './NotesModal';
import DataDetailModal from './DataDetail';
import NewVenue from './NewVenue';
import UpdateVenue from './UpdateVenue';
import BookMeeting from './BookMeeting';
import BookSchedule from './BookSchedule';
import CreatePricing from './CreatePricing';
import NewContent from './NewContent';
import ContentItem from './ContentItem';
import NewContentItem from './NewContentItem';
import CompanyPreference from './CompanyPreference';
import AttendeePreference from './AttendeePreference';
import CreateCluster from './CreateCluster';
import ViewCluster from './ViewCluster';
import CreateCoupon from './CreateCoupon';
import FamilyLinks from './components/CompanyView/FamilyLinks';
import CompanySwitchMasterModalContent from './CompanySwitchMasterModalContent';
import AttendeeDetails from '../pages/views/Invited/components/AttendeeDetails';
import ArchiveInvitation from './ArchiveInvitation';
import MemberProfile from './MemberProfile';
 
interface ParentProps {
  isActive: boolean;
  info: ModalInfo;
}

type Props = ParentProps;

type ModalInner = typeof Component & any; // @@TODO - fix any to allow return of console log

class ModalOuter extends Component<Props> {
  public constructor(props: Props) {
    super(props);

    this.getModalInner = this.getModalInner.bind(this);
  }
  public componentDidMount() {
    if (this.props.isActive)
      $('#' + this.props.info.type + '_MODAL')
        .modal({ keyboard: false, backdrop: 'static' })
        .modal('show');
  }

  public componentDidUpdate() {
    if (this.props.isActive) $('#' + this.props.info.type + '_MODAL').modal('show');
  }

  public getModalInner(type: string): ModalInner {
    switch (type) {
      case 'PRICING':
        return Pricing;
      case 'QR_CODE':
        return QrCode;
      case 'MEMBER_PROFILE':
          return MemberProfile;
      case 'SCANNED_ATTENDEE':
        return ScannedAttendee;
      case 'NOTIFICATION_MODAL':
        return Notification;
      case 'NOTES_MODAL':
        return NotesModal;
      case 'DATA_DETAIL_MODAL':
        return DataDetailModal;
      case 'FAMILY_LINKS':
        return FamilyLinks;
      case 'ATTENDEE_DETAILS':
        return AttendeeDetails;
      case 'ARCHIVE_INVITATION':
          return ArchiveInvitation;
      case 'NEW_VENUE':
        return NewVenue;
      case 'UPDATE_VENUE':
        return UpdateVenue;
      case 'NEW_CONTENT':
        return NewContent;
      case 'BOOK_MEETING':
        return BookMeeting;
      case 'BOOK_SCHEDULE':
        return BookSchedule;
      case 'CREATE_PRICING':
        return CreatePricing;
      case 'CREATE_CLUSTER':
        return CreateCluster;
      case 'VIEW_CLUSTER':
        return ViewCluster;
      case 'CREATE_COUPON':
        return CreateCoupon;
      case 'CONTENT_ITEM':
        return ContentItem;
      case 'NEW_CONTENT_ITEM':
        return NewContentItem;
      case 'COMPANY_PREFERENCE':
        return CompanyPreference;
      case 'ATTENDEE_PREFERENCE':
        return AttendeePreference
      case 'COMPANY_SWITCH_MASTER':
        return CompanySwitchMasterModalContent
      default:
        return console.log('not a valid modal name');
    }
  }

  public render() {
    let ModalInner = this.getModalInner(this.props.info.type);
    return (
      <StyledModalOuter
        className="modal fade"
        id={this.props.info.type + '_MODAL'}
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div className={'modal-dialog modal-dialog-centered modal-' + this.props.info.size} role="document">
          <ModalInner info={this.props.info} />
        </div>
      </StyledModalOuter>
    );
  }
}

const StyledModalOuter = styled.div`
  padding: 0 !important;
`;

export default ModalOuter;
