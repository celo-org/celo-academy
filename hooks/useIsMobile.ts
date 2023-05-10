import { useEffect, useState } from "react";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      // Set the breakpoint value for mobile devices
      const mobileBreakpoint = 768;

      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= mobileBreakpoint);
      }
    };

    // Initialize the isMobile value on the first render
    checkIsMobile();

    // Update the isMobile value whenever the window is resized
    window.addEventListener("resize", checkIsMobile);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
