import { createContext, useContext, useReducer, useMemo, useCallback } from 'react';

const HarvestingContext = createContext();

// ---- Reducer ----
const initialState = {
  holdings: [],
  capitalGains: null,
  selectedIds: new Set(),
  loading: true,
  error: null,
};

function harvestingReducer(state, action) {
  switch (action.type) {
    case 'SET_HOLDINGS':
      return { ...state, holdings: action.payload, loading: false };
    case 'SET_CAPITAL_GAINS':
      return { ...state, capitalGains: action.payload };
    case 'TOGGLE_SELECTION': {
      const newSelected = new Set(state.selectedIds);
      const id = action.payload;
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return { ...state, selectedIds: newSelected };
    }
    case 'SELECT_ALL': {
      const allIds = new Set(state.holdings.map((_, i) => i));
      return { ...state, selectedIds: allIds };
    }
    case 'DESELECT_ALL':
      return { ...state, selectedIds: new Set() };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

// ---- Provider ----
export function HarvestingProvider({ children }) {
  const [state, dispatch] = useReducer(harvestingReducer, initialState);

  const toggleSelection = useCallback((id) => {
    dispatch({ type: 'TOGGLE_SELECTION', payload: id });
  }, []);

  const selectAll = useCallback(() => {
    dispatch({ type: 'SELECT_ALL' });
  }, []);

  const deselectAll = useCallback(() => {
    dispatch({ type: 'DESELECT_ALL' });
  }, []);

  const setHoldings = useCallback((data) => {
    dispatch({ type: 'SET_HOLDINGS', payload: data });
  }, []);

  const setCapitalGains = useCallback((data) => {
    dispatch({ type: 'SET_CAPITAL_GAINS', payload: data });
  }, []);

  const setLoading = useCallback((val) => {
    dispatch({ type: 'SET_LOADING', payload: val });
  }, []);

  const setError = useCallback((err) => {
    dispatch({ type: 'SET_ERROR', payload: err });
  }, []);

  // Compute after-harvesting gains
  const afterHarvestingGains = useMemo(() => {
    if (!state.capitalGains) return null;

    const base = state.capitalGains.capitalGains;
    let stcgProfits = base.stcg.profits;
    let stcgLosses = base.stcg.losses;
    let ltcgProfits = base.ltcg.profits;
    let ltcgLosses = base.ltcg.losses;

    state.selectedIds.forEach((id) => {
      const holding = state.holdings[id];
      if (!holding) return;

      // Short-term gain
      if (holding.stcg.gain >= 0) {
        stcgProfits += holding.stcg.gain;
      } else {
        stcgLosses += Math.abs(holding.stcg.gain);
      }

      // Long-term gain
      if (holding.ltcg.gain >= 0) {
        ltcgProfits += holding.ltcg.gain;
      } else {
        ltcgLosses += Math.abs(holding.ltcg.gain);
      }
    });

    return {
      stcg: { profits: stcgProfits, losses: stcgLosses },
      ltcg: { profits: ltcgProfits, losses: ltcgLosses },
    };
  }, [state.capitalGains, state.selectedIds, state.holdings]);

  // Pre-harvesting realised capital gains
  const preHarvestingRealised = useMemo(() => {
    if (!state.capitalGains) return 0;
    const base = state.capitalGains.capitalGains;
    const netSTCG = base.stcg.profits - base.stcg.losses;
    const netLTCG = base.ltcg.profits - base.ltcg.losses;
    return netSTCG + netLTCG;
  }, [state.capitalGains]);

  // Post-harvesting effective capital gains
  const postHarvestingRealised = useMemo(() => {
    if (!afterHarvestingGains) return 0;
    const netSTCG = afterHarvestingGains.stcg.profits - afterHarvestingGains.stcg.losses;
    const netLTCG = afterHarvestingGains.ltcg.profits - afterHarvestingGains.ltcg.losses;
    return netSTCG + netLTCG;
  }, [afterHarvestingGains]);

  // Savings
  const savings = useMemo(() => {
    return preHarvestingRealised - postHarvestingRealised;
  }, [preHarvestingRealised, postHarvestingRealised]);

  const showSavings = useMemo(() => {
    return savings > 0 && state.selectedIds.size > 0;
  }, [savings, state.selectedIds]);

  const value = useMemo(() => ({
    ...state,
    toggleSelection,
    selectAll,
    deselectAll,
    setHoldings,
    setCapitalGains,
    setLoading,
    setError,
    afterHarvestingGains,
    preHarvestingRealised,
    postHarvestingRealised,
    savings,
    showSavings,
  }), [state, toggleSelection, selectAll, deselectAll, setHoldings, setCapitalGains,
       setLoading, setError, afterHarvestingGains, preHarvestingRealised,
       postHarvestingRealised, savings, showSavings]);

  return (
    <HarvestingContext.Provider value={value}>
      {children}
    </HarvestingContext.Provider>
  );
}

export function useHarvesting() {
  const context = useContext(HarvestingContext);
  if (!context) {
    throw new Error('useHarvesting must be used within a HarvestingProvider');
  }
  return context;
}
