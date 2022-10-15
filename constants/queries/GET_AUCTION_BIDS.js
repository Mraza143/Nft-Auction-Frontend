import { gql } from "@apollo/client"

const GET_AUCTION_BIDS = gql`
query bid($nftAddress:Bytes! , $tokenId : BigInt!) {

  bids(where: { nftAddress:$nftAddress , tokenId : $tokenId}) {
    id
    nftAddress
    tokenId
    price
    bidMaker
}
}
`
export default GET_AUCTION_BIDS