import React, { useState, useEffect } from "react";

const LazyImage = ({ url, alt }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [opacity, setOpacity] = useState("opacity-0");

  useEffect(() => {
    // 로딩에 따라 opacity state 변경
    isLoading ? setOpacity("opacity-0") : setOpacity("opacity-100");
  }, [isLoading]);

  return (
    <div className="flex justify-center relative h-full w-full">
      {isLoading && (
        <div className="absolute h-full z-10 w-full flex items-center justify-center">
          ...loading
        </div>
      )}

      <img
        src={url}
        alt={alt}
        height="auto"
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        className={`object-contain h-full ${opacity}`}
      />
    </div>
  );
};

export default LazyImage;
