/** @format */

import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/dist/types"
import { ethers } from "hardhat"

const deployGovernanceToken: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment,
) {
	const { getNamedAccounts, deployments, network } = hre
	const { deploy, log } = deployments
	const { deployer } = await getNamedAccounts()
	log("Deploying Governance Token....")
	const governanceToken = await deploy("GovernanceToken", {
		from: deployer,
		args: [],
		log: true,
	})
	log(`Deploy governance token to address ${governanceToken.address}`)

	await delegate(governanceToken.address, deployer)
	log("Delegated!")
}

const delegate = async (
	deployGovernanceTokenAddress: string,
	delegatedAccount: string,
) => {
	const governanceToken = await ethers.getContractAt(
		"GovernanceToken",
		deployGovernanceTokenAddress,
	)
	const tx = await governanceToken.delegate(delegatedAccount)
	await tx.wait(1)
	console.log(
		`Checkpoints ${await governanceToken.numCheckpoints(delegatedAccount)}`,
	)
}

export default deployGovernanceToken
