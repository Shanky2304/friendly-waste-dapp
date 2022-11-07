import React from 'react';
import { ReactElement } from 'react';
import styled from 'styled-components';
import { WalletConnectDisconnect } from './components/WalletConnectDisconnect';

const StyledAppDiv = styled.div`
  display: grid;
  grid-gap: 20px;
`;

export function App(): ReactElement {
  return (
    <StyledAppDiv>
      <WalletConnectDisconnect />
    </StyledAppDiv>
  );
}
