/**
 * Inisialisasi reader chapter: scroll progress, nav zone, keyboard, fullscreen.
 * Panggil setelah DOM siap (e.g. dari Astro script).
 */
export function initChapterReader(): void {
    const mainContainer = document.getElementById("manga-reader-container");
    const progressBar = document.getElementById("reader-progress-bar");
    const currentPageDisplay = document.getElementById("current-page");
    const navTop = document.getElementById("nav-scroll-top");
    const navBottom = document.getElementById("nav-scroll-bottom");
    const nextPreview = document.getElementById("next-chapter-preview");
    const sidebar = document.getElementById("reader-sidebar");
    const keyboardHints = document.getElementById("keyboard-hints");

    if (navTop && mainContainer) {
        navTop.addEventListener("click", () => {
            mainContainer.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    if (navBottom && nextPreview) {
        navBottom.addEventListener("click", () => {
            nextPreview.scrollIntoView({ behavior: "smooth" });
        });
    }

    if (mainContainer && progressBar && currentPageDisplay) {
        const container = mainContainer;
        const bar = progressBar;
        const display = currentPageDisplay;
        const pageWrappers = container.querySelectorAll(".manga-page-wrapper");
        const total = Math.max(1, pageWrappers.length);

        function updateProgress(): void {
            const scrollTop = container.scrollTop;
            const viewportCenter = scrollTop + container.clientHeight / 2;
            let currentPage = 1;
            for (let i = 0; i < pageWrappers.length; i++) {
                const el = pageWrappers[i] as HTMLElement;
                const top = el.offsetTop;
                const bottom = top + el.offsetHeight;
                if (viewportCenter >= top && viewportCenter <= bottom) {
                    currentPage = i + 1;
                    break;
                }
                if (viewportCenter >= top) currentPage = i + 1;
            }
            currentPage = Math.min(Math.max(currentPage, 1), total);
            const scrollHeight = container.scrollHeight - container.clientHeight;
            const scrollPercent =
                scrollHeight > 0 ? (container.scrollTop / scrollHeight) * 100 : 0;
            bar.style.width = `${scrollPercent}%`;
            display.textContent = String(currentPage);

            if (scrollTop > 100 && keyboardHints) {
                keyboardHints.classList.remove("opacity-0", "translate-y-4");
                setTimeout(() => {
                    keyboardHints.classList.add("opacity-0", "translate-y-4");
                }, 5000);
            }
        }

        mainContainer.addEventListener("scroll", updateProgress, { passive: true });
        updateProgress();
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === " " && document.getElementById("manga-reader-container")) {
            const el = document.getElementById("manga-reader-container");
            if (
                el &&
                document.activeElement?.tagName !== "INPUT" &&
                document.activeElement?.tagName !== "TEXTAREA"
            ) {
                e.preventDefault();
                el.scrollBy({
                    top: window.innerHeight * 0.8,
                    behavior: "smooth",
                });
            }
        } else if ((e.ctrlKey || e.metaKey) && e.key === "m") {
            e.preventDefault();
            sidebar?.classList.toggle("hidden");
        }
    });

    const btnFullscreen = document.getElementById("btn-fullscreen");
    if (btnFullscreen) {
        btnFullscreen.addEventListener("click", () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen?.();
            } else {
                document.exitFullscreen?.();
            }
        });
    }
}
