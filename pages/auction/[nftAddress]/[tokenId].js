import { useWeb3Contract, useMoralis } from "react-moralis"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useQuery } from "@apollo/client"
import { useRouter } from "next/router"
import { Form, useNotification, Button } from "web3uikit"
import nftAbi from "../../../constants/Erc721Mock.json"
import styles from "../../../styles/Home.module.css"
import nftAuctionAbi from "../../../constants/Auction.json"
import networkMapping from "../../../constants/contractAddresses.json"
import GET_SPECIFIC_AUCTION from "../../../constants/queries/GET_SPECIFIC_AUCTION"
import GET_AUCTION_BIDS from "../../../constants/queries/GET_AUCTION_BIDS"


export default function auction() {
    const router = useRouter()
    const { nftAddress, tokenId } = router.query
    const { isWeb3Enabled , chainId } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const {
        data: specificBids,
        loading:loadingBids
    } = useQuery(GET_AUCTION_BIDS, {
        variables: { nftAddress, tokenId },
    })
    const {
        loading,
        error,
        data: specificAuction,
    } = useQuery(GET_SPECIFIC_AUCTION, {
        variables: { nftAddress, tokenId },
    })
    console.log(specificBids?.bids)
    const { runContractFunction } = useWeb3Contract()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const auctionAddress = networkMapping[chainString].Auction[0]
    const dispatch = useNotification()

    async function MakeBid(data) {
        console.log("Making Bid...")
        const msgVal = ethers.utils.parseUnits(data.data[0].inputResult, "ether").toString()        
        const makeBidOptions = {
            abi: nftAuctionAbi,
            contractAddress: auctionAddress,
            functionName: "makeBid",
            params: {
                _nftContractAddress: nftAddress,
                _tokenId: tokenId,
            },
            msgValue:msgVal

        }

        await runContractFunction({
            params: makeBidOptions,
            onSuccess: handleBidSuccess,
            onError: (error) => console.log(error),
        })
    }

    async function handleBidSuccess(tx) {
        await tx.wait(1)
        console.log("Bid Initialized. Please wait for about 30 seconds to see your bid in Bids Section  of this nft")
        dispatch({
            type: "success",
            message: "Bid has been placed",
            title: "Your bid has been made",
            position: "topR",
        })
    }


    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    async function updateUI() {
        const tokenURI = await getTokenURI()
        console.log(`The TokenURI is ${tokenURI}`)
        if (tokenURI) {
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">The details of the Nft</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    loading || !specificAuction ? (
                        <div>Loading...</div>
                    ) : (

                        <div style={{ "min-height": "100vh" }}>
                            <div className="flex ml-20 mt-20">
                                <img src={imageURI} alt="" className="w-2/5" />
                                <div className="text-xl ml-20 space-y-8 text-black shadow-2xl rounded-lg border-2 p-5">
                                    <div>Name: {tokenName}</div>
                                    <div>Description: {tokenDescription}</div>
                                    <div>
                                        Price:{" "}
                                        <span className="">
                                        
                                            {ethers.utils.formatUnits(specificAuction.auctions[0].currentPrice, "ether")}
                                        </span>
                                    </div>
                                    <div>
                                        Nft Owner:{" "}
                                        <span className="text-sm">
                                            {specificAuction.auctions[0].nftSeller}
                                        </span>
                                    </div>
                                    <div></div>
                                </div>
                                <div>
                                <div className={styles.container}>
            <Form
            
                onSubmit={MakeBid}
                data={[
                    {
                        name: "Bid Price In Eth",
                        type: "number",
                        inputWidth: "50%",
                        value: "",
                        key: "msgVal",
                    }
                ]}
                title="Make A Bid On this Nft"
                id="Main Form"
            />
        </div>
                                </div>
                            </div>
                            {loadingBids?( <div>ff</div>) :(
                               specificBids.bids.map((bid) => {

                                    const { bidMaker, price } = bid
                                    return (
                                       <div>
                                        <h1>These are the bids which have been made on this nft Auction</h1>
                                        <div className="flex ml-20 mt-20">
                                            <p>{bidMaker}</p>
                                            <p>{ethers.utils.formatUnits(price, "ether")}</p>
                                        </div>
                                        </div>
                                    )
                                }))
}
                        </div>
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}
