import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";
import LoadingCard from "../components/LoadingCard";
import { Modal } from "antd";
import { Document, Page } from "react-pdf";
import BookCard from "./book/BookCard";
const posts = [
  {
    id: 0,
    title: "What is SaaS? Software as a Service Explained",
    desc: "Going into this journey, I had a standard therapy regimen, based on looking at the research literature. After I saw the movie, I started to ask other people.",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Englishe_durbolder_jonno_VOCAB_Therapy-Saiful_Islam-babe5-241679.jpg",
    date: "Jan 4 2022",
    href: "javascript:void(0)",
    author: "Norman",
  },
  {
    id: 1,
    title: "A Quick Guide to WordPress Hosting",
    desc: "According to him, â€œI'm still surprised that this has happened. But we are surprised because we are so surprised.â€More revelations.",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Shuru_Theke_Spoken_English-Noore_Jannat_Meem-c72f6-282244.png",
    date: "Jan 4 2022",
    href: "javascript:void(0)",
    author: "Norman",
  },
  {
    id: 2,
    title: "7 Promising VS Code Extensions Introduced in 2022",
    desc: "I hope I remembered all the stuff that they needed to know. They're like, 'okay,' and write it in their little reading notebooks.",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Englishe_durbolder_jonno_English_Therapy-Saiful_Islam-4695a-215765.jpg",
    date: "Jan 4 2022",
    href: "javascript:void(0)",
    author: "Norman",
  },
  {
    id: 3,
    title: "How to Use Root C++ Interpreter Shell to Write C++ Programs",
    desc: "The powerful gravity waves resulting from the impact of the planets' moons â€” four in total â€” were finally resolved in 2015 when gravitational.",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Nerob_IELTS_Vocabulary_with_Synonyms_-Md_Nerob_Hossain-96050-400528.jpg",
    date: "Jan 4 2022",
    href: "javascript:void(0)",
    author: "Norman",
  },
];
const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [sellBooks, setSellBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const foundBook = posts.find((book) => book.id === parseInt(id));

        console.log("findbook", foundBook);

        if (foundBook) {
          setBook(foundBook); // Set the found book
        } else {
          setError("Book not found");
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError("Failed to load book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]); // Dependency on id to refetch when the URL changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container  md:px-0 m-auto pt-20 pb-4">
      <div
        className={`flex items-center mt-3 justify-center border-b flex-col gap-2 ${
          theme === "light" ? "border-gray-200" : "border-gray-500"
        } `}
      ></div>
      <div className="p-1 shadow-sm">
        {book ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div className="flex flex-col items-center gap-y-2 border-r border-dashed border-neutral-400">
              <div className="border border-neutral-300 h-auto w-[60%] p-3 relative">
                <img
                  onClick={showModal}
                  src={book.img}
                  alt={book.title}
                  className="h-full w-full object-cover bg-neutral-500 hover:shadow-2xl border border-gray-300"
                />
              </div>
              <div className="">
                <button
                  onClick={showModal}
                  className="bg-yellow-400 p-2 text-sm font-medium transition hover:scale-105 shadow-md rounded-md"
                >
                  Read Now
                </button>
              </div>
            </div>
            <div
              className={`${
                theme === "light" ? "text-black" : "text-white "
              } space-y-2 flex flex-col`}
            >
              <h1 className="font-bold text-2xl">{book.title}</h1>

              <p></p>
              <p>Category: ENGLISH</p>
              <p className="font-bold text-2xl">Auther: {book.author}</p>
              <p>{book.description}</p>
              <p className="font-bold text-xl">Price: {220}</p>
              <button className="block w-[60%] rounded bg-amber-400 p-4 text-lg font-medium transition hover:scale-105">
                Buy Now
              </button>
            </div>
          </div>
        ) : (
          <p>Book not found</p>
        )}
      </div>
      <div className="space-y-4 font-bold text-3xl">Releted Books</div>
      <div className="space-y-2 border-t border-dashed border-neutral-400">
        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-4">
              {Array.from({ length: 8 }, (_, index) => (
                <LoadingCard key={index} />
              ))}
            </div>
          ) : (
            <BookCard />
          )}
        </div>
      </div>

      <Modal
        title={book?.title}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={null}
      >
        <div className="max-w-screen-lg p-4 flex flex-col gap-y-4">
          <img
            src="https://static.cambridge.org/content/id/urn%3Acambridge.org%3Aid%3Abook%3A9780511622564/resource/name/firstPage-9780511622564c2_p7-19_CBO.jpg"
            className="w-full h-auto"
          />
          <img
            src="https://static.cambridge.org/content/id/urn%3Acambridge.org%3Aid%3Abook%3A9781139018265/resource/name/firstPage-9781139018265c1_p1-14_CBO.jpg"
            className="w-full h-auto"
          />
        </div>
      </Modal>
    </div>
  );
};

export default BookDetails;
