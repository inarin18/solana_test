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
