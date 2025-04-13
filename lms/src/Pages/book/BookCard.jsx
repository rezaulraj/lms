import React, { useState } from "react";
import { useTheme } from "../../components/ThemeContext";
import LoadingCard from "../../components/LoadingCard";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../components/Auth";

const posts = [
  {
    id: 0,
    title: "What is SaaS? Software as a Service Explained",
    desc: "Going into this journey, I had a standard therapy regimen, based on looking at the research literature. After I saw the movie, I started to ask other people.",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Englishe_durbolder_jonno_VOCAB_Therapy-Saiful_Islam-babe5-241679.jpg",
    date: "Jan 4 2022",
    href: "javascript:void(0)",
    price: "400",
  },
  {
    id: 1,
    title: "A Quick Guide to WordPress Hosting",
    desc: "According to him, â€œI'm still surprised that this has happened. But we are surprised because we are so surprised.â€More revelations.",
    img: "https://drive.google.com/thumbnail?id=0B6wwyazyzml-OGQ3VUo0Z2thdmc&sz=w1000",
    date: "Jan 4 2022",
    href: "javascript:void(0)",
    price: "300",
  },
  {
    id: 2,
    title: "7 Promising VS Code Extensions Introduced in 2022",
    desc: "I hope I remembered all the stuff that they needed to know. They're like, 'okay,' and write it in their little reading notebooks.",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Englishe_durbolder_jonno_English_Therapy-Saiful_Islam-4695a-215765.jpg",
    date: "Jan 4 2022",
    href: "javascript:void(0)",
    price: "440",
  },
  {
    id: 3,
    title: "How to Use Root C++ Interpreter Shell to Write C++ Programs",
    desc: "The powerful gravity waves resulting from the impact of the planets' moons â€” four in total â€” were finally resolved in 2015 when gravitational.",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Nerob_IELTS_Vocabulary_with_Synonyms_-Md_Nerob_Hossain-96050-400528.jpg",
    date: "Jan 4 2022",
    href: "javascript:void(0)",
    price: "500",
  },
  {
    id: 4,
    title: "How to Use Root C++ Interpreter Shell to Write C++ Programs",
    desc: "The powerful gravity waves resulting from the impact of the planets' moons â€” four in total â€” were finally resolved in 2015 when gravitational.",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Nerob_IELTS_Vocabulary_with_Synonyms_-Md_Nerob_Hossain-96050-400528.jpg",
    date: "Jan 4 2022",
    href: "javascript:void(0)",
    price: "500",
  },
];
const BookCard = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const { cart, setCart } = useAuth();

  const addToCart = (item) => {
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex !== -1) {
      // If the item already exists in the cart, increase its quantity
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
      sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      // If the item does not exist in the cart, add it with quantity 1
      const updatedCart = [...cart, { ...item, quantity: 1 }];
      setCart(updatedCart);
      sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  return (
    <div className="md:px-0 m-auto pt-2 pb-8">
      <div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-3">
            {Array.from({ length: 8 }, (_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid gap-x-4 gap-y-10 mt-16 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {posts.map((items, key) => (
              <div
                className="w-full mx-auto flex flex-col items-center justify-between group sm:max-w-sm border border-gray-600 rounded-lg group relative overflow-hidden"
                key={key}
              >
                <Link to={`/book/${items.id}`}>
                  <img
                    src={items.img}
                    loading="lazy"
                    alt={items.title}
                    className="h-[210px] w-full object-cover rounded-lg transition duration-500 group-hover:scale-105 aspect-square p-1"
                  />

                  <div className={`mt-1 space-y-2 p-2`}>
                    <span className="block text-coching-text_color text-sm">
                      {items.date}
                    </span>
                    <h3 className="text-lg line-clamp-2 text-gray-800 duration-150 group-hover:text-coching-text_color font-semibold">
                      {items.title}
                    </h3>
                  </div>
                </Link>
                <div className="flex items-center justify-center mb-2 w-full">
                  <button
                    onClick={() => addToCart(items)}
                    className={`${
                      theme === "light"
                        ? "bg-[#caf3c8] hover:bg-[#96f791] text-[#2b5727]"
                        : "bg-transparent hover:bg-[#caf3c8] border text-[#2b5727]"
                    } w-[96%] font-bold uppercase py-2 rounded-b-lg`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
