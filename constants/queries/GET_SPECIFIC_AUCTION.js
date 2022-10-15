import { gql } from "@apollo/client"

const GET_SPECIFIC_AUCTION = gql`
query auction($nftAddress:Bytes! , $tokenId : BigInt!) {

  auctions(where: { nftAddress:$nftAddress , tokenId : $tokenId}) {
    id
    nftSeller
    nftAddress
    tokenId
    active
    currentPrice

}
}
`
export default GET_SPECIFIC_AUCTION