
import React, { useState, useEffect, useRef } from 'react';

interface LazyCardProps {
  children: React.ReactNode;
  placeholderHeight?: string;
}

const LazyCard: React.FC<LazyCardProps> = ({ children, placeholderHeight = '180px' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Pre-render 200px before appearing
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: isVisible ? 'auto' : placeholderHeight }}>
      {isVisible ? children : <div className="w-full h-full bg-white/20 rounded-[3rem] animate-pulse" />}
    </div>
  );
};

export default LazyCard;
