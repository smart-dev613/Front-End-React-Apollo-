import styled from 'styled-components';

export const ListStyle = styled.div`
  width: 100% !important;

  .companyInfo {
    display: flex;
    flex: 0.7;
  }

  .companyName {
    margin: 0;
    margin-bottom: 1em;
  }

  .itemCompanyName {
    font-weight: bold;
    font-size: 16px;
    width: fit-content;
  }

  .companyLogo {
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    flex-direction: column;
    background: #e6e6e6;
    box-shadow: 0 0 5px #8a8a8a;
    width: 65px !important;
    height: 65px !important;
    
    img {
      border-radius: 100%;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .companyDescriptionContainer {
    display: flex;
    align-items: center;
    gap: 2em;
    flex-direction: row;
    
    .companyDescription {
      display: flex;
      flex-direction: row;
      justify-content: left;
      flex: 1;
      margin-left: 1em;
      max-width: 80%;

      .companyDescriptionBody {
        display: flex;
        flex-direction: column;
        width: 80%;
        gap: 2em;
      }

      .keywords {
        display: flex;
        align-items: center;
        padding: 0;
        font-size: large;
        font-weight: bolder;
        width: 20%;
        
        .keyword-pad {
          white-space: pre;
          overflow: hidden;
          text-overflow: ellipsis;
          
          ul {
            border-radius: 5px;
            padding: 0px 5px 0px 0px;
            margin: 0px 10px 0px 0px;
            font-size: 16px;
            display: inline;
          }
        }
      }
    }
  }

  .companyList {
    background: #f7f8f5 !important;
    padding: 0em 0em 0em 1em !important;
    border-radius: 5px;
    list-style-type: none;
    margin-top: -1px;
    color: black;
    margin-bottom: 15px !important;
  }

  .companyIntro {
    text-align: left;
    
    p {
      font-size: medium;
      padding: 0;
      margin-bottom: 0px;
      margin: 2% 0;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  ul {
    margin-bottom: 0em;
    padding: 0 0 0 15px;
  }

  .search-icon {
    display: flex;
    align-items: center;
    width: 0;
  }

  /* Mobile Styles */
  @media screen and (max-width: 768px) {
    .companyIntro {
      white-space: pre;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 150px;
    }

    .companyLogo {
      width: 44px !important;
      height: 44px !important;
    }

    .itemCompanyName {
      font-weight: bold;
      font-size: medium;
    }

    .companyDescriptionContainer {
      gap: 0.5em;
    }

    .companyDescription {
      flex-wrap: none;
      justify-content: flex-start;
      text-align: justify;
      font-size: small;
      width: 100%;

      p {
        font-size: 14px;
      }
    }

    .companyDescriptionBody {
      gap: 0;
      width: 80%;
    }

    .companyList {
      padding: none !important;
      color: black;
    }

    .keywords {
      display: none; 
    }

    .keywords-container {
      display: none; 
    }


    /* .keywords {
      padding: 0px;
      font-size: medium;
      font-weight: bolder;
      width: 70px;

      .keyword-pad {
        white-space: pre;
        text-overflow: ellipsis;
        
        img {
          border-style: none;
          height: 70px;
          width: 70px;
          margin: 15px 0px;
          border-radius: 50%;
        }
      }
    } */

    .companyDescriptionContainer {
      gap: 0;
      padding: 0;
    }

    .companyDescription {
      margin: 0;
    }

    /* .keywords {
      margin: 0;
      margin-bottom: 2em;

      ul {
        margin: 0;
        padding: 0;
      }
    } */
  }

  /* Desktop Styles */
  @media screen and (min-width: 769px) {
    .companyList {
      width: 80%;
      margin: auto;
    }

    .companyDescription {
      max-width: 55%;
      text-align: justify;
      font-size: smaller;
      max-width: 90% !important;

      p {
        font-size: 14px;
      }
    }

    ul {
      font-weight: bolder;
    }

    .keyword-pad {
      padding: 3px 15px;
      margin-top: 0;
      font-size: 0.75em;
    }

    .companyDescriptionBody {
      gap: 2em;
    }
  }
`;