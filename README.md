# Solana test

[local development](https://solanacookbook.com/ja/references/local-development.html#%E3%83%AD%E3%83%BC%E3%82%AB%E3%83%AB%E3%83%8F%E3%82%99%E3%83%AA%E3%83%86%E3%82%99%E3%83%BC%E3%82%BF%E3%83%BC%E3%81%AE%E9%96%8B%E5%A7%8B)


## how to confirm deployed program

```bash
$ solana program show <PROGRAM_ID> --url https://api.devnet.solana.com

# Program Id: CUCbjaj1WJRmzaefDZNXJ4zt53kMr8bPpKCvZeSFrCgS
# Owner: BPFLoaderUpgradeab1e11111111111111111111111
# ProgramData Address: 9FZb3ZeT2XUsZq2xms9YqJ3Vhe1RnfNcDePD7DpgCT5t
# Authority: 5hocSQdSFVNHv4cadik9AhC9en4DUqk1cH7EvLtvVqnr
# Last Deployed In Slot: 325995000
# Data Length: 19232 (0x4b20) bytes
# Balance: 1.1350588 SOL

# 送金
$ solana transfer <ProgramData Address> <AMOUNT> --url https://api.devnet.solana.com

# Signature: 2e8dm3VGjxzHS9Z6ZMaquLtFTPs41sGMj4M65yNsTm89HHpjAijsHTsnzuPHfrSM9wYt12TEMTqqvQnRrGDu5zV8
```

signature が帰ってきたら， 
1. `https://explorer.solana.com/` にアクセス
2. ネットワークを `Devnet` に切り替え
3. `Signature` を検索バーに張り付け

## On backend

[Ref](https://solana.com/developers/guides/getstarted/local-rust-hello-world)

```bash
$ node client.mjs
```

デフォルトのキーペアを `~/.config/solana/id.json` にしておく必要がある．また，残高も必要