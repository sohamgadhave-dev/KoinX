import { useState, useCallback, useMemo } from 'react';
import { useHarvesting } from '../../context/HarvestingContext';
import { formatCurrency, formatHolding, formatPrice, formatAbbreviated } from '../../utils/formatters';
import styles from './HoldingsTable.module.css';

const INITIAL_VISIBLE = 6;

function GainDisplay({ gain, balance, coin }) {
  const isPositive = gain > 0;
  const isNegative = gain < 0;
  const isZero = gain === 0 || Math.abs(gain) < 0.000001;

  let className = styles.gainNeutral;
  if (isPositive) className = styles.gainPositive;
  if (isNegative) className = styles.gainNegative;

  const formattedAbbr = formatAbbreviated(gain);
  const displayValue = isZero ? '$ 0.00' : (isPositive ? `+${formattedAbbr}` : formattedAbbr);
  
  const exactValue = isZero ? '$ 0.00' : formatCurrency(gain, true);

  return (
    <div className={styles.gainCell}>
      <div className={`${styles.gainValue} ${className}`}>
        <div className={styles.valueWithTooltip}>
          {displayValue}
          <div className={styles.valueTooltip}>{exactValue}</div>
        </div>
      </div>
      <div className={styles.gainBalance}>
        {formatHolding(balance, coin)}
      </div>
    </div>
  );
}

function SkeletonRows({ count = 5 }) {
  return Array.from({ length: count }).map((_, i) => (
    <tr key={`skeleton-${i}`} className={styles.skeletonRow}>
      <td>
        <div className={`${styles.skeletonCell} skeleton`} style={{ width: 18, height: 18 }}></div>
      </td>
      <td>
        <div className={styles.skeletonAsset}>
          <div className={`${styles.skeletonAvatar} skeleton`}></div>
          <div>
            <div className={`${styles.skeletonText} skeleton`}></div>
            <div className={`${styles.skeletonTextSm} skeleton`}></div>
          </div>
        </div>
      </td>
      <td><div className={`${styles.skeletonValue} skeleton`}></div></td>
      <td className={styles.hideOnMobile}><div className={`${styles.skeletonValue} skeleton`}></div></td>
      <td className={styles.hideOnMobile}><div className={`${styles.skeletonValue} skeleton`}></div></td>
      <td className={styles.hideOnMobile}><div className={`${styles.skeletonValue} skeleton`}></div></td>
      <td className={styles.hideOnMobile}><div className={`${styles.skeletonValue} skeleton`}></div></td>
    </tr>
  ));
}

export default function HoldingsTable() {
  const {
    holdings,
    selectedIds,
    toggleSelection,
    selectAll,
    deselectAll,
    loading,
  } = useHarvesting();

  const [showAll, setShowAll] = useState(false);
  const [sortConfig, setSortConfig] = useState(null);

  const holdingsWithIndex = useMemo(() => {
    return holdings.map((h, i) => ({ ...h, originalIndex: i }));
  }, [holdings]);

  const sortedHoldings = useMemo(() => {
    if (!sortConfig) return holdingsWithIndex;
    
    return [...holdingsWithIndex].sort((a, b) => {
      const aValue = sortConfig.key === 'stcg' ? a.stcg.gain : a.ltcg.gain;
      const bValue = sortConfig.key === 'stcg' ? b.stcg.gain : b.ltcg.gain;
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [holdingsWithIndex, sortConfig]);

  const isAllSelected = holdings.length > 0 && selectedIds.size === holdings.length;
  const isSomeSelected = selectedIds.size > 0 && !isAllSelected;

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      deselectAll();
    } else {
      selectAll();
    }
  }, [isAllSelected, deselectAll, selectAll]);

  const handleRowClick = useCallback((index) => {
    toggleSelection(index);
  }, [toggleSelection]);

  const visibleHoldings = showAll ? sortedHoldings : sortedHoldings.slice(0, INITIAL_VISIBLE);

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    } else if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      setSortConfig(null);
      return;
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return (
      <span className={styles.sortIcon}>
        {sortConfig.direction === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  return (
    <section className={styles.section} id="holdings-section">
      <h2 className={styles.sectionTitle}>Holdings</h2>

      <div className={styles.tableWrapper}>
        <table className={styles.table} id="holdings-table">
          <thead>
            <tr>
              <th>
                <div className={styles.checkbox}>
                  <input
                    type="checkbox"
                    className={styles.checkboxInput}
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected;
                    }}
                    onChange={handleSelectAll}
                    aria-label="Select all holdings"
                    id="select-all-checkbox"
                  />
                </div>
              </th>
              <th>Asset</th>
              <th className={styles.thRight}>
                Holdings
                <span className={styles.thHoldingsSub}>Current Market Rate</span>
              </th>
              <th className={`${styles.thRight} ${styles.hideOnMobile}`}>Total Current Value</th>
              <th 
                className={`${styles.thRight} ${styles.hideOnMobile} ${styles.sortableHeader}`}
                onClick={() => handleSort('stcg')}
                title="Sort by Short-term Gain"
              >
                <div className={styles.headerContent}>
                  {getSortIndicator('stcg')}
                  Short-term
                </div>
              </th>
              <th 
                className={`${styles.thRight} ${styles.hideOnMobile} ${styles.sortableHeader}`}
                onClick={() => handleSort('ltcg')}
                title="Sort by Long-term Gain"
              >
                <div className={styles.headerContent}>
                  {getSortIndicator('ltcg')}
                  Long-term
                </div>
              </th>
              <th className={`${styles.thRight} ${styles.hideOnMobile}`}>Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows />
            ) : (
              visibleHoldings.map((holding, displayIndex) => {
                // Use the actual index in the full holdings array for selection tracking
                const actualIndex = holding.originalIndex;
                const isSelected = selectedIds.has(actualIndex);
                const totalValue = holding.currentPrice * holding.totalHolding;

                return (
                  <tr
                    key={`${holding.coin}-${holding.coinName}-${actualIndex}`}
                    className={isSelected ? styles.selectedRow : ''}
                    onClick={() => handleRowClick(actualIndex)}
                    id={`holding-row-${actualIndex}`}
                  >
                    <td>
                      <div className={styles.checkbox}>
                        <input
                          type="checkbox"
                          className={styles.checkboxInput}
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleRowClick(actualIndex);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Select ${holding.coinName}`}
                        />
                      </div>
                    </td>
                    <td>
                      <div className={styles.assetCell}>
                        <img
                          src={holding.logo}
                          alt={holding.coin}
                          className={styles.coinLogo}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg';
                          }}
                        />
                        <div className={styles.coinInfo}>
                          <span className={styles.coinName} title={holding.coinName}>{holding.coinName}</span>
                          <span className={styles.coinSymbol}>{holding.coin}</span>
                        </div>
                      </div>
                    </td>
                    <td className={styles.holdingsCell}>
                      <div className={styles.holdingsAmount}>
                        {formatHolding(holding.totalHolding, holding.coin)}
                      </div>
                      <div className={styles.holdingsPrice}>
                        {formatPrice(holding.averageBuyPrice)}/{holding.coin}
                      </div>
                    </td>
                    <td className={`${styles.priceCell} ${styles.hideOnMobile}`}>
                      <div className={styles.valueWithTooltip}>
                        {formatAbbreviated(totalValue)}
                        <div className={styles.valueTooltip}>{formatCurrency(totalValue)}</div>
                      </div>
                    </td>
                    <td className={styles.hideOnMobile}>
                      <GainDisplay
                        gain={holding.stcg.gain}
                        balance={holding.stcg.balance}
                        coin={holding.coin}
                      />
                    </td>
                    <td className={styles.hideOnMobile}>
                      <GainDisplay
                        gain={holding.ltcg.gain}
                        balance={holding.ltcg.balance}
                        coin={holding.coin}
                      />
                    </td>
                    <td className={`${styles.hideOnMobile} ${isSelected ? styles.amountToSell : styles.amountDash}`}>
                      {isSelected ? formatHolding(holding.totalHolding, holding.coin) : '-'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {!loading && holdings.length > INITIAL_VISIBLE && (
          <div className={styles.viewAll}>
            <button
              className={styles.viewAllButton}
              onClick={() => setShowAll(!showAll)}
              id="view-all-button"
            >
              {showAll ? 'Show less' : 'View all'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
