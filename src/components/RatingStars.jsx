import { MdOutlineStarHalf, MdOutlineStarOutline } from "react-icons/md";
import { IoStar } from "react-icons/io5";
import { MdOutlineStarPurple500 } from "react-icons/md";

const RatingStars = ({ rating }) => {
  const getStarRatings = (ratin) => {
    const fullStars = Math.floor(ratin);
    const decimalPart = ratin % 1;
    const halfStars = decimalPart >= 0.1 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;
    return { fullStars, halfStars, emptyStars };

  };

  const { fullStars, halfStars, emptyStars } = getStarRatings(rating);
console.log("full", fullStars,halfStars,emptyStars);

  return (
    <div className="flex items-center">
      {/* Render Full Stars */}
      {Array.from({ length: fullStars }, (_, index) => (
        <MdOutlineStarPurple500 key={`full-${index}`} color="#b4690e" size={20} />
      ))}
      {/* Render Half Star */}
      {halfStars > 0 && <MdOutlineStarHalf color="#b4690e" size={20} />}
      {/* Render Empty Stars */}
      {Array.from({ length: emptyStars }, (_, index) => (
        <MdOutlineStarOutline key={`empty-${index}`} color="gray" size={20} />
      ))}
    </div>
  );
};

export default RatingStars;
