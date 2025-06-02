import React, { useState, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import {
  FiUpload,
  FiTrash2,
  FiDownload,
  FiImage,
  FiPlus,
} from "react-icons/fi";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ImageToPdfGenerate = () => {
  const [images, setImages] = useState([]);
  const [pdfName, setPdfName] = useState("my-document");
  const [isGenerating, setIsGenerating] = useState(false);
  const [pageOrientation, setPageOrientation] = useState("portrait");
  const [imageFit, setImageFit] = useState("fit");
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const moveImage = (index, direction) => {
    if (
      (direction === -1 && index === 0) ||
      (direction === 1 && index === images.length - 1)
    ) {
      return;
    }
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[index + direction];
    newImages[index + direction] = temp;
    setImages(newImages);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;

    setIsGenerating(true);

    try {
      // Create new PDF document
      const doc = new jsPDF({
        orientation: pageOrientation,
        unit: "mm",
      });

      // Process each image
      for (let i = 0; i < images.length; i++) {
        const image = images[i];

        // Add new page for each image after the first
        if (i > 0) doc.addPage();

        // Get image dimensions
        const img = await loadImage(image.preview);
        const imgWidth = img.width;
        const imgHeight = img.height;

        // Calculate PDF page dimensions
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Calculate dimensions to fit image on page
        let width, height;
        if (imageFit === "fit") {
          const ratio = Math.min(
            (pageWidth - 20) / imgWidth,
            (pageHeight - 20) / imgHeight
          );
          width = imgWidth * ratio;
          height = imgHeight * ratio;
        } else if (imageFit === "fill") {
          width = pageWidth - 20;
          height = pageHeight - 20;
        } else {
          // stretch
          width = pageWidth - 20;
          height = (imgHeight / imgWidth) * width;
          if (height > pageHeight - 20) {
            height = pageHeight - 20;
            width = (imgWidth / imgHeight) * height;
          }
        }

        // Center image on page
        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;

        // Add image to PDF
        doc.addImage({
          imageData: img,
          x,
          y,
          width,
          height,
        });

        // Add image name as caption (optional)
        doc.setFontSize(10);
        doc.text(image.name, 10, pageHeight - 10);
      }

      // Save the PDF
      doc.save(`${pdfName}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to load image and get dimensions
  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <Sidebar>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Image to PDF Generator
          </h1>
          <p className="text-gray-600 mb-8">
            Upload your images and convert them to a beautiful PDF document
          </p>

          {/* Upload Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
              onClick={triggerFileInput}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
                multiple
              />
              <FiUpload className="mx-auto text-4xl text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Select Images
              </h3>
              <p className="text-gray-500">
                Drag & drop images here or click to browse
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Supports JPG, PNG, WEBP
              </p>
            </div>
          </div>

          {/* PDF Settings */}
          {images.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                PDF Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PDF Name
                  </label>
                  <input
                    type="text"
                    value={pdfName}
                    onChange={(e) => setPdfName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter PDF name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Orientation
                  </label>
                  <select
                    value={pageOrientation}
                    onChange={(e) => setPageOrientation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image Fit
                  </label>
                  <select
                    value={imageFit}
                    onChange={(e) => setImageFit(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="fit">Fit (Maintain Aspect Ratio)</option>
                    <option value="fill">Fill Page</option>
                    <option value="stretch">Stretch</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={generatePdf}
                  disabled={isGenerating || images.length === 0}
                  className={`flex items-center justify-center px-6 py-3 rounded-md text-white ${
                    isGenerating || images.length === 0
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } transition-colors`}
                >
                  {isGenerating ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <FiDownload className="mr-2" />
                      Generate & Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Your Images ({images.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-40 bg-gray-100 flex items-center justify-center">
                      <img
                        src={image.preview}
                        alt={image.name}
                        className="max-h-full max-w-full object-contain"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          onClick={() => moveImage(index, -1)}
                          disabled={index === 0}
                          className={`p-1 rounded-full ${
                            index === 0
                              ? "bg-gray-200 text-gray-400"
                              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          }`}
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveImage(index, 1)}
                          disabled={index === images.length - 1}
                          className={`p-1 rounded-full ${
                            index === images.length - 1
                              ? "bg-gray-200 text-gray-400"
                              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          }`}
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {image.name}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          {(image.file.size / 1024).toFixed(1)} KB
                        </span>
                        <button
                          onClick={() => removeImage(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:border-blue-500 transition-colors h-40"
                  onClick={triggerFileInput}
                >
                  <FiPlus className="text-2xl text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 text-center">
                    Add more images
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {images.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <FiImage className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-500 mb-2">
                No images selected
              </h3>
              <p className="text-gray-400 mb-6">
                Upload some images to generate your PDF
              </p>
              <button
                onClick={triggerFileInput}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center mx-auto"
              >
                <FiUpload className="mr-2" />
                Select Images
              </button>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default ImageToPdfGenerate;
