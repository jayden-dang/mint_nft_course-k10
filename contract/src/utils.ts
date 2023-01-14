import { UnorderedSet } from "near-sdk-js";

export function check_onwer(collection: any) {
  if (collection == null) {
    return null;
  }
  return UnorderedSet.deserialize(collection as UnorderedSet);
}
