import React from 'react';
import { ReactElement } from 'react';
import styled from 'styled-components';
import { Divider } from './components/Divider';
import { FriendlyWaste } from './components/FriendlyWaste';
import { WalletConnectDisconnect } from './components/WalletConnectDisconnect';
import { WalletStats } from './components/WalletStats';

const StyledAppDiv = styled.div`
  display: grid;
  grid-gap: 20px;
`;

export function App(): ReactElement {
  return (
    <StyledAppDiv>
      <WalletConnectDisconnect />
      <Divider/>
      <WalletStats />
      <Divider/>
      <FriendlyWaste/>
    </StyledAppDiv>
  );
}
