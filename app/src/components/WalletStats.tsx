import { useWeb3React } from '@web3-react/core';
import { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Provider } from '../utils/provider';


const StyledWalletStatusDiv = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 2fr 1fr;
  grid-gap: 10px;
  place-self: center;
  align-items: center;
`;

const StyledStatusIcon = styled.h1`
  margin: 0px;
  grid-column: 100
`;

function Account(): ReactElement {
    
    const {account} = useWeb3React<Provider>();

    return (
        <>
      <span>
        <strong color='#022B3A'>Account: </strong>
      </span>
      <span>
        {typeof account === 'undefined'
          ? ''
          : account
          ? `${account.substring(0, 6)}...${account.substring(
              account.length - 4
            )}`
          : ''}
      </span>
    </>    
    );


}

function StatusIcon(): ReactElement {
    const { active, error } = useWeb3React<Provider>();
  
    return (
      <StyledStatusIcon>{active ? '🟢' : error ? '🔴' : '🟠'}</StyledStatusIcon>
    );
}

export function WalletStats(): ReactElement {
    return (
      <StyledWalletStatusDiv>
        <Account />
        <StatusIcon />
      </StyledWalletStatusDiv>
    );
}
  

