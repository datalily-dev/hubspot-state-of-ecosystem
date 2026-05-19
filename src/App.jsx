import { FilterProvider } from './context/FilterContext';
import SlideDeck from './components/common/SlideDeck/SlideDeck';
import CoverPage from './components/pages/CoverPage/CoverPage';
import NavigationPage from './components/pages/NavigationPage/NavigationPage';
import ForewordPage from './components/pages/ForewordPage/ForewordPage';
import ByTheNumbers from './components/pages/ByTheNumbers/ByTheNumbers';
import ShortTakes from './components/pages/ShortTakes/ShortTakes';
import VisionPage from './components/pages/VisionPage/VisionPage';
import GrowthPage from './components/pages/GrowthPage/GrowthPage';
import InsiderInsights from './components/pages/InsiderInsights/InsiderInsights';
import styles from './App.module.css';

export default function App() {
  return (
    <FilterProvider>
      <a href="#cover" className="skip-link">
        Skip to content
      </a>
      <main className={styles.main}>
        <SlideDeck>
          <CoverPage />
          <NavigationPage />
          <ForewordPage />
          <ByTheNumbers />
          <ShortTakes />
          <VisionPage />
          <GrowthPage />
          <InsiderInsights />
        </SlideDeck>
      </main>
    </FilterProvider>
  );
}
