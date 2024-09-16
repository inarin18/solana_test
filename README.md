# Solana 環境構築

## 1. How to install Solana

### 1.1 Install Solana
```bash
# Solana CLIのインストール（Linux / macOSの場合）
# Solana tutrial と同じバージョン（latest）が好ましい
sh -c "$(curl -sSfL https://release.solana.com/v1.18.18/install)"

# シェル（ターミナル）の再起動を行うか，exportしてPATHを通す
export PATH="/home/ユーザー/.local/share/solana/install/active_release/bin:$PATH"

# インストールが完了したか確認
solana --version
```

### 1.2 Create a Wallet
```bash
# 新しいウォレットを作成
solana-keygen new --outfile ~/.config/solana/id.json

# デフォルトのキーペアに設定
solana config set --keypair ~/.config/solana/id.json

# ウォレットアドレスを表示
solana address
```

### 1.3 開発環境の選択

[local development](https://solanacookbook.com/ja/references/local-development.html#%E3%83%AD%E3%83%BC%E3%82%AB%E3%83%AB%E3%83%8F%E3%82%99%E3%83%AA%E3%83%86%E3%82%99%E3%83%BC%E3%82%BF%E3%83%BC%E3%81%AE%E9%96%8B%E5%A7%8B)

1. local でサーバを立ててその上で検証
2. devnet を利用

#### 1.3.1 

#### 1.3.2 Connect to Devnet
```bash
# Devnetに接続
solana config set --url https://api.devnet.solana.com

# Devnetの接続確認
solana cluster-version
```

### 1.4 Gain the SOL

```bash
# 開発環境上でテスト用SOLを受け取る
solana airdrop <AMOUNT>
```

---

## 2. Smart Contract

Solana の開発環境が整ったところで Rust を用いたスマートコントラクト

### 2.1 setup the environments
```bash
# Rustのインストール
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Solana用のツール（Anchor）をインストール
npm install -g @project-serum/anchor-cli

# Rust開発ツールのインストール
rustup component add rustfmt
```

### 2.2 make solana programs (Rust)
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

### 2.3 build and deploy
```bash
# プログラムのビルド
cargo-build-sbf --manifest-path=Cargo.toml --sbf-out-dir=dist/program

# Devnetにプログラムをデプロイ
solana program deploy dist/program/{objct_name}.so
```


もし rustc のバージョン回りでエラーが出るのであれば solana を最新版にアップデート
```bash
solana-install init {latest-version}
```
[>> Reference](https://solana.stackexchange.com/questions/6875/error-package-toml-datetime-v0-6-2-cannot-be-built-because-it-requires-rustc-1)

### 2.4 Execute Smart Contract on CUI

まずはデプロイ後に出力された情報から PRGRAM_ID を用いて，デプロイされたプログラムのアドレスなどの情報を表示する．
```bash
solana program show <PROGRAM_ID> --url https://api.devnet.solana.com

# 出力 >>>
# Program Id: CUCbjaj1WJRmzaefDZNXJ4zt53kMr8bPpKCvZeSFrCgS
# Owner: BPFLoaderUpgradeab1e11111111111111111111111
# ProgramData Address: 9FZb3ZeT2XUsZq2xms9YqJ3Vhe1RnfNcDePD7DpgCT5t
# Authority: 5hocSQdSFVNHv4cadik9AhC9en4DUqk1cH7EvLtvVqnr
# Last Deployed In Slot: 325995000
# Data Length: 19232 (0x4b20) bytes
# Balance: 1.1350588 SOL
```

アドレスを得たら，そのアドレスに対して送金を行う．

```bash
solana transfer <ProgramData Address> <AMOUNT> --url https://api.devnet.solana.com

# Signature: 2e8dm3VGjxzHS9Z6ZMaquLtFTPs41sGMj4M65yNsTm89HHpjAijsHTsnzuPHfrSM9wYt12TEMTqqvQnRrGDu5zV8
```
送金後，署名（Signature）が返ってくるので，その後以下を実行することでプログラムの実効結果がわかる．

1. `https://explorer.solana.com/` にアクセス
2. ネットワークを `Devnet` に切り替え
3. `Signature` を検索バーに張り付け



### 2.5 Execute Smart Contract on backend

CUI 上ではなく `node.js` を用いてバックエンド側から送金をしてスマートコントラクトを実行することもできる（コマンドの実行はとりあえずCUI上）．

#### 2.5.1 install
必要なモジュールをインストール
```bash
# Solana Web3.jsのインストール
npm install @solana/web3.js @solana-developers/helpers
```

#### 2.5.2 JavaScript プログラム

プログラムIDを所定の場所に貼り付ける．
```javascript
// ~/backend/client.mjs
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { getKeypairFromFile } from "@solana-developers/helpers";
 
const programId = new PublicKey("YOUR_PROGRAM_ID");
 
// Connect to a solana cluster. Either to your local test validator or to devnet
const connection = new Connection("http://localhost:8899", "confirmed");
//const connection = new Connection("https://api.devnet.solana.com", "confirmed");
 
// We load the keypair that we created in a previous step
const keyPair = await getKeypairFromFile("~/.config/solana/id.json");
 
// Every transaction requires a blockhash
const blockhashInfo = await connection.getLatestBlockhash();
 
// Create a new transaction
const tx = new Transaction({
  ...blockhashInfo,
});
 
// Add our Hello World instruction
tx.add(
  new TransactionInstruction({
    programId: programId,
    keys: [],
    data: Buffer.from([]),
  }),
);
 
// Sign the transaction with your previously created keypair
tx.sign(keyPair);
 
// Send the transaction to the Solana network
const txHash = await connection.sendRawTransaction(tx.serialize());
 
console.log("Transaction sent with hash:", txHash);
 
await connection.confirmTransaction({
  blockhash: blockhashInfo.blockhash,
  lastValidBlockHeight: blockhashInfo.lastValidBlockHeight,
  signature: txHash,
});
 
console.log(
  `Congratulations! Look at your ‘Hello World’ transaction in the Solana Explorer:
  https://explorer.solana.com/tx/${txHash}?cluster=custom`,
);
```

#### 2.5.3 実行

デフォルトのキーペアを `~/.config/solana/id.json` にしておく必要がある．また，残高も必要．
```bash
# デフォルトのキーペア設定
solana config set --keypair ~/.config/solana/id.json

# 残高の追加
solana airdrop <AMOUNT>
```

実行．

```bash
node client.mjs
```

出力されたURLに飛ぶとスマートコントラクトの内容が見れる．

もし，実行時に link できないみたいなエラーが出る時は，以下のファイル内の `.js.js` を `.js` に直すと良い．
```javascript
// in node_modules/@solana-developer/helpers/dist/esm/index.js

export * from './lib/keypair.js.js';

// 修正後
export * from './lib/keypair.js'
```

#### 2.5.4 おまけ ： Send Transaction using JavaScript
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

## 3. 無料？
はい、Solanaでの開発は基本的に**無料**で始められます。ただし、実際にメインネット上で動作するアプリケーションを運用する場合にはトランザクションに必要な**SOLトークン**が必要になりますが、以下の方法で無料で開発を進めることが可能です。

### 3.1 無料でできる部分

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

### 3.2 メインネットでの利用に関するコスト
Solanaのメインネットでアプリケーションを運用する場合、**SOLトークン**を使用してトランザクション手数料を支払う必要があります。しかし、Solanaの手数料は非常に低く、1トランザクションあたり数十セント以下（場合によっては0.00001 SOL程度）で処理できます。

もし、商用での展開を考えている場合でも、最初の開発段階ではDevnetを利用して無料で進め、後にメインネットに移行することが一般的な流れです。

### 3.3 まとめ
- Solanaの開発は**Devnet**を利用することで無料で行えます。
- Devnet上では、**Airdrop**で無料でSOLを取得してトランザクションを実行できます。
- メインネット上でアプリケーションを運用する際にはSOLトークンが必要ですが、その手数料は非常に低く抑えられています。

最初の開発段階やテストは基本的に無料でできるため、コストの心配は少なくて済みます。
