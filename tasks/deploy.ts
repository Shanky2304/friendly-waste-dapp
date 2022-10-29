import '@nomiclabs/hardhat-waffle';
import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

task('deploy', 'Deploy FriendlyWaste contract').setAction(
  async (_, hre: HardhatRuntimeEnvironment): Promise<void> => {
    const FriendlyWaste = await hre.ethers.getContractFactory('FriendlyWaste');
    const friendlyWaste = await FriendlyWaste.deploy('Hello, Hardhat!');

    await friendlyWaste.deployed();

    console.log('Greeter deployed to:', friendlyWaste.address);
  }
);
