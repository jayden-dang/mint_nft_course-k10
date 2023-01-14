import { UnorderedSet } from "near-sdk-js";
import { AccountId } from "near-sdk-js/lib/types";
import { Contract } from "./impl";
import { TokenId } from "./metadata";

export function check_onwer(collection: any) {
  if (collection == null) {
    return null;
  }
  return UnorderedSet.deserialize(collection as UnorderedSet);
}

export function add_token_to_owner({
  contract,
  account_id,
  token_id,
}: {
  contract: Contract;
  account_id: AccountId;
  token_id: TokenId;
}) {
  let check_tokens = check_onwer(contract.tokens_per_owner.get(account_id));
  if ((check_tokens = null)) {
    check_tokens = new UnorderedSet("tokens_per_owner" + account_id);
  }

  check_tokens.set(token_id);

  contract.tokens_per_owner.set(account_id, check_tokens);
}
