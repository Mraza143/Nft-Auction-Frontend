import {  useMoralis } from "react-moralis"
import AuctionBox from "../components/AuctionBox"
import GET_ACTIVE_AUCTIONS from "../constants/queries/GET_ACTIVE_AUCTIONS"
import { useQuery } from "@apollo/client"

export default function Home() {
    const { isWeb3Enabled} = useMoralis()
    const { loading, error, data: activeAuctions } = useQuery(GET_ACTIVE_AUCTIONS)

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">These are the auctions currently ongoing</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    loading || !activeAuctions ? (
                        <div>Loading...</div>
                    ) : (
                        activeAuctions.auctions.map((auction) => {
                            console.log(auction)
                            const { currentPrice, nftAddress, tokenId, nftSeller } = auction
                            return (
                                <AuctionBox
                                    price={currentPrice}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    seller={nftSeller}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            )
                        })
                    )
                ) : (
                    <div>Hey Mate! Maybe Try connecting your metamask?</div>
                )}
            </div>
        </div>
    )
}