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
    const { isWeb3Enabled , chainId  , account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [date ,setDate]=  useState("");
    const [auctionEnded,setAuctionEnded] = useState(false)
    const [isOwnedByUser,setIsOwnedByUser] = useState(false)
    const [isAuctionWinner,setisAuctionWinner] = useState(false)
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

        async function WithdrawWinningBid() {
        console.log("Withdrawing Winning Bid")
        const WithdrawWinningBidOptions = {
            abi: nftAuctionAbi,
            contractAddress: auctionAddress,
            functionName: "withdrawWinningBid",
            params: {
                _nftContractAddress: nftAddress,
                _tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: WithdrawWinningBidOptions,
            onSuccess: WithdrawWinningBidSuccess,
            onError: (error) => console.log(error),
        })
    }
    async function WithdrawWinningBidSuccess(tx) {
        await tx.wait(1)
        console.log("You have received the winning bid in your wallet")
        dispatch({
            type: "success",
            message: "Bid has been placed",
            title: "Your bid has been made",
            position: "topR",
        })
    }


    async function WithdrawNft() {
        console.log("Withdrawing Nft after unsuccesful Auction")
        const WithdrawNftOptions = {
            abi: nftAuctionAbi,
            contractAddress: auctionAddress,
            functionName: "withdrawNft",
            params: {
                _nftContractAddress: nftAddress,
                _tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: WithdrawNftOptions,
            onSuccess: WithdrawNftSuccess,
            onError: (error) => console.log(error),
        })
    }

    async function WithdrawNftSuccess(tx) {
        await tx.wait(1)
        console.log("You have received the nft in your wallet as the auction ended without no bids")
        dispatch({
            type: "success",
            message: "You have reeeived the nft",
            title: "Nft Received",
            position: "topR",
        })
    }


    async function ClaimNft() {
        console.log("Claiming Nft after Winning Auction")
        const ClaimNftOptions = {
            abi: nftAuctionAbi,
            contractAddress: auctionAddress,
            functionName: "receiveNft",
            params: {
                _nftContractAddress: nftAddress,
                _tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: ClaimNftOptions,
            onSuccess: ClaimNftSuccess,
            onError: (error) => console.log(error),
        })
    }

    async function  ClaimNftSuccess(tx) {
        await tx.wait(1)
        console.log("You have received the nft in your wallet as the as your made the highest winning bid")
        dispatch({
            type: "success",
            message: "You have reeeived the nft",
            title: "Auction Wonnnnnnnn!!!!!!!",
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


    const { runContractFunction: getStartingTime } = useWeb3Contract({
        abi: nftAuctionAbi,
        contractAddress: auctionAddress,
        functionName: "getStartingTimeOfAuction",
        params: {
            _nftContractAddress: nftAddress,
            _tokenId: tokenId,
        },
    })


    const { runContractFunction: getWinnerOfAuction } = useWeb3Contract({
        abi: nftAuctionAbi,
        contractAddress: auctionAddress,
        functionName: "getCurrentWinner",
        params: {
            _nftContractAddress: nftAddress,
            _tokenId: tokenId,
        },
    })

    const { runContractFunction: getAuctionInterval } = useWeb3Contract({
        abi: nftAuctionAbi,
        contractAddress: auctionAddress,
        functionName: "getIntervalOfNftAuction",
        params: {
            _nftContractAddress: nftAddress,
            _tokenId: tokenId,
        },
    })

    const { runContractFunction: getSellerOfTheNft } = useWeb3Contract({
        abi: nftAuctionAbi,
        contractAddress: auctionAddress,
        functionName: "getSellerOfTheNft",
        params: {
            _nftContractAddress: nftAddress,
            _tokenId: tokenId,
        },
    })

    async function updateUI() {
        const tokenURI = await getTokenURI()
        console.log(`The TokenURI is ${tokenURI}`)
        const startingTime =  await getStartingTime()
        //console.log(`auction was started at  ${startingTime}`)
        const durationOfAuction = await getAuctionInterval()
        //console.log(`duration of auction is ${durationOfAuction}`)
        const currentTime = Math.round(Date.now() / 1000)
        //console.log(`Current time is ${currentTime}`)
        if(startingTime+durationOfAuction<currentTime < currentTime){
            setAuctionEnded(true)
        }
        const seller = await getSellerOfTheNft()
        console.log(`seller ${seller}`)
        console.log(account)
        account==seller?.toLowerCase()?setIsOwnedByUser(true):setIsOwnedByUser(false)

        const winner = await getWinnerOfAuction()
        account==winner?.toLowerCase()?setisAuctionWinner(true): setisAuctionWinner(false)

        if (tokenURI) {
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse?.image
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURIURL)
            
            setTokenName(tokenURIResponse?.name)
            setTokenDescription(tokenURIResponse?.description)
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

                        <div style={{ "minHeight": "100vh" }}>
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
                            <div className="flex">
                            {loadingBids?( <div>ff</div>) :(
                               specificBids.bids.map((bid) => {

                                    const { bidMaker, price } = bid
                                    return (
                                       <div>
                                        <h1>These are the bids which have been made on this nft Auction</h1>
                                        <div className="flex ml-20 mt-20">
                                            <p>{bidMaker}</p>
                                            <p>{ethers.utils.formatUnits(price, "ether")}</p>
                                            {console.log(date)}
                                        </div>
                                        </div>
                                    )
                                }))

}
{auctionEnded?(
    isOwnedByUser?(
        <div>
        <div><button onClick={WithdrawWinningBid}>Withdraw Winning Bid </button></div>
        <div><button onClick={WithdrawNft}>Withdraw Nft</button></div>
        </div>
    ):(
        isAuctionWinner?(<div><button onClick={ClaimNft}>Claim Your Nft</button></div>):(
            <div> </div>
        )
        
    )
):(
                                        <div> </div>
                                    )}
                        </div>
                        </div>
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}
