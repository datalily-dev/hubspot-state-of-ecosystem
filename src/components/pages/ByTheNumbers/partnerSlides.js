import carouselData from '../../../data/static-pages/partner-carousel.json';
import aircallSlide from '../../../assets/by-the-numbers/aircall-slide.webp';
import apitudeSlide from '../../../assets/by-the-numbers/apitude-slide.webp';
import engagingSlide from '../../../assets/by-the-numbers/engaging-slide.webp';
import growsSlide from '../../../assets/by-the-numbers/grows-slide.webp';
import guepardSlide from '../../../assets/by-the-numbers/guepard-slide.webp';
import hububbleSlide from '../../../assets/by-the-numbers/hububble-slide.webp';
import siloySlide from '../../../assets/by-the-numbers/siloy-slide.webp';
import smartbugSlide from '../../../assets/by-the-numbers/smartbug-slide.webp';
import zoomSlide from '../../../assets/by-the-numbers/zoom-slide.webp';

/** WebP assets keyed by slide id — names live in partner-carousel.json. */
const SLIDE_SRC_BY_ID = {
  aircall: aircallSlide,
  apitude: apitudeSlide,
  smartbug: smartbugSlide,
  siloy: siloySlide,
  hububble: hububbleSlide,
  zoom: zoomSlide,
  guepard: guepardSlide,
  engaging: engagingSlide,
  grows: growsSlide,
};

/**
 * Partner carousel slides exported from Figma *-desktop frames (2346:5691…5755).
 * Visual layer is a 210×232 WebP; caption copy is rendered in HTML (2329:5676–5677).
 */
export const PARTNER_SLIDES = carouselData.slides
  .map(({ id, name }) => {
    const src = SLIDE_SRC_BY_ID[id];
    return src ? { id, name, src } : null;
  })
  .filter(Boolean);
