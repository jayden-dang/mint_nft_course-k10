import { PromiseOrValue } from "near-sdk-js";
import { AccountId } from "near-sdk-js/lib/types";
import { Option } from "../metadata";
import { Token, TokenId } from "../token";

export interface NonFungibleTokenCore {
  nft_transfer({
    receiver_id,
    token_id,
    approval_id,
    memo,
  }: {
    receiver_id: AccountId;
    token_id: TokenId;
    approval_id?: bigint;
    memo?: string;
  });

  nft_transfer_call({
    receiver_id,
    token_id,
    approval_id,
    memo,
  }: {
    receiver_id: AccountId;
    token_id: TokenId;
    approval_id?: bigint;
    memo?: string;
    msg: string;
  });

  /** Returns the token with the given `token_id` or `null` if no such token. */
  nft_token({ token_id }: { token_id: TokenId }): Option<Token>;

  nft_on_transfer({
    sender_id,
    previous_owner_id,
    token_id,
    msg,
  }: {
    sender_id: AccountId;
    previous_owner_id: AccountId;
    token_id: TokenId;
    msg: string;
  }): PromiseOrValue<boolean>;

  nft_resolve_transfer({
    previous_owner_id,
    receiver_id,
    token_id,
    approved_account_ids,
  }: {
    previous_owner_id: AccountId;
    receiver_id: AccountId;
    token_id: TokenId;
    approved_account_ids?: { [approval: AccountId]: bigint };
  }): boolean;
}
