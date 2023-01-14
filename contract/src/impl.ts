import { call, initialize, LookupMap, UnorderedMap, view } from "near-sdk-js";
import { AccountId } from "near-sdk-js/lib/types";
import { NFTContractMetadata, Token, TokenId, TokenMetadata } from "./metadata";
import { check_onwer } from "./utils";

export class Contract {
  owner_id: AccountId;
  tokens_per_owner: LookupMap = new LookupMap("tokens_per_owner"); // {accountId , TokenId}
  tokens_by_id: LookupMap = new LookupMap("tokens_by_id"); // {token_id, Token}
  token_metadata_by_id: UnorderedMap = new UnorderedMap("token_metadata_by_id"); // {tokenId, TokenMetadata}
  metadata: NFTContractMetadata = new NFTContractMetadata({
    spec: "nft-1.0.0",
    name: "VGM KHOA K10",
    symbol: "VGMK10",
  });

  @initialize({ privateFunction: true })
  init({ owner_id }: { owner_id: AccountId }) {
    this.owner_id = owner_id;
  }

  @call({ payableFunction: true })
  mint_nft({
    token_id,
    owner_id,
    metadata,
    receiver_id,
  }: {
    token_id: TokenId;
    owner_id: AccountId;
    metadata: TokenMetadata;
    receiver_id: AccountId;
  }) {}

  @call({ payableFunction: true })
  nft_transfer({
    receiver_id,
    token_id,
    approval_id,
    memo,
  }: {
    receiver_id: AccountId;
    token_id: TokenId;
    approval_id: AccountId;
    memo: string | null;
  }) {}

  @call({ payableFunction: true })
  nft_transfer_call({
    owner_id,
    receiver_id,
    token_id,
    approved_account_ids,
  }: {
    owner_id: AccountId;
    receiver_id: AccountId;
    token_id: TokenId;
    approved_account_ids: null | Record<string, number>;
  }) {}

  @call({ privateFunction: true })
  nft_resolve_transfer({
    owner_id,
    receiver_id,
    token_id,
    approved_account_ids,
  }: {
    owner_id: AccountId;
    receiver_id: AccountId;
    token_id: TokenId;
    approved_account_ids: null | Record<string, number>;
  }) {}

  @view({})
  nft_total_supply(): number {
    return this.token_metadata_by_id.length;
  }

  @view({})
  nft_supply_for_owner({ account_id }: { account_id: AccountId }): number {
    let tokens = check_onwer(this.tokens_per_owner.get(account_id));
    if (tokens == null) {
      return 0;
    }
    return tokens.length;
  }

  @view({})
  nft_token({ token_id }: { token_id: TokenId }): Token {
    let token = this.tokens_by_id.get(token_id) as Token;

    if (token == null) {
      return null;
    }

    let metadata = this.token_metadata_by_id.get(
      token_id
    ) as NFTContractMetadata;

    return new Token({
      token_id,
      owner_id: token.owner_id,
      metadata,
    });
  }

  @view({})
  nft_tokens({
    from_index,
    limit,
  }: {
    from_index: number | null;
    limit: number | null;
  }): Token[] {
    let tokens = [];
    let start = from_index ? from_index : 0;
    let max = limit ? limit : 50;
    let keys = this.token_metadata_by_id.toArray();
    for (let i = start; i < keys.length && i < max; i++) {
      let token = this.nft_token({ token_id: keys[i][0] });
      tokens.push(token);
    }
    return tokens;
  }

  @view({})
  nft_tokens_for_owner({
    account_id,
    from_index,
    limit,
  }: {
    account_id: AccountId;
    from_index?: number;
    limit?: number;
  }): Token[] {
    let tokens = [];
    let start = from_index ? from_index : 0;
    let max = limit ? limit : 50;
    let token_check = check_onwer(this.tokens_per_owner.get(account_id));
    if (token_check == null) return [];
    let keys = token_check.toArray();

    for (let i = start; i < max; i++) {
      if (i >= keys.length) {
        break;
      }
      let token = this.nft_token({ token_id: keys[i] });
      tokens.push(token);
    }

    return tokens;
  }

  @view({})
  nft_metadata(): NFTContractMetadata {
    return this.metadata;
  }
}
