import React from 'react';
import styled from 'styled-components';

interface Props {
  Keywords: string[];
  isModal?: boolean;
  maxNumber?: number;
}

const KeywordList = ({ Keywords, isModal, maxNumber = 2 }: Props) => {
  const overflow = Keywords.length > maxNumber ? true : false;
  const slicedArr = maxNumber ? Keywords.slice(0, maxNumber) : Keywords;

  let keywordArr = [];
  isModal ? (keywordArr = Keywords) : (keywordArr = slicedArr);
  return (
    <StyledKeywordContainer className="keywords-container" isModal={isModal}>
      {Array.isArray(keywordArr) &&
        keywordArr.map((keyword) => {
          var NewKeyword = keyword;
          if (keyword.indexOf('') != 0 && keyword.indexOf('No Keywords provided') == -1) {
            NewKeyword = '#' + keyword;
          }
          return (
            <span key={NewKeyword} className="keyword">
              {NewKeyword}
            </span>
          );
        })}
      {overflow && !isModal && <span className="keyword">+{keywordArr.length + 1 - 2}</span>}
    </StyledKeywordContainer>
  );
};

const StyledKeywordContainer = styled.div<{ isModal: boolean }>`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  gap: 0.75em;
  width: 100%;

  .keyword {
    background: ${({ isModal }) => (isModal ? 'none' : '#E1E1E1')};
    border-radius: 5px;
    padding: ${({ isModal }) => (isModal ? 'none' : '0 .5em .4em .5em')};
    font-weight: none !important;
    font-size: ${({ isModal }) => (isModal ? '14px' : '14px')};
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
    color: #212529 !important;
  }

  @media screen and (max-width: 450px) {
    .keyword {
      padding: 2px 6px !important;
    }
  }
`;

export default KeywordList;
