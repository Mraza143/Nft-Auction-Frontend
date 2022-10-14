import { gql } from "@apollo/client"

const GET_ACTIVE_AUCTIONS = gql`
{
  auctions(where: { active : true}) {
    id
    nftSeller
    nftAddress
    tokenId
    active
    currentPrice
  }

}
`
export default GET_ACTIVE_AUCTIONS