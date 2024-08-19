import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
// import {parseEther} from 'ethers';
import { getChainId } from 'hardhat';
import { parseEther } from 'ethers/lib/utils';
import { PopCoinDeploymentParameters } from '../utils/deploy-parameters';


export const ROUTER_ADDRESSES: {
    [chainId: number] : string[]
} = {
    31337: ['0x'],
	2522: [//fraxtal testnet
		'0xAAA45c8F5ef92a000a121d102F4e89278a711Faa', // Ra
		'0x39cd4db6460d8B5961F73E997E86DdbB7Ca4D5F6', //FraxSwap
		'0x3FCa62e61909455186BeaB7C9647bC66472e3bEe', //zswap
	],
	252: [//fraxtal
		'0xAAA45c8F5ef92a000a121d102F4e89278a711Faa', // Ra
		'0x39cd4db6460d8B5961F73E997E86DdbB7Ca4D5F6', //FraxSwap
	],

	2713017997578000:[// dchain testnet
		'0x39958444bB2E83A1648b055F87629b6E339E92b7'//zswap
	],

	4002: [//fantom test
		'0x49C591b5C26B2723987b993C606b772c7f7609F8', //zswap
		'0xa6AD18C2aC47803E193F75c3677b14BF19B94883'
	],
	250: [//fantom
		'0x49C591b5C26B2723987b993C606b772c7f7609F8', //zswap
		'0x16327e3fbdaca3bcf7e38f5af2599d2ddc33ae52', //SpiritSwap 
		'0xf491e7b69e4244ad4002bc14e878a34207e38c29', //SpookySwap v1
		'0xd100808034bd4a225fc85a0613b651e7f5a8d384' //Beethoven X			
	],
	
	44787: [// Celo test
		'0x0e6991d3033B7904913177CF866d52c16B7a8C90',// zswap
		'0xe3d8bd6aed4f159bc8000a9cd47cffdb95f96121'
	
	],

	1115: [// Core dao test
		'0x54DB465CAdd676690DBbe1fDa03FE532fDa44628'// zswap
	
	],

	656476: [// OpenCampus Educhain test
		'0x69271993d8da62003f97E5065C81B53f37526Bfe'// zswap
	
	],

}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	
	const {ethers, deployments, getNamedAccounts} = hre;
	const {deploy} = deployments;

	const {deployer, simpleERC20Beneficiary: buyer} = await getNamedAccounts();
	const chainId = await getChainId();

	console.log('Deploying to Chain : ', chainId)

	const initVirtualEthReserve = PopCoinDeploymentParameters[+chainId]?.initVirtualEthReserve || 10;
	const createTokenFee = PopCoinDeploymentParameters[+chainId]?.createTokenFee??0.005;
	const deployLiquidityFee= PopCoinDeploymentParameters[+chainId]?.deployLiquidityFee || 1.5
	const transactionFeePercent_x_100 = PopCoinDeploymentParameters[+chainId]?.transactionFeePercent_x_100 || 100;

	let routerAddresses: string[] = ROUTER_ADDRESSES[+chainId];

	if(chainId == '31337'){
		const routerContract = await ethers.getContract('PancakeRouter');
		routerAddresses=[];
		routerAddresses.push(routerContract.address);
	}
	// else if(chainId == '2522' || chainId == '2713017997578000'){// add zswap router
	// 	const routerContract = await ethers.getContract('PancakeRouter');
	// 	routerAddresses.push(routerContract.address);		
	// }
	
	//complete the 4
	const remaining = 4-routerAddresses.length
	for (let i = 0; i < remaining; i++) {
		routerAddresses.push(ethers.constants.AddressZero);		
	}

	
	await deploy('PopCoinFactoryV2', {
		from: deployer,
		args: [
			parseEther(initVirtualEthReserve.toString()) ,
			parseEther(createTokenFee.toString()) ,
			parseEther(deployLiquidityFee.toString()) ,
			transactionFeePercent_x_100 ,
			routerAddresses
		],
		log: true,
		autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
	});

	if(chainId=='4002'){
		const pContract = await ethers.getContract('PopCoinFactoryV2');
		//@ts-ignore
		let routerSupported = await pContract.routersSupported('0xa6AD18C2aC47803E193F75c3677b14BF19B94883');
		console.log('is router supported: ', routerSupported)
		if(!routerSupported){
			// @ts-ignore
			const tx = await pContract.switchDexRouterSupport('0xa6AD18C2aC47803E193F75c3677b14BF19B94883', true);
			await tx.wait();
		}
		
	}

	if(chainId=='250'){
		const pContract = await ethers.getContract('PopCoinFactoryV2');
		const extraDEXes = [
			"0x1b02da8cb0d097eb8d57a175b88c7d8b47997506", // sushi
			"0x5023882f4d1ec10544fcb2066abe9c1645e95aa0", // wigo
			"0xD0c22A5435F4E8E5770C1fAFb5374015FC12F7cD" // odos
		  ]
		  
		for (let index = 0; index < extraDEXes.length; index++) {
			const dex = extraDEXes[index];
			// @ts-ignore
			let routerSupported = await pContract.routersSupported(dex);
			if(!routerSupported){
				// @ts-ignore
				let tx = await pContract.switchDexRouterSupport(dex, true);//sushi
				await tx.wait();
			}
		}  
		
	}
	
	
};
export default func;
func.tags = ['PopCoin'];
func.dependencies = [];
