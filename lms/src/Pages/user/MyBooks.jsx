import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { FaTimes } from "react-icons/fa";

const books = [
  {
    title: "IELTS for Beginner",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Nerob_IELTS_Vocabulary_with_Synonyms_-Md_Nerob_Hossain-96050-400528.jpg",
  },
  {
    title: "Spoken English Magic",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Learn_Spoken_English_in_10_days_-Jannatul_Ferdous-98541-421195.jpg",
  },
  {
    title: "Basic Grammar",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Basic_English_Grammar_-Azizul_Hakim-84061-255823.jpg",
  },
  {
    title: "Academic Writing Guide",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Academic_Writing_Guide_-Kazi_Salehin_Haque-97366-410233.jpg",
  },
];

const MyBooks = () => {
  const [selectedBook, setSelectedBook] = useState(null);

  const handleBookOpen = (book) => {
    setSelectedBook(book);
  };

  const handleCloseBook = () => {
    setSelectedBook(null);
  };

  return (
    <Sidebar>
      <div className="p-2 rounded-lg shadow-md bg-white m-2 relative">
        <h2 className="font-bold text-center text-2xl">Enrolled Books</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 my-6 gap-4 px-4">
          {books.map((book, ind) => (
            <div
              key={ind}
              className="border border-gray-400 rounded-md overflow-hidden"
            >
              <img
                src={book.img}
                alt={book.title}
                className="w-full h-72 object-contain"
              />
              <div className="p-2">
                <h2 className="text-lg font-semibold">{book.title}</h2>
                <button
                  onClick={() => handleBookOpen(book)}
                  className="w-full mt-2 py-2 bg-coching-nav_color/90 text-white rounded-md"
                >
                  Read book
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Overlay */}
        {selectedBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-xl">{selectedBook.title}</h2>
                <FaTimes
                  onClick={handleCloseBook}
                  className="cursor-pointer text-2xl text-red-600 hover:scale-110 transition"
                />
              </div>
              <div className="flex flex-col justify-center items-center gap-y-6">
                {Array.from({ length: 5 }).map((img, ind) => (
                  <div
                    key={ind}
                    className="flex flex-col justify-center items-center relative"
                  >
                    <img
                      src={selectedBook.img}
                      alt={selectedBook.title}
                      className="w-full max-h-[70vh] object-contain rounded select-none pointer-events-none"
                      draggable="false"
                      onContextMenu={(e) => e.preventDefault()}
                      onMouseDown={(e) => e.preventDefault()}
                      onTouchStart={(e) => e.preventDefault()}
                    />
                    <div className="absolute bottom-0 -right-4 text-black">
                      {ind + 1}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-justify text-sm">
                {/* Add sample book content here */}
                This is a placeholder for the book content. You can load a PDF
                viewer, chapter content, or embed pages here.
              </p>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default MyBooks;
