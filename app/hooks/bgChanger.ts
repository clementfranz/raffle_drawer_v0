import { useEffect } from "react";
import { useLocation } from "react-router";

export function useRouteSpecificBodyClass(
  targetPath: string,
  classes: string[]
) {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === targetPath) {
      // Apply classes
      classes.forEach((cls) => document.body.classList.add(cls));

      return () => {
        // Clean up when navigating away
        classes.forEach((cls) => document.body.classList.remove(cls));
      };
    }
  }, [location.pathname, targetPath, classes]);
}
