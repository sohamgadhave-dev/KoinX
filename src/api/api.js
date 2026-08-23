import { holdingsData, capitalGainsData } from './mockData';

/**
 * Simulates fetching holdings data from an API
 * @returns {Promise} Resolves with holdings array after delay
 */
export const fetchHoldings = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(holdingsData);
    }, 800);
  });
};

/**
 * Simulates fetching capital gains data from an API
 * @returns {Promise} Resolves with capital gains object after delay
 */
export const fetchCapitalGains = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(capitalGainsData);
    }, 500);
  });
};
