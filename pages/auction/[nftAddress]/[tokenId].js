import { useWeb3Contract, useMoralis } from "react-moralis"
import { useState, useEffect } from "react"
import GET_SPECIFIC_AUCTION from "../../../constants/queries/GET_SPECIFIC_AUCTION"
import { useQuery } from "@apollo/client"
import { useRouter } from "next/router"
import nftAbi from "../../../constants/Erc721Mock.json"
import { ethers } from "ethers"


export default function auction() {
    const router = useRouter()
    const { nftAddress, tokenId } = router.query
    const { isWeb3Enabled } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const {
        loading,
        error,
        data: specificAuction,
    } = useQuery(GET_SPECIFIC_AUCTION, {
        variables: { nftAddress, tokenId },
    })
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
                                        ethers.utils.formatUnits(specificAuction.auctions[0].currentPrice, "ether")
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
