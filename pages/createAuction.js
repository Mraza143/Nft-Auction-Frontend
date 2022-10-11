import styles from "../styles/Home.module.css"
import { Form, useNotification, Button } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import nftAuctionAbi from "../constants/Auction.json"
import networkMapping from "../constants/contractAddresses.json"
import { useEffect, useState } from "react"

export default function Home() {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    //const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]
    const auctionAddress = networkMapping[chainString].Auction[0]
    const dispatch = useNotification()
    const [proceeds, setProceeds] = useState("0")

    const { runContractFunction } = useWeb3Contract()

    async function InitializeAuction(data) {
        console.log("Initializing Auction...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()
        const time = data.data[3].inputResult


        const initializeAuctionOptions = {
            abi: nftAuctionAbi,
            contractAddress: auctionAddress,
            functionName: "InitializeAuction",
            params: {
                _nftContractAddress: nftAddress,
                _tokenId: tokenId,
                _minPrice: price,
                interval:time
            },
        }

        await runContractFunction({
            params: initializeAuctionOptions,
            onSuccess: handleInitializeSuccess,
            onError: (error) => console.log(error),
        })
    }

    async function handleInitializeSuccess(tx) {
        await tx.wait(1)
        console.log("Auction Initialized. Please wait for about 30 seconds to see your auction in Home Pgae of dapp")
        dispatch({
            type: "success",
            message: "NFT Auctioning",
            title: "NFT Auction Listed",
            position: "topR",
        })
    }
    return (
        <div className={styles.container}>
            <Form
                onSubmit={InitializeAuction}
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token ID",
                        type: "number",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "StartingPrice (in ETH)",
                        type: "number",
                        value: "",
                        key: "price",
                    },
                    {
                        name: "Totaltime (in seconds)",
                        type: "number",
                        value: "",
                        key: "time",
                    },
                ]}
                title="Put your NFT on a Auction!"
                id="Main Form"
            />
        </div>
    )
}