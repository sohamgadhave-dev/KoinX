import { useEffect, useCallback } from 'react';
import { useHarvesting } from '../../context/HarvestingContext';
import { fetchHoldings, fetchCapitalGains } from '../../api/api';
import Disclaimer from '../Disclaimer/Disclaimer';
import CapitalGainsCards from '../CapitalGainsCards/CapitalGainsCards';
import HoldingsTable from '../HoldingsTable/HoldingsTable';
import styles from './TaxHarvestingPage.module.css';

export default function TaxHarvestingPage() {
  const { setHoldings, setCapitalGains, setLoading, setError, error } = useHarvesting();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [holdingsData, gainsData] = await Promise.all([
        fetchHoldings(),
        fetchCapitalGains(),
      ]);
      setHoldings(holdingsData);
      setCapitalGains(gainsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    }
  }, [setHoldings, setCapitalGains, setLoading, setError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <main className={styles.page} id="tax-harvesting-page">
      {/* Title Row */}
      <div className={styles.titleRow}>
        <h1 className={styles.pageTitle}>Tax Harvesting</h1>
        <div className={styles.tooltipContainer}>
          <a href="#" className={styles.howItWorks} id="how-it-works-link">
            How it works?
          </a>
          <div className={styles.tooltip}>
            <ul className={styles.tooltipList}>
              <li>See your capital gains for FY 2024-25 in the left card</li>
              <li>Check boxes for assets you plan on selling to reduce your tax liability</li>
              <li>Instantly see your updated tax liability in the right card</li>
            </ul>
            <p className={styles.tooltipProTip}>
              <strong>Pro tip:</strong> Experiment with different combinations of your holdings to optimize your tax liability
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <Disclaimer />

      {/* Error State */}
      {error && (
        <div className={styles.errorState}>
          <p>⚠️ {error}</p>
          <button className={styles.errorRetry} onClick={loadData}>
            Retry
          </button>
        </div>
      )}

      {/* Capital Gains Cards */}
      <CapitalGainsCards />

      {/* Holdings Table */}
      <HoldingsTable />
    </main>
  );
}
