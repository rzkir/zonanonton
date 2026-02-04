import * as React from "react";

import { motion } from "framer-motion";

export interface HeroData {
  title: string;
  description: string;
  image: string;
  type: "anime";
  year: string;
  rating: string;
  animeId: string;
}

const AUTOPLAY_INTERVAL = 5000;
const FADE_DURATION_MS = 800;

const fadeTransition = {
  duration: 0.8,
  ease: [0.33, 0, 0.2, 1] as const, // smooth ease-in-out
};

const contentEase = [0.33, 0, 0.2, 1] as const;

const contentVariants = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.5, ease: contentEase },
  },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: 0.2 + i * 0.06,
      duration: 0.6,
      ease: contentEase,
    },
  }),
  /** Saat reset dari clone ke slide asli, konten langsung tampil tanpa animasi (hindari double) */
  visibleInstant: {
    opacity: 1,
    transition: { duration: 0 },
  },
};

interface HeroCarouselClientProps {
  heroesList: HeroData[];
}

export default function HeroCarouselClient({ heroesList }: HeroCarouselClientProps) {
  const total = heroesList.length;
  // Extended: [clone last, ...original, clone first] → index 0 = clone last, 1..total = real, total+1 = clone first
  const extendedSlides = React.useMemo(() => {
    if (total <= 1) return heroesList;
    return [
      heroesList[total - 1],
      ...heroesList,
      heroesList[0],
    ];
  }, [heroesList, total]);

  const slideCount = extendedSlides.length;
  const [index, setIndex] = React.useState(total <= 1 ? 0 : 1); // start at first real slide
  const [isPaused, setIsPaused] = React.useState(false);
  const skipTransitionRef = React.useRef(false);

  const next = React.useCallback(() => {
    if (total <= 1) return;
    skipTransitionRef.current = false;
    setIndex((i) => (i < slideCount - 1 ? i + 1 : i));
  }, [total, slideCount]);

  const prev = React.useCallback(() => {
    if (total <= 1) return;
    skipTransitionRef.current = false;
    setIndex((i) => (i > 0 ? i - 1 : i));
  }, [total]);

  // Reset from clone position to real position (no visible jump)
  React.useEffect(() => {
    if (total <= 1) return;
    if (index === slideCount - 1) {
      const t = setTimeout(() => {
        skipTransitionRef.current = true;
        setIndex(1);
      }, FADE_DURATION_MS);
      return () => clearTimeout(t);
    }
    if (index === 0) {
      const t = setTimeout(() => {
        skipTransitionRef.current = true;
        setIndex(total);
      }, FADE_DURATION_MS);
      return () => clearTimeout(t);
    }
  }, [index, total, slideCount]);

  React.useEffect(() => {
    if (skipTransitionRef.current) {
      const t = setTimeout(() => { skipTransitionRef.current = false; }, 50);
      return () => clearTimeout(t);
    }
  }, [index]);

  React.useEffect(() => {
    if (total <= 1 || isPaused) return;
    const id = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [total, isPaused, next]);

  if (!heroesList.length) return null;

  const displayList = total > 1 ? extendedSlides : heroesList;
  const transition =
    total > 1 && skipTransitionRef.current ? { duration: 0 } : fadeTransition;
  const contentAnimate =
    total > 1 && skipTransitionRef.current ? "visibleInstant" : "visible";

  /** Index slide asli (0..total-1) untuk dots; extended index 1..total = slide asli */
  const realIndex = total <= 1 ? 0 : index === 0 ? total - 1 : index === slideCount - 1 ? 0 : index - 1;

  const goToSlide = React.useCallback((realI: number) => {
    if (total <= 1) return;
    skipTransitionRef.current = false;
    setIndex(realI + 1); // extended: slide asli ke-0 = index 1
  }, [total]);

  return (
    <section
      className="hero-carousel relative h-[85vh] w-full overflow-hidden"
      aria-label="Hero carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="hero-carousel__track relative h-full w-full" data-carousel-track>
        {displayList.map((h, i) => {
          const trendNum = total <= 1 ? i + 1 : i === 0 ? total : i === slideCount - 1 ? 1 : i;
          return (
            <motion.div
              key={`${h.animeId || h.title}-${i}`}
              className="hero-carousel__slide absolute inset-0 w-full h-full"
              initial={false}
              animate={{ opacity: i === index ? 1 : 0 }}
              transition={transition}
              style={{
                pointerEvents: i === index ? "auto" : "none",
                zIndex: i === index ? 1 : 0,
              }}
            >
              <div className="absolute inset-0">
                <motion.img
                  src={h.image}
                  alt={h.title}
                  className="w-full h-full object-cover"
                  initial={false}
                  layout
                />
                <div className="absolute inset-0 bg-linear-to-r from-[#0a0b14] via-[#0a0b14]/60 to-transparent" />
                <div className="absolute inset-0 hero-gradient" />
              </div>
              <div className="relative h-full max-w-[1440px] mx-auto px-6 flex flex-col justify-center pt-20">
                <div className="max-w-2xl space-y-6">
                  <motion.div
                    className="flex items-center gap-3"
                    variants={contentVariants}
                    initial="hidden"
                    animate={i === index ? contentAnimate : "hidden"}
                    custom={0}
                  >
                    <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold tracking-widest uppercase">
                      Trending #{trendNum}
                    </span>
                    {h.rating && (
                      <span className="text-cyan-400 text-sm font-bold flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        {h.rating}
                      </span>
                    )}
                  </motion.div>
                  <motion.h1
                    className="text-5xl font-extrabold leading-tight tracking-tighter text-white"
                    variants={contentVariants}
                    initial="hidden"
                    animate={i === index ? contentAnimate : "hidden"}
                    custom={1}
                  >
                    {h.title.split(" ")[0]}
                    {h.title.split(" ").length > 1 && (
                      <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-500">
                        {" " + h.title.split(" ").slice(1).join(" ")}
                      </span>
                    )}
                  </motion.h1>
                  {h.description && (
                    <motion.p
                      className="text-lg text-gray-300 leading-relaxed max-w-lg line-clamp-2"
                      variants={contentVariants}
                      initial="hidden"
                      animate={i === index ? "visible" : "hidden"}
                      custom={2}
                    >
                      {h.description}
                    </motion.p>
                  )}

                  <motion.div
                    className="flex items-center gap-4 pt-4"
                    variants={contentVariants}
                    initial="hidden"
                    animate={i === index ? contentAnimate : "hidden"}
                    custom={3}
                  >
                    <a
                      href={`/anime/${h.animeId ?? ""}`}
                      className="px-8 py-4 bg-white text-black font-bold rounded-full flex items-center gap-3 hover:bg-cyan-400 hover:text-white transition-all duration-300 group shadow-xl shadow-white/5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="ml-0.5"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      Watch Now
                    </a>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {total > 1 && (
        <div
          className="absolute bottom-40 right-8 z-20 flex items-center gap-2"
          role="tablist"
          aria-label="Pagination slide"
        >
          {heroesList.map((_, i) => (
            <motion.button
              key={i}
              type="button"
              role="tab"
              aria-label={`Slide ${i + 1}`}
              aria-selected={realIndex === i}
              className="rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              onClick={() => goToSlide(i)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${realIndex === i
                  ? "w-8 h-2.5 bg-white"
                  : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
                  }`}
              />
            </motion.button>
          ))}
        </div>
      )}
    </section>
  );
}
