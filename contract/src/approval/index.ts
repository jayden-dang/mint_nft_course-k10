import { NearPromise } from "near-sdk-js";
import { AccountId } from "near-sdk-js/lib/types";
import { Option } from "../metadata";
import { TokenId } from "../token";

export interface NonFungibleTokenApproval {
  nft_approve({
    token_id,
    account_id,
    msg,
  }: {
    token_id: TokenId;
    account_id: AccountId;
    msg?: string;
  }): Option<NearPromise>;

  nft_revoke({
    token_id,
    account_id,
  }: {
    token_id: TokenId;
    account_id: AccountId;
  });
  nft_revoke_all({ token_id }: { token_id: TokenId });
  nft_is_approved({
    token_id,
    approved_account_id,
    approval_id,
  }: {
    token_id: TokenId;
    approved_account_id: AccountId;
    approval_id?: bigint;
  }): boolean;
}
