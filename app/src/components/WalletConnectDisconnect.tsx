import { AbstractConnector } from '@web3-react/abstract-connector';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError
} from '@web3-react/injected-connector';
import React from 'react';
import { MouseEvent, ReactElement, useState } from 'react';
import styled from 'styled-components';
import { injected } from '../utils/connector';
//import { useEagerConnect, useInactiveListener } from '../utils/hooks';
import { Provider } from '../utils/provider';

type ActivateFunction = (
  connector: AbstractConnector,
  onError?: (error: Error) => void,
  throwErrors?: boolean
) => Promise<void>;

function getErrorMessage(error: Error): string {
    let errorMessage: string;
  
    switch (error.constructor) {
      case NoEthereumProviderError:
        errorMessage = `No Ethereum browser extension detected. Please install MetaMask extension.`;
        break;
      case UnsupportedChainIdError:
        errorMessage = `You're connected to an unsupported network.`;
        break;
      case UserRejectedRequestError:
        errorMessage = `Please authorize this website to access your Ethereum account.`;
        break;
      default:
        errorMessage = error.message;
    }
  
    return errorMessage;
  }

const StyledConnectDisconnectDiv = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  place-self: center;
  align-items: center;
`;

const StyledConnectButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: green;
  cursor: pointer;
`;

const StyledDisconnectButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: red;
  cursor: pointer;
`;  

function Connect(): ReactElement {

  const context = useWeb3React<Provider>();
  const {activate, active} = context;

  const [connecting, setConnecting] = useState<boolean>(false);

  function handleConnect(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    async function _connect(activate: ActivateFunction): Promise<void> {
      setConnecting(true);
      // How to connect?
      await activate(injected);
      setConnecting(false);
    }

    _connect(activate);
  }


  return (
    <StyledConnectButton
      disabled={active}
      style={{
        cursor: active ? 'not-allowed' : 'pointer',
        borderColor: connecting ? 'orange' : active ? 'unset' : 'green'
      }}
      onClick={handleConnect}
    >
      Connect
    </StyledConnectButton>
  );
}

function Disconnect(): ReactElement {
  const context = useWeb3React<Provider>();
  const { deactivate, active } = context;

  function handleDisconnect(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    deactivate();
  }

  return (
    <StyledDisconnectButton
      disabled={!active}
      style={{
        cursor: active ? 'pointer' : 'not-allowed',
        borderColor: active ? 'red' : 'unset'
      }}
      onClick={handleDisconnect}
    >
      Disconnect
    </StyledDisconnectButton>
  );
}

export function WalletConnectDisconnect(): ReactElement {
    const context = useWeb3React<Provider>();
    const { error } = context;
  
    if (!!error) {
      window.alert(getErrorMessage(error));
    }
  
    return (
      <StyledConnectDisconnectDiv>
        <Connect/>
        <Disconnect />
      </StyledConnectDisconnectDiv>
    );
  }