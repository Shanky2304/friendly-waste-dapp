import { useWeb3React } from "@web3-react/core";
import { Contract, ethers, Signer } from "ethers";
import {MouseEvent, ReactElement, useEffect, useState } from "react";
import styled from "styled-components";
import FriendlyWasteArtifact from "../artifacts/contracts/FriendlyWaste.sol/FriendlyWaste.json"
import { Provider } from "../utils/provider";
import { Divider } from "./Divider";

const StyledButton = styled.button`
  width: 180px;
  height: 3rem;
  border-radius: 2rem;
  border-color: yellow;
  cursor: pointer;
  place-self: center end;
`;

const StyledContractDiv = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 135px 2.7fr 1fr;
  grid-gap: 10px;
  place-self: center;
  align-items: center;
`;

const StyledLabel = styled.label`
  font-weight: bold;
`;

const StyledInput = styled.input`
  padding: 0.4rem 0.6rem;
  line-height: 2fr;
`;

export function FriendlyWaste(): ReactElement {

    const context = useWeb3React<Provider>();
    const {library, active} = context

    const [signer, setSigner] = useState<Signer>();
    const [friendlyWasteContract, setFriendlyWasteContract] = useState<Contract>();
    const [friendlyWasteConAddr, setfriendlyWasteConAddr] = useState<string>('');
    const [companyName, setcompanyName] = useState<string>('');
    const [companyIndustry, setcompanyIndustry] = useState<string>('');

    useEffect((): void => {
        if(!library) {
            setSigner(undefined)
            return;
        }

        setSigner(library.getSigner());
    }, [library]);

    function handleContractDeploy(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        if (friendlyWasteContract || !signer) {
            return;
        }

        async function deployContract(signer:Signer): Promise<void> {
            const FriendlyWaste = new ethers.ContractFactory(
                FriendlyWasteArtifact.abi,
                FriendlyWasteArtifact.bytecode,
                signer
            );

            try {
                const friendlyWasteContract = await FriendlyWaste.deploy();

                await friendlyWasteContract.deployed();

                window.alert(`FriendlyWaste deployed to: ${friendlyWasteContract.address}`);

                setfriendlyWasteConAddr(friendlyWasteContract.address);
            } catch (error: any) {
                window.alert('Error occurred: ' + (error && error.message ? `\n\n${error.message}` : ''));
            }
            
        }
        deployContract(signer);
    }

    function handleCompanyNameChange() {} {

    }

    function handleCompanyRegister(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        if(!friendlyWasteContract) {
            window.alert('Smart Contract undefined!');
            return;
        }
        if (!companyName || !companyIndustry) {
            window.alert('Company Name and Industry are required!');
            return;
        }

        async function register(fwContract: Contract): Promise<void> {
            try {
                const registerTxn = await fwContract.register();
                await registerTxn.wait();
            } catch (error:any) {
                window.alert('Error occurred: ' + (error && error.message ? `\n\n${error.message}` : ''));
            }
        }
        register(friendlyWasteContract);
    }



    return (
        <>
            <StyledButton
                disabled={!active || friendlyWasteContract ? true : false}
                style={{
                    cursor: !active || friendlyWasteContract ? 'not-allowed' : 'pointer',
                    borderColor: !active || friendlyWasteContract ? 'unset' : 'yellow'
                }}
                onClick={handleContractDeploy}
            >
            Deploy FriendlyWaste Contract    
            </StyledButton>  
            <Divider/>
            <StyledContractDiv>
                <StyledLabel>Contract Addr</StyledLabel>
                <div>
                    {friendlyWasteConAddr ? (friendlyWasteConAddr) : (<em>{`Contract not deployed`}</em>)}
                </div>
                <div></div>
                <StyledLabel htmlFor="companyName">Enter company Name:</StyledLabel>
                <StyledInput id="companyName" type="text"/>

                <StyledButton>
                </StyledButton> 
            </StyledContractDiv>
            
        </>
    );
}