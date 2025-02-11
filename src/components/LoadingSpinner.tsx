import Lottie from 'lottie-react';
import animationData from './loading-animation.json'; // Download the Lottie JSON from the provided link

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <div className="w-24 h-24">
        <Lottie animationData={animationData} loop={true} />
      </div>
    </div>
  );
};

export default LoadingSpinner; 