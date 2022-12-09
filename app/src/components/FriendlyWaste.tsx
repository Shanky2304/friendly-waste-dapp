import { useWeb3React } from "@web3-react/core";
import {BigNumber, Contract, ethers, Signer } from "ethers";
import {ChangeEvent, MouseEvent, ReactElement, useEffect, useState } from "react";
import styled from "styled-components";
import FriendlyWasteArtifact from "../artifacts/contracts/FriendlyWaste.sol/FriendlyWaste.json"
import WacondaTokenArtifact from "../artifacts/contracts/WacondaToken.sol/WacondaToken.json"
import { Provider } from "../utils/provider";
import { Divider } from "./Divider";

const StyledButton = styled.button`
  width: 180px;
  height: 3rem;
  border-radius: 2rem;
  border-color: yellow;
  cursor: pointer;
  place-self: center;
  color:#B5FED9l
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
  color:#022B3A;
`;

const StyledInput = styled.input`
  padding: 0.4rem 0.6rem;
  line-height: 2fr;
`;

export function FriendlyWaste(): ReactElement {

    type Stats = {
        Waste?: BigNumber;
        Name?: string;
    };  

    const context = useWeb3React<Provider>();
    const {library, active, account} = context

    const [signer, setSigner] = useState<Signer>();
    const [friendlyWasteContract, setFriendlyWasteContract] = useState<Contract>();
    const [WacondaTokenContract, setWacondaTokenContract] = useState<Contract>();
    const [friendlyWasteConAddr, setfriendlyWasteConAddr] = useState<string>('');
    const [balance, setBalance] = useState<string>();
    const [totalTokens, setTotalTokens] = useState<number>();
    const [companyName, setcompanyName] = useState<string>('');
    //const [companyIndustry, setcompanyIndustry] = useState<string>('');
    const [registeredCompanies, setregisteredCompanies] = useState<string[]>([]);
    const [companyFoodWaste, setCompanyFoodWaste] = useState<string>();
    //const [companyDesc, setCompanyDesc] = useState<string>();
    const [addrToVerify, setAddrToVerify] = useState<string>();
    const [companyStats, setCompanyStats] = useState<Stats[]>([]);
    const [sortedCompanyStats, setSortedCompanyStats] = useState<Stats[]>([]);

    useEffect((): void => {
        if(!library) {
            setSigner(undefined)
            return;
        }

        setSigner(library.getSigner());

        async function getBalance(WacondaTokenContract: Contract): Promise<void> {
            try {
                const bal = await WacondaTokenContract.balanceOf(account);
                setBalance(bal.toNumber());

                const supply = await WacondaTokenContract.totalSupply();
                setTotalTokens(supply.toNumber());
            } catch (error:any) {
                window.alert('Error occurred: ' + (error && error.message ? `\n\n${error.message}` : ''));
            }
        }

        if(WacondaTokenContract) {
            getBalance(WacondaTokenContract);
        }

    }, [library, WacondaTokenContract]);

    useEffect((): void => {
        if (!companyStats || companyStats.length < 1) {
            return;
        } 

        const sortedStats = [...companyStats].sort((a, b) => a!.Waste!.toNumber() - b!.Waste!.toNumber());
        
        setSortedCompanyStats(sortedStats);

    }, [companyStats]);

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
            const Waconda = new ethers.ContractFactory(
                WacondaTokenArtifact.abi,
                WacondaTokenArtifact.bytecode,
                signer
            );
            try {
                const fwContract = await FriendlyWaste.deploy();
                const WACOContract = await Waconda.deploy(100);
                
                await fwContract.deployed();
                await WACOContract.deployed();

                setFriendlyWasteContract(fwContract);
                setWacondaTokenContract(WACOContract)

                window.alert(`FriendlyWaste deployed to: ${fwContract.address}`);

                setfriendlyWasteConAddr(fwContract.address);
                // if (account) {
                //     setadmin(account);
                // }    
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

    function handleCompanyFoodWasteChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        setCompanyFoodWaste(event.target.value);
    }

    // function handleCompanyDescChange(event: ChangeEvent<HTMLInputElement>) {
    //     event.preventDefault();
    //     setCompanyDesc(event.target.value);
    // }

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
        if (!companyName) {
            window.alert('Company Name and Industry are required!');
            return;
        }

        async function register(fwContract: Contract): Promise<void> {
            try {
                const registerTxn = await fwContract.register(companyName, "Food");
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
                const updateStatsTxn = await fwContract.updateCompanyStats(companyFoodWaste);
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
                if (WacondaTokenContract) {
                    WacondaTokenContract.transfer(addrToVerify, 5);
                }
                if (totalTokens) {
                    setTotalTokens(totalTokens - 5);
                }

                window.alert(`Verified successfully!`);
            } catch (error: any) {
                window.alert('Error occurred: ' + (error && error.message ? `\n\n${error.message}` : ''));
            }
            
        }
        verify(friendlyWasteContract);
    }

    function handleGetStats(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        if(!friendlyWasteContract || !registeredCompanies) {
            window.alert('Smart Contract or registeredCompanies undefined!');
            return;
        }

        function getStats(fwContract:Contract) {
            try {
                var statList: Stats[] = []
                registeredCompanies.forEach(async function (regCompany) : Promise<void> {
                    const stats = await fwContract.getCompanyStats(regCompany);
                    console.log(`Stats: ` + stats);
                    var statObj : Stats = {
                        Waste : stats[0],
                        Name : stats[1]
                    };
                    console.log(`Stat Obj: ` + statList);
                    statList = statList.concat(statObj);
                    setCompanyStats(statList);
                    console.log(`Stat Obj: ` + companyStats);
                });
                // console.log(`companyStats: ` + statList);
                window.alert(`All stats updated successfully!`);
                // setCompanyStats(statList);
                // console.log(`companyStats: ` + companyStats);
            } catch (error: any) {
                window.alert('Error occurred: ' + (error && error.message ? `\n\n${error.message}` : ''));
            }
        }
        getStats(friendlyWasteContract);
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
            Deploy FriendlyWaste Contracts    
            </StyledButton>
            <Divider/>
            <StyledContractDiv>
                <StyledLabel>Token Supply     (in WACO): </StyledLabel>
                {totalTokens ? (totalTokens) : (<em>{`Contract not deployed`}</em>)}
            </StyledContractDiv>
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
            </StyledContractDiv>
            <StyledContractDiv>
                <StyledLabel htmlFor="companyTokens">Balance Tokens: </StyledLabel>
                    {balance ? balance : 0}
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
                type="number"
                onChange={handleCompanyFoodWasteChange}/>
                {/* <StyledLabel htmlFor="companyDesc">Enter Desc:</StyledLabel>
                <StyledInput id="companyDesc" 
                type="text"
                onChange={handleCompanyDescChange}/> */}
            </StyledContractDiv>
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
            <div></div>
            <StyledButton
                disabled={!active || !friendlyWasteContract ? true : false}
                style={{
                    cursor: !active || !friendlyWasteContract ? 'not-allowed' : 'pointer',
                    borderColor: !active || !friendlyWasteContract ? 'unset' : 'yellow'
                }}
                onClick={handleGetStats}
            >
            Get Stats  
            </StyledButton>    
            <StyledLabel htmlFor="companyStats"> Registered Companies stats:</StyledLabel>
            <div>
            {Object.entries(sortedCompanyStats).map(([key, value]) => (
                <div className="item" key={key}>
                    {value.Name?.toString()}&nbsp;
                    {value.Waste?.toNumber()}
                </div>
                )
            )}
            {/* companyStats?.Waste?.toNumber()
            }&nbsp;
            {companyStats?.Name?.toString()} */}
            </div>
        </>
    );
}