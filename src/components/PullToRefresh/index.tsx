import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Subscription, fromEvent } from "rxjs";
import "./PullToRefresh.css";

const PullToRefresh = ({ children, loading, onRefresh }: any) => {
  const [touchstartY, setTouchstartY] = useState(0);
  const [spinnerVisible, setSpinnerVisible] = useState(false);

  useEffect(() => {
    const handleTouchStart = (e: any) => {
      setTouchstartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: any) => {
      const touchY = e.touches[0].clientY;
      const touchDiff = touchY - touchstartY;

      // Check if the page is at the top and the user is pulling down
      if (touchDiff > 0 && window.scrollY === 0) {
        e.preventDefault(); // Prevent the default pull-to-refresh action
        setSpinnerVisible(true);
      }
    };

    const handleTouchStop = () => {
      if (spinnerVisible) {
        setSpinnerVisible(false);
        onRefresh();
      }
    };

    const touchStartSubscription: Subscription = fromEvent(
      document,
      "touchstart"
    ).subscribe(handleTouchStart);
    const touchMoveSubscription: Subscription = fromEvent(
      document,
      "touchmove",
      {
        passive: false,
      }
    ).subscribe(handleTouchMove);
    const touchEndSubscription: Subscription = fromEvent(
      document,
      "touchend"
    ).subscribe(handleTouchStop);

    return () => {
      touchStartSubscription.unsubscribe();
      touchMoveSubscription.unsubscribe();
      touchEndSubscription.unsubscribe();
    };
  }, [onRefresh, spinnerVisible, touchstartY]);

  return (
    <Box>
      <Box className={`spinner ${spinnerVisible || loading ? "visible" : ""}`}>
        <CircularProgress />
      </Box>
      <Box className={`${spinnerVisible || loading ? "blur" : ""}`}>
        {children}
      </Box>
    </Box>
  );
};

export default PullToRefresh;
