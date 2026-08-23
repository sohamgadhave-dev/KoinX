import { useHarvesting } from '../../context/HarvestingContext';
import { formatCurrency, formatAbbreviated } from '../../utils/formatters';
import styles from './CapitalGainsCards.module.css';

function GainsTable({ stcg, ltcg, isAfterCard = false }) {
  const netSTCG = stcg.profits - stcg.losses;
  const netLTCG = ltcg.profits - ltcg.losses;

  return (
    <table className={styles.gainsTable}>
      <thead>
        <tr>
          <th></th>
          <th>Short-term</th>
          <th>Long-term</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Profits</td>
          <td>{formatCurrency(stcg.profits)}</td>
          <td>{formatCurrency(ltcg.profits)}</td>
        </tr>
        <tr>
          <td>Losses</td>
          <td>{formatCurrency(-stcg.losses)}</td>
          <td>{formatCurrency(-ltcg.losses)}</td>
        </tr>
        <tr className={styles.netRow}>
          <td>Net Capital Gains</td>
          <td>{formatCurrency(netSTCG)}</td>
          <td>{formatCurrency(netLTCG)}</td>
        </tr>
      </tbody>
    </table>
  );
}

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={`${styles.skeletonTitle} skeleton`}></div>
      <div className={`${styles.skeletonLine} ${styles.skeletonLineFull} skeleton`}></div>
      <div className={`${styles.skeletonLine} ${styles.skeletonLineFull} skeleton`}></div>
      <div className={`${styles.skeletonLine} ${styles.skeletonLineFull} skeleton`}></div>
      <div className={`${styles.skeletonLine} ${styles.skeletonLineMed} skeleton`}></div>
      <div className={`${styles.skeletonLine} ${styles.skeletonLineShort} skeleton`}></div>
    </div>
  );
}

export default function CapitalGainsCards() {
  const {
    capitalGains,
    afterHarvestingGains,
    preHarvestingRealised,
    postHarvestingRealised,
    savings,
    showSavings,
    loading,
  } = useHarvesting();

  if (loading || !capitalGains) {
    return (
      <div className={styles.cardsContainer}>
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  const base = capitalGains.capitalGains;

  return (
    <div className={styles.cardsContainer} id="capital-gains-cards">
      {/* Pre Harvesting Card */}
      <div className={styles.preCard} id="pre-harvesting-card">
        <h2 className={styles.cardTitle}>Pre Harvesting</h2>
        <GainsTable stcg={base.stcg} ltcg={base.ltcg} />
        <div className={styles.realisedSection}>
          <span className={styles.realisedLabel}>Realised Capital Gains:</span>
          <span className={styles.realisedValue}>
            <div className={styles.valueWithTooltip}>
              {formatAbbreviated(preHarvestingRealised)}
              <div className={styles.valueTooltip}>{formatCurrency(preHarvestingRealised)}</div>
            </div>
          </span>
        </div>
      </div>

      {/* After Harvesting Card */}
      <div className={styles.afterCard} id="after-harvesting-card">
        <h2 className={styles.cardTitle}>After Harvesting</h2>
        {afterHarvestingGains && (
          <>
            <GainsTable
              stcg={afterHarvestingGains.stcg}
              ltcg={afterHarvestingGains.ltcg}
              isAfterCard={true}
            />
            <div className={styles.effectiveSection}>
              <span className={styles.effectiveLabel}>Effective Capital Gains:</span>
              <span className={styles.effectiveValue}>
                <div className={styles.valueWithTooltip}>
                  {formatAbbreviated(postHarvestingRealised)}
                  <div className={styles.valueTooltip}>{formatCurrency(postHarvestingRealised)}</div>
                </div>
              </span>
            </div>
            <div className={`${styles.savingsLine} ${showSavings ? styles.savingsVisible : styles.savingsHidden}`}>
              <span>🎉</span>
              <span>Your taxable capital gains are reduced by: <strong className={styles.savingsAmount}>
                <div className={styles.valueWithTooltip}>
                  {formatAbbreviated(preHarvestingRealised - postHarvestingRealised)}
                  <div className={styles.valueTooltip}>{formatCurrency(preHarvestingRealised - postHarvestingRealised)}</div>
                </div>
              </strong></span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
