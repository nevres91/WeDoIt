import { useState, useEffect, useRef } from "react";

export const useHideOnScroll = () => {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const scrollableDiv = document.getElementById("scrollable-content");

    const handleScroll = () => {
      if (!scrollableDiv) return;
      const currentScrollY = scrollableDiv.scrollTop;

      if (currentScrollY > lastScrollY.current) {
        setVisible(false); // Hide navbar when scrolling down
      } else {
        setVisible(true); // Show navbar when scrolling up
      }

      lastScrollY.current = currentScrollY;
    };

    scrollableDiv?.addEventListener("scroll", handleScroll);
    return () => scrollableDiv?.removeEventListener("scroll", handleScroll);
  }, []);

  return { visible };
};
