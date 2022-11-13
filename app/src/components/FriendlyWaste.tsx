import { useWeb3React } from "@web3-react/core";
import { use } from "chai";
import { Contract, ethers, Signer } from "ethers";
import {ChangeEvent, MouseEvent, ReactElement, useEffect, useState } from "react";
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
  place-self: center;
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
    const [registeredCompanies, setregisteredCompanies] = useState<string[]>([]);
    const [companyFoodWaste, setCompanyFoodWaste] = useState<string>();
    const [companyDesc, setCompanyDesc] = useState<string>();
    const [addrToVerify, setAddrToVerify] = useState<string>();

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
                const fwContract = await FriendlyWaste.deploy();

                await fwContract.deployed();

                setFriendlyWasteContract(fwContract);

                window.alert(`FriendlyWaste deployed to: ${fwContract.address}`);

                setfriendlyWasteConAddr(fwContract.address);
            } catch (error: any) {
                window.alert('Error occurred: ' + (error && error.message ? `\n\n${error.message}` : ''));
            }
            
        }
        deployContract(signer);
    }

    function handleCompanyNameChange(event: ChangeEvent<HTMLInputElement>) {

        event.preventDefault();
        setcompanyName(event.target.value);

    }

    function handleCompanyIndustryChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        setcompanyIndustry(event.target.value);
    }

    function handleCompanyFoodWasteChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        setCompanyFoodWaste(event.target.value);
    }

    function handleCompanyDescChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        setCompanyDesc(event.target.value);
    }

    function handleAddrToVerifyChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        setAddrToVerify(event.target.value);
    }

    function handleCompanyRegister(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        console.log('Sending request to register company');
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
                const registerTxn = await fwContract.register(companyName, companyIndustry);
                await registerTxn.wait();

                window.alert(`Registered Successfully!`);
            } catch (error:any) {
                window.alert('Error occurred: ' + (error && error.message ? `\n\n${error.message}` : ''));
            }
        }
        register(friendlyWasteContract);
    }

    function handleGetRegisteredCompanies(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        if(!friendlyWasteContract) {
            window.alert('Smart Contract undefined!');
            return;
        }
        async function getCompanies(fwContract:Contract): Promise<void> {
            try {
                const companies = await fwContract.getRegisteredCompanies();
                console.log('Companies:'+(companies));
                const compList: string[] = [];
                companies.forEach((ele: string) => compList.push(ele));
                console.log('RegCompanies:'+ typeof compList);
                setregisteredCompanies(compList);
                window.alert(`Succesfully retrieved!`);
            } catch (error: any) {
                window.alert('Error occurred: ' + (error && error.message ? `\n\n${error.message}` : ''));
            }
            
        }
        getCompanies(friendlyWasteContract);
    }

    function handleUpdateStats(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        if(!friendlyWasteContract || !registeredCompanies) {
            window.alert('Smart Contract or registeredCompanies undefined!');
            return;
        }

        async function updateStats(fwContract:Contract): Promise<void> {
            try {
                const updateStatsTxn = await fwContract.updateCompanyStats(companyFoodWaste, companyDesc);
                await updateStatsTxn.wait();

                window.alert(`Stats updated successfully!`);
            } catch (error: any) {
                window.alert('Error occurred: ' + (error && error.message ? `\n\n${error.message}` : ''));
            }
            
        }
        updateStats(friendlyWasteContract);
    }

    function handleVerify(event: MouseEvent<HTMLButtonElement>) {
        if(!friendlyWasteContract || !registeredCompanies) {
            window.alert('Smart Contract or registeredCompanies undefined!');
            return;
        }

        async function verify(fwContract:Contract): Promise<void> {
            try {
                const updateStatsTxn = await fwContract.verify(addrToVerify);
                await updateStatsTxn.wait();

                window.alert(`Verified successfully!`);
            } catch (error: any) {
                window.alert('Error occurred: ' + (error && error.message ? `\n\n${error.message}` : ''));
            }
            
        }
        verify(friendlyWasteContract);
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
                <StyledInput id="companyName" 
                type="text"
                onChange={handleCompanyNameChange}/>
                <div></div>
                <StyledLabel htmlFor="companyIndustry">Enter company Industry:</StyledLabel>
                <StyledInput id="companyIndustry" 
                type="text"
                onChange={handleCompanyIndustryChange}/>
            </StyledContractDiv>      
            <StyledButton
                disabled={!active || !friendlyWasteContract ? true : false}
                style={{
                    cursor: !active || !friendlyWasteContract ? 'not-allowed' : 'pointer',
                    borderColor: !active || !friendlyWasteContract ? 'unset' : 'yellow'
                }}
                onClick={handleCompanyRegister}
            >
            Register Company    
            </StyledButton>
            <Divider/>
            <StyledButton 
                disabled={!active || !friendlyWasteContract ? true : false}
                style={{
                    cursor: !active || !friendlyWasteContract ? 'not-allowed' : 'pointer',
                    borderColor: !active || !friendlyWasteContract ? 'unset' : 'yellow'
                }}
                onClick={handleGetRegisteredCompanies}
            >
            Get Registered Companies
            </StyledButton>
            <StyledLabel htmlFor="registeredCompanies"> Registered Companies:</StyledLabel>
            <div>
                {
                    registeredCompanies.map((item) => (
                        <li key={item.toString()}>{item}</li>
                    ))
                }
            </div>
            <Divider/>
            <StyledContractDiv>
                <StyledLabel htmlFor="addrToVerify">Enter addr to verify:</StyledLabel>
                <StyledInput id="addrToVerify" 
                type="text"
                onChange={handleAddrToVerifyChange}/>
            </StyledContractDiv>
            <StyledButton
                disabled={!active || !friendlyWasteContract ? true : false}
                style={{
                    cursor: !active || !friendlyWasteContract ? 'not-allowed' : 'pointer',
                    borderColor: !active || !friendlyWasteContract ? 'unset' : 'yellow'
                }}
                onClick={handleVerify}
            >
            Verify   
            </StyledButton>
            <Divider/>
            <StyledContractDiv>
                <StyledLabel htmlFor="companyFoodWaste">Enter company foodWaste(in Tons):</StyledLabel>
                <StyledInput id="companyFoodWaste" 
                type="text"
                onChange={handleCompanyFoodWasteChange}/>
                <div></div>
                <StyledLabel htmlFor="companyDesc">Enter Desc:</StyledLabel>
                <StyledInput id="companyDesc" 
                type="text"
                onChange={handleCompanyDescChange}/>
            </StyledContractDiv>
            <div></div>
            <StyledButton
                disabled={!active || !friendlyWasteContract ? true : false}
                style={{
                    cursor: !active || !friendlyWasteContract ? 'not-allowed' : 'pointer',
                    borderColor: !active || !friendlyWasteContract ? 'unset' : 'yellow'
                }}
                onClick={handleUpdateStats}
            >
            Update Stats    
            </StyledButton>

        </>
    );
}