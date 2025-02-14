import React, { useState, useEffect, useRef } from "react";

const Navbar: React.FC = () => {
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

  return (
    <nav
      className={`sticky top-0 left-0 w-full bg-blue-600 text-white p-4 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      Sticky Navbar in Middle Div
    </nav>
  );
};

const TestingPage: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <div className="bg-red-300 w-[20%] h-screen flex-shrink-0">
        <p>Sidebar left content...</p>
      </div>

      {/* Middle Scrollable Content */}
      <div
        id="scrollable-content"
        className="relative h-screen overflow-auto w-[60%] border-2 border-red-600 bg-blue-300"
      >
        <Navbar />
        <div className="p-8 pt-16 space-y-6">
          {/* Extra padding to prevent content from being hidden under the navbar */}
          {[...Array(50)].map((_, i) => (
            <p key={i} className="text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
              sodales.
            </p>
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="bg-red-300 w-[20%] h-screen flex-shrink-0">
        <p>Sidebar right content...</p>
      </div>
    </div>
  );
};

export default TestingPage;
