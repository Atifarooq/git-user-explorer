import React, { FC, useEffect, useRef, useState } from "react";

interface UseInViewOptions extends IntersectionObserverInit {}

export interface UseInViewResult {
  bottomInView: boolean;
  lastElementRef: React.MutableRefObject<null>;
}

const useInView = (options?: UseInViewOptions): UseInViewResult => {
  const lastElementRef = useRef(null);
  const [bottomInView, setBottomInView] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      setBottomInView(entries[0].isIntersecting);
    }, options);

    if (lastElementRef.current) observer.observe(lastElementRef.current);

    return () => observer.disconnect();
  }, [lastElementRef, options]);

  return { bottomInView, lastElementRef };
};

export default useInView;
