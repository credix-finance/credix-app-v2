import type {NextPage} from 'next'
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'
import styles from '../styles/Overview.module.css'

const Overview: NextPage = () => <div className={styles.container}>
  <main className={styles.main}>
    <div className={styles.walletButtons}>
      <WalletMultiButton className="bg-white text-gray-900 hover:text-white"/>
      <WalletDisconnectButton className="bg-white text-gray-900 hover:text-white"/>
    </div>
  </main>
</div>

export default Overview
