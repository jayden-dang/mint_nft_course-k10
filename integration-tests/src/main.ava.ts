import { Worker, NearAccount } from "near-workspaces";
import anyTest, { TestFn } from "ava";

const test = anyTest as TestFn<{
  worker: Worker;
  accounts: Record<string, NearAccount>;
  token: object;
}>;

test.beforeEach(async (t) => {
  // Init the worker and start a Sandbox server
  const worker = await Worker.init();

  // Deploy contract
  const root = worker.rootAccount;
  const contract = await root.createSubAccount("test-account");
  // Get wasm file path from package.json test script in folder above
  await contract.deploy(process.argv[2]);

  // Save state for test runs, it is unique for each test
  t.context.worker = worker;
  t.context.accounts = { root, contract };

  root.call(contract, "init", {
    owner_id: root,
    prefix: "m",
  });

  t.context.token = await root.call(contract, "mint_nft", {
    token_owner_id: "vugomars.mainnet",
    name: "First",
    description: "The First token",
    media_uri:
      "https://jes.edu.vn/wp-content/uploads/2017/10/h%C3%ACnh-%E1%BA%A3nh.jpg",
    level: 1,
  });
});

test.afterEach.always(async (t) => {
  // Stop Sandbox server
  await t.context.worker.tearDown().catch((error) => {
    console.log("Failed to stop the Sandbox:", error);
  });
});

test("get_token_by_id", async (t) => {
  const { contract } = t.context.accounts;

  const tokens = await contract.view("get_token_by_id", {
    token_id: 0,
  });

  t.deepEqual(tokens, t.context.token);
});

test("get_supply_tokens", async (t) => {
  const { contract } = t.context.accounts;

  const total: number = await contract.view("get_supply_tokens", {});

  t.is(total, 1);
});

test("get_supply_tokens with extra token", async (t) => {
  const { root, contract } = t.context.accounts;

  await root.call(contract, "mint_nft", {
    token_owner_id: "vugomars.mainnet",
    name: "Second",
    description: "The Second token",
    media_uri:
      "https://jes.edu.vn/wp-content/uploads/2017/10/h%C3%ACnh-%E1%BA%A3nh.png",
    level: 2,
  });

  const total: number = await contract.view("get_supply_tokens", {});

  t.is(total, 2);
});

test("get_all_tokens", async (t) => {
  const { contract } = t.context.accounts;

  const tokens: object[] = await contract.view("get_all_tokens", {});

  t.deepEqual(tokens, [
    {
      owner_id: "vugomars.mainnet",
      token_id: 0,
      name: "First",
      description: "The First token",
      media_uri:
        "https://jes.edu.vn/wp-content/uploads/2017/10/h%C3%ACnh-%E1%BA%A3nh.jpg",
      level: 1,
    },
  ]);
});

test("get_all_tokens with extra token", async (t) => {
  const { contract, root } = t.context.accounts;
  await root.call(contract, "mint_nft", {
    token_owner_id: "vugomars.mainnet",
    name: "Second",
    description: "The Second token",
    media_uri:
      "https://jes.edu.vn/wp-content/uploads/2017/10/h%C3%ACnh-%E1%BA%A3nh.png",
    level: 2,
  });
  const tokens: object[] = await contract.view("get_all_tokens", {});

  t.deepEqual(tokens, [
    {
      owner_id: "vugomars.mainnet",
      token_id: 0,
      name: "First",
      description: "The First token",
      media_uri:
        "https://jes.edu.vn/wp-content/uploads/2017/10/h%C3%ACnh-%E1%BA%A3nh.jpg",
      level: 1,
    },
    {
      owner_id: "vugomars.mainnet",
      token_id: 1,
      name: "Second",
      description: "The Second token",
      media_uri:
        "https://jes.edu.vn/wp-content/uploads/2017/10/h%C3%ACnh-%E1%BA%A3nh.png",
      level: 2,
    },
  ]);
});
