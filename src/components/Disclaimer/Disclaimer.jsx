import { useState } from 'react';
import styles from './Disclaimer.module.css';

export default function Disclaimer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.wrapper} id="disclaimer-section">
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="disclaimer-content"
        id="disclaimer-toggle"
      >
        <span className={styles.triggerLeft}>
          <span className={styles.infoIcon}>ℹ</span>
          <span>Important Notes & Disclaimers</span>
        </span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        className={`${styles.content} ${isOpen ? styles.contentOpen : ''}`}
        id="disclaimer-content"
        role="region"
        aria-labelledby="disclaimer-toggle"
      >
        <ul className={styles.list}>
          <li>Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.</li>
          <li>Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.</li>
          <li>Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.</li>
          <li>Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.</li>
          <li>Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.</li>
        </ul>
      </div>
    </div>
  );
}
