import {  useMoralis } from "react-moralis"
import GET_SPECIFIC_AUCTION from "../../../constants/queries/GET_SPECIFIC_AUCTION"
import { useQuery } from "@apollo/client"
import { useRouter } from "next/router";

export default function auction() {
    const router = useRouter();
    const { nftAddress , tokenId } = router.query;
    const { isWeb3Enabled} = useMoralis()
    console.log(nftAddress + tokenId)
    const { loading, error, data: specificAuction } = useQuery(GET_SPECIFIC_AUCTION,{
        variables:{nftAddress, tokenId}
    })

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">These are the auctions currently ongoing</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    loading || !specificAuction ? (
                        <div>Loading...</div>
                    ) : (
                        specificAuction.auctions.map((auction) => {
                            console.log(auction)
                            const { currentPrice, nftAddress, tokenId, nftSeller } = auction
                            return (
                               <div>ff</div>
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}