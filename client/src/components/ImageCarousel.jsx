import React, { useState } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

const ImageCarousel = ({ images, height = "490px", showIndex = true }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle previous image
  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Handle next image
  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative">
      {/* Display only the current image */}
      <img
        src={images[currentImageIndex].url}
        alt="img"
        className={`w-full object-cover rounded-lg`}
        style={{ height }}
      />

      {/* Arrows for navigation */}
      <div className="arrows z-10 absolute flex items-center justify-between w-full top-1/2 transform -translate-y-1/2">
        <FaArrowLeftLong
          onClick={handlePrev}
          className="ml-3 text-gray-400 text-2xl cursor-pointer hover:text-gray-600"
        />
        <FaArrowRightLong
          onClick={handleNext}
          className="mr-3 text-gray-400 text-2xl cursor-pointer hover:text-gray-600"
        />
      </div>

      {/* Display image index (optional) */}
      {showIndex && (
        <div className="text-center mt-3">
          {currentImageIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
