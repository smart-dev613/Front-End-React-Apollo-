/** Components */
import styled from 'styled-components';

/** Types */
import { UIState } from '../../../../../store/ui/types';

export const Container = styled.div<{ ui: UIState }>`
  overflow: hidden;
  .action-button-bottom {
    justify-content: flex-end;
    display: flex;
    text-align: right;
    gap: 10px;
    margin-bottom: 20px;
    @media only screen and (max-width: 576px) {
      display: none;
    }
  }
  .action-button-top {
    justify-content: flex-end;
    display: flex;
    text-align: right;

    margin-bottom: 20px;
    @media only screen and (min-width: 576px) {
      /* display: none; */
    }
  }
`;

export const ContentWrapper = styled.div`

`;

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
h3{
  text-transform: capitalize;
}
  .extra {
    display: flex;

    & > div {
      display: flex;
    }
  }
`;