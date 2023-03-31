import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";

interface AnalyticsData {
  path: string;
  timeSpent: number;
  asPath: string;
}

const useTimeSpent = () => {
  const router = useRouter();
  const startTimeRef = useRef(new Date().getTime());
  const { address } = useAccount();

  const handleRouteChangeStart = () => {
    const currentTime = new Date().getTime();
    const timeSpent = currentTime - startTimeRef.current;
    const currentUrl = `${window.location}`;

    storeData({
      path: router.pathname,
      timeSpent,
      asPath: currentUrl,
    });
    startTimeRef.current = currentTime;
  };

  const storeData = (data: AnalyticsData) => {
    if (data.asPath.includes("/pathway/")) {
      const pathway = data.asPath.split("/")[4];
      const lesson = data.asPath.split("/")[5];
      if (lesson === undefined) return;

      // check if timespent is more than 30 min then only snd timespent as 30 min
      if (data.timeSpent > 1800000) {
        data.timeSpent = 1800000;
      }
      console.log("analytics", {
        address: address,
        pathway: pathway,
        lesson: lesson,
        timeSpent: data.timeSpent,
      });
      fetch("/api/update-analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: address,
          pathway: pathway,
          lesson: lesson,
          timeSpent: data.timeSpent,
        }),
      });
    }
  };

  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChangeStart);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, []);
};

export default useTimeSpent;
