import { lazy, Suspense } from 'react';
import { FilterProvider } from './context/FilterContext';
import SlideDeck from './components/common/SlideDeck/SlideDeck';
import CoverPage from './components/pages/CoverPage/CoverPage';
import styles from './App.module.css';

// Code-split below-the-fold pages; one Suspense boundary per page so a slow
// chunk doesn't gate the others.
const NavigationPage = lazy(() => import('./components/pages/NavigationPage/NavigationPage'));
const ForewordPage = lazy(() => import('./components/pages/ForewordPage/ForewordPage'));
const ByTheNumbers = lazy(() => import('./components/pages/ByTheNumbers/ByTheNumbers'));
const ShortTakes = lazy(() => import('./components/pages/ShortTakes/ShortTakes'));
const VisionPage = lazy(() => import('./components/pages/VisionPage/VisionPage'));
const GrowthPage = lazy(() => import('./components/pages/GrowthPage/GrowthPage'));
const InsiderInsights = lazy(() => import('./components/pages/InsiderInsights/InsiderInsights'));

const lazySlide = (Component) => (
  <Suspense fallback={null}>
    <Component />
  </Suspense>
);

export default function App() {
  return (
    <FilterProvider>
      <a href="#cover" className="skip-link">
        Skip to content
      </a>
      <main className={styles.main}>
        <SlideDeck>
          <CoverPage />
          {lazySlide(NavigationPage)}
          {lazySlide(ForewordPage)}
          {lazySlide(ByTheNumbers)}
          {lazySlide(ShortTakes)}
          {lazySlide(VisionPage)}
          {lazySlide(GrowthPage)}
          {lazySlide(InsiderInsights)}
        </SlideDeck>
      </main>
    </FilterProvider>
  );
}
