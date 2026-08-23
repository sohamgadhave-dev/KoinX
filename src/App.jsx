import { ThemeProvider } from './context/ThemeContext';
import { HarvestingProvider } from './context/HarvestingContext';
import Header from './components/Header/Header';
import TaxHarvestingPage from './components/TaxHarvestingPage/TaxHarvestingPage';

export default function App() {
  return (
    <ThemeProvider>
      <HarvestingProvider>
        <Header />
        <TaxHarvestingPage />
      </HarvestingProvider>
    </ThemeProvider>
  );
}
