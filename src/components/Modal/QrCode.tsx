import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { AppState } from '../../store/root';
import { bindActionCreators, Dispatch, compose } from 'redux';

import { closeCurrentModal } from '../../store/modal/action';
import qrcode from 'qrcode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

interface StateProps {
  user: any;
  event: any;
  ProfileAvatar: string;
  firstName: string;
  lastName: string;
  info: any;
  isFirst: boolean;
  isLast: boolean;
  isAvatar: boolean;
  isCompay: boolean;
  companyName: string
}

interface DispatchProps {
  closeCurrentModal: (type: string) => void;
}

type Props = StateProps & DispatchProps;

export const generateQrCode = async (urlToEncode: string) => {
  let url = await qrcode.toDataURL(urlToEncode);
  return url;
};

class QrCode extends Component<Props, any> {
  constructor(props: Props) {
    super(props);
    this.state = {
      url: '',
      qrImage: '',
      count: localStorage.getItem('scanned_count') || 1,
      avatarPlaceHolder:
        'https://user-assets.synkd.life/lbi-employee-avatars/622b693fa072010007372396/622b79d2a072010007372b9f/cheroo2.jpg',
      // qr_items: []
    };
    this.closeModal = this.closeModal.bind(this);
  }

  public qr_items : string[] = [];

  public componentDidMount() {

    this.setState(
      {
        url: location?.href + '/invited?verify=' + this.props?.user?.userData?.id + "&ch=qrcode" ,
      },
      () => {

        generateQrCode(this.props.info.additionalData.qr_code_url || this.state.url).then((result: string) => {
          this.setState({
            qrImage: result,
          });
        });       
      },
    );

    const items : any = JSON.parse(localStorage.getItem('qr_checked'));
    for(let x in items){
      // alert(items[x])
      this.qr_items.push(items[x])
    }

    this.setState({
      count :  JSON.parse(localStorage.getItem('scanned_count')) + 1
    })

    localStorage.setItem('scanned_count',this.state.count);
  }

  public closeModal() {
    //
    this.props.closeCurrentModal('QR_CODE');
    window.location.reload();
  }

  public render() {
    return (
      <StyledQrCodeModal className="modal-content">
        <div className="modal-header">
          <div className="col-10" />
          <button
            type="button"
            className="btn btn-red ml-3"
            data-dismiss="modal"
            aria-label="Close"
            onClick={this.closeModal}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="modal-body">
        <h6>Scan to Enter</h6>
          <div className="qrcode-profile-wrapper">
            <div className="qr-image">
                
              <img src={this.state.qrImage} alt="my profile QR" />
            </div>
            <h6>
              {/* {this.props.info.additionalData.qr_code_url} */}
              {/* {localStorage.getItem('qr_checked')} */}

              {/* {localStorage.getItem('qr_checked') ? JSON.parse(localStorage.getItem('qr_checked')).toString().length > 9 ? this.props.firstName+" "+this.props.lastName+" " : this.props.firstName : localStorage.getItem('qr_checked') ? JSON.parse(localStorage.getItem('qr_checked')) ? localStorage.getItem('qr_checked') : this.props.lastName  : this.props.firstName } */}
              {this.props.isFirst && <span>{this.props.firstName + ' '}</span>}
              {this.props.isLast && <span>{this.props.lastName}</span>}

            </h6>
            {this.props.isCompay && (<h6>Company: {this.props.companyName}</h6>)}
            {this.props.isAvatar && (
              <img
                style={{ height: '100px', width: '100px', borderRadius:"100%" }}
                src={this.props.ProfileAvatar || this.state.avatarPlaceHolder}
              />
            )}

            <h6>
            {/* {this.props.ProfileAvatar} */}
              {/* {
            this.qr_items.map((i)=>{
              return(
                <>
                {i =="firstName" ? this.props.firstName : null}
                </>
              )
            })
           }
           {
            this.qr_items.map((i)=>{
              return(
                <>
                      {i =="lastName" ? " "+this.props.lastName : null} 
                </>
              )
            })
           } */}
            </h6>
            {/* <h6>{this.props.ProfileAvatar? this.props.ProfileAvatar : 'avatar'}</h6> */}
          </div>
          {/* {this.state.qrImage && (
            <Carousel
              showThumbs={false}
              showIndicators={false}
              showStatus={false}
              dynamicHeight={true}
              showArrows={true}
              renderArrowPrev={(clickHandler, hasPrev) => (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    zIndex: 2,
                  }}
                  onClick={clickHandler}
                >
                  {hasPrev ? <FontAwesomeIcon icon={faAngleLeft} style={{ fontSize: 30 }} /> : null}
                </div>
              )}
              renderArrowNext={(clickHandler, hasNext) => (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    zIndex: 2,
                  }}
                  onClick={clickHandler}
                >
                  {hasNext ? <FontAwesomeIcon icon={faAngleRight} style={{ fontSize: 30 }} /> : null}
                </div>
              )
            }
            >
              {[
                this.state.qrImage,
                this.state.qrImage,
                this.state.qrImage,
                this.state.qrImage,
                this.state.qrImage,
                this.state.qrImage,
              ].map((item: any) => (
                <div key={item}>
                  <img src={item} alt="my qr code" />
                </div>
              ))}
            </Carousel>
          )} */}
        </div>
      </StyledQrCodeModal>
    );
  }
}

// const QrCode: React.FC<Props> = (props) => {
//   const [url, setUrl] = useState('');
//   const [qrImage, setQrImage] = useState('');
//   useEffect(() => {
//     if (props.info.additionalData) {
//       setUrl(location.protocol + '//' + location.host + '/' + props.info.additionalData.slug)
//     }
//   }, [props.info.additionalData])
//   useEffect(() => {
//     const generate = async () => {
//       try {
//         let result = await generateQrCode(url);
//         setQrImage(result);
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     generate();
//   }, [url])
//   console.log(props)
//   return (
//     <StyledQrCodeModal className='modal-content'>
//       <div className='modal-header'>
//         <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
//           <span aria-hidden='true'>&times;</span>
//         </button>
//       </div>
//       <div className='modal-body'>
//         {/* <div className='qrcode-profile-wrapper'>
//           <img src={ProfileAvatar} className='qrcode-profile-pic' alt='my profile picture' />
//           <div className='qrcode-profile-details'>
//             <span>{firstName} {lastName}</span>
//             <span className='light-font'>Location</span>
//           </div>
//         </div> */}
//         <img src={qrImage} alt='my qr code' />
//       </div>
//     </StyledQrCodeModal>
//   )
// }

const StyledQrCodeModal = styled.div`
  .modal-header {
    padding: 0.5rem 1rem 0rem 1rem;
    border-bottom: none;
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
    }
  }

  .qrcode-profile-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .qr-image {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 120px;
      height: 120px;

      img {
        width: 120px;
        height: 120px;
        object-fit: cover;
      }
    }
    h6 {
      margin-top: 5px;
    }
  }
  @media screen and (max-width: 765px) {
    
      width: 70%;
      top: 50%; /* Position 50% from the top */
      left: 50%; /* Position 50% from the left */
      transform: translate(-50%, -50%); /
    
    
  }
`;

const mapStateToProps = function (state: AppState) {
  return {
    user: state.user,
    ProfileAvatar: state.user.userData.avatar,
    firstName: state.user.userData.firstName,
    lastName: state.user.userData.lastName,
    isFirst: state.qr.first_checked,
    isLast: state.qr.last_checked,
    isAvatar: state.qr.avatar_chekced,
    isCompay: state.qr.company_checked,
    companyName: state.user.userData.company.name
  };
};

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      closeCurrentModal,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(QrCode);
