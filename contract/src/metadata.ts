import { Bytes } from "near-sdk-js";
import { AccountId } from "near-sdk-js/lib/types";

export type Option<T> = T | null;

/** Metadata for the NFT contract itself. */
export class NFTContractMetadata {
  spec: string;
  name: string;
  symbol: string;
  icon?: string;
  base_uri?: string;
  reference?: string;
  reference_hash?: Bytes;

  constructor({
    spec,
    name,
    symbol,
    icon,
    base_uri,
    reference,
    reference_hash,
  }: {
    spec: string;
    name: string;
    symbol: string;
    icon?: string;
    base_uri?: string;
    reference?: string;
    reference_hash?: string;
  }) {
    this.spec = spec;
    this.name = name;
    this.symbol = symbol;
    this.icon = icon;
    this.base_uri = base_uri;
    this.reference = reference;
    this.reference_hash = reference_hash;
  }
}

export class TokenMetadata {
  public title?: string;
  public description?: string;
  public media?: string;
  public media_hash?: Bytes;
  public copies?: bigint;
  public issued_at?: string;
  public expires_at?: string;
  public starts_at?: string;
  public updated_at?: string;
  public extra?: string;
  public reference?: string;
  public reference_hash?: Bytes;

  constructor({
    title,
    description,
    media,
    media_hash,
    copies,
    issued_at,
    expires_at,
    starts_at,
    updated_at,
    extra,
    reference,
    reference_hash,
  }: {
    title?: string;
    description?: string;
    media?: string;
    media_hash?: Bytes;
    copies?: bigint;
    issued_at?: string;
    expires_at?: string;
    starts_at?: string;
    updated_at?: string;
    extra?: string;
    reference?: string;
    reference_hash?: Bytes;
  }) {
    this.title = title;
    this.description = description;
    this.media = media;
    this.media_hash = media_hash;
    this.copies = copies;
    this.issued_at = issued_at;
    this.expires_at = expires_at;
    this.starts_at = starts_at;
    this.updated_at = updated_at;
    this.extra = extra;
    this.reference = reference;
    this.reference_hash = reference_hash;
  }
}

export interface NonFungibleTokenMeatadataProvider {
  nft_metadata(): NFTContractMetadata;
}

export type TokenId = string;

export class Token {
  public token_id: TokenId;
  public owner_id: AccountId;
  public metadata: TokenMetadata;
  constructor({
    token_id,
    owner_id,
    metadata,
  }: {
    token_id: TokenId;
    owner_id: AccountId;
    metadata: TokenMetadata;
  }) {
    this.token_id = token_id;
    this.owner_id = owner_id;
    this.metadata = metadata;
  }
}
