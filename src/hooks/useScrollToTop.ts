import { useEffect } from "react";

interface UseScrollToTopOptions {
  /**
   * Whether to use smooth scrolling behavior
   * @default true
   */
  smooth?: boolean;
  /**
   * Whether to scroll to top automatically
   * @default true
   */
  auto?: boolean;
  /**
   * Delay before scrolling (in milliseconds)
   * @default 0
   */
  delay?: number;
  /**
   * Dependencies to trigger scroll to top
   * @default []
   */
  dependencies?: unknown[];
}

export const useScrollToTop = (options: UseScrollToTopOptions = {}) => {
  const { smooth = true, auto = true, delay = 0, dependencies = [] } = options;

  const scrollToTop = () => {
    const scrollOptions: ScrollToOptions = {
      top: 0,
      left: 0,
      behavior: smooth ? "smooth" : "auto",
    };

    if (delay > 0) {
      setTimeout(() => {
        window.scrollTo(scrollOptions);
      }, delay);
    } else {
      window.scrollTo(scrollOptions);
    }
  };

  useEffect(() => {
    if (auto) {
      scrollToTop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, ...dependencies]);

  return { scrollToTop };
};

export default useScrollToTop;
