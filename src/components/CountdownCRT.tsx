"use client";

import { useEffect, useState } from "react";

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const tick = () => {
      const d = Math.max(0, targetDate.getTime() - Date.now());
      setTimeLeft({
        days: Math.floor(d / 86400000),
        hours: Math.floor((d % 86400000) / 3600000),
        minutes: Math.floor((d % 3600000) / 60000),
        seconds: Math.floor((d % 60000) / 1000),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export default function CountdownCRT() {
  const launchDate = new Date("2026-04-06T12:00:00-04:00");
  const { days, hours, minutes, seconds } = useCountdown(launchDate);

  const units = [
    { value: days, label: "DD" },
    { value: hours, label: "HH" },
    { value: minutes, label: "MM" },
    { value: seconds, label: "SS" },
  ];

  return (
    <div className="mini-crt mini-crt-green px-3 py-2 sm:px-4 sm:py-2.5">
      <div className="mini-crt-green-prompt font-mono text-[7px] sm:text-[8px] tracking-wider mb-1">
        $ countdown --apr-6
      </div>
      <div className="flex items-baseline" style={{ gap: 0 }}>
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-baseline">
            <div className="text-center">
              <div className="mini-crt-green-time font-mono tabular-nums tracking-[0.15em] text-base sm:text-lg leading-none">
                {String(unit.value).padStart(2, "0")}
              </div>
              <div className="mini-crt-green-labels font-mono text-[6px] sm:text-[7px] tracking-wider mt-1">
                {unit.label}
              </div>
            </div>
            {i < units.length - 1 && (
              <span className="mini-crt-green-time font-mono text-base sm:text-lg leading-none mx-[1px]">
                :
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="mini-crt-green-cursor" />
    </div>
  );
}
