"use client";
import { useState, useRef, useEffect } from "react";
import type { ProgressBarProps } from "@/types";

const ProgressBarComponent = ({ max, children }: ProgressBarProps) => {
  const [counted, setCounted] = useState(0);
  const targetElement = useRef<HTMLDivElement>(null);

  const startCountup = () => {
    const intervalId = setInterval(() => {
      setCounted((prevCounted) => {
        const newCounted = prevCounted + 1;
        if (newCounted >= max) {
          clearInterval(intervalId);
        }
        return newCounted;
      });
    }, 2000 / max);
  };

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          startCountup();
          observer.unobserve(entry.target);
        }
      });
    };

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    if (targetElement.current) {
      observer.observe(targetElement.current);
    }

    return () => {
      if (targetElement.current) {
        observer.unobserve(targetElement.current);
      }
    };
  }, [max]);

  return (
    <>
      <div
        ref={targetElement}
        className="value"
        style={{ width: `${counted}%` }}
      >
        {children}
      </div>
    </>
  );
};

export default ProgressBarComponent;
