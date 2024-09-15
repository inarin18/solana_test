# How to install Solana

## Install Solana
```bash
# Solana CLIのインストール（Linux / macOSの場合）
sh -c "$(curl -sSfL https://release.solana.com/v1.18.18/install)"

# PATHを通すための設定
export PATH="/home/ユーザー/.local/share/solana/install/active_release/bin:$PATH"

# インストールが完了したか確認
solana --version

```

## Create a Wallet
```bash
# 新しいウォレットを作成
solana-keygen new --outfile ~/my-solana-wallet.json

# デフォルトのキーペアに設定
solana config set --keypair ~/my-solana-wallet.json

# ウォレットアドレスを表示
solana address

```


## Connect to Devnet
```bash
# Devnetに接続
solana config set --url https://api.devnet.solana.com

# Devnetの接続確認
solana cluster-version

```

## Gain the SOL

```bash
# Devnetでテスト用SOLを受け取る（2SOL）
solana airdrop 2

```

## Create a Smart Contract

### setup the environments
```bash
# Rustのインストール
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Solana用のツール（Anchor）をインストール
npm install -g @project-serum/anchor-cli

# Rust開発ツールのインストール
rustup component add rustfmt
```

### make solana programs (Rust)
```rust
// src/lib.rs

use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};

entrypoint!(process_instruction);

fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    msg!("Hello, Solana!");
    Ok(())
}
```

### build and deploy
```bash
# プログラムのビルド
cargo-build-sbf --manifest-path=Cargo.toml --sbf-out-dir=dist/program

# Devnetにプログラムをデプロイ
solana program deploy dist/program/{objct_name}.so

```


#### For Help
```bash
# 効かなそう
solana-install update
```

```bash
# From StackOverFlow
# https://solana.stackexchange.com/questions/6875/error-package-toml-datetime-v0-6-2-cannot-be-built-because-it-requires-rustc-1
solana-install init 1.18.18
```


## Relate with the frontend of the Solana Program

### install
```bash
# Solana Web3.jsのインストール
npm install @solana/web3.js

```

### Send Transaction using JavaScript
```javascript
const solanaWeb3 = require('@solana/web3.js');

(async () => {
    // Solanaネットワークに接続
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');

    // ウォレット作成
    const fromWallet = solanaWeb3.Keypair.generate();

    // Airdropで2SOLを取得
    const airdropSignature = await connection.requestAirdrop(
        fromWallet.publicKey,
        solanaWeb3.LAMPORTS_PER_SOL * 2,
    );

    // トランザクションの確認
    await connection.confirmTransaction(airdropSignature);

    console.log(`ウォレットアドレス: ${fromWallet.publicKey.toBase58()}`);
})();

```

## 無料？
はい、Solanaでの開発は基本的に**無料**で始められます。ただし、実際にメインネット上で動作するアプリケーションを運用する場合にはトランザクションに必要な**SOLトークン**が必要になりますが、以下の方法で無料で開発を進めることが可能です。

### 無料でできる部分

1. **Devnetの利用**  
   Solanaには開発者向けの**Devnet**というテストネットがあります。ここでは、実際のSolanaメインネットと同様の環境でスマートコントラクトやアプリケーションの開発とテストが行えます。Devnetでは、トランザクション手数料はかからず、Airdropを通じて無料でSOLを取得してテストができます。

   ```bash
   # Devnetでテスト用SOLを無料で取得
   solana airdrop 2
   ```

   このAirdropでDevnet上のテスト用SOLを無料で取得できるため、コストなしでスマートコントラクトやDAppの開発・テストが可能です。

2. **ローカル開発環境の構築**  
   自分のコンピュータ上でSolanaのローカル環境を構築して、Solanaネットワークに接続せずにスマートコントラクトの開発を行うこともできます。これにより、インターネットに接続しない状態でもアプリケーションの開発とテストができます。

   ```bash
   # Solanaローカルクラスタを起動
   solana-test-validator
   ```

   ローカルクラスタはSolanaネットワークのローカル版で、テスト用のSOLを無制限に使用できます。

### メインネットでの利用に関するコスト
Solanaのメインネットでアプリケーションを運用する場合、**SOLトークン**を使用してトランザクション手数料を支払う必要があります。しかし、Solanaの手数料は非常に低く、1トランザクションあたり数十セント以下（場合によっては0.00001 SOL程度）で処理できます。

もし、商用での展開を考えている場合でも、最初の開発段階ではDevnetを利用して無料で進め、後にメインネットに移行することが一般的な流れです。

### まとめ
- Solanaの開発は**Devnet**を利用することで無料で行えます。
- Devnet上では、**Airdrop**で無料でSOLを取得してトランザクションを実行できます。
- メインネット上でアプリケーションを運用する際にはSOLトークンが必要ですが、その手数料は非常に低く抑えられています。

最初の開発段階やテストは基本的に無料でできるため、コストの心配は少なくて済みます。
