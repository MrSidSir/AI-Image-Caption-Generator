import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setCaption('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/caption', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setCaption(data.caption);
    } catch (err) {
      console.error(err);
      setCaption('Error generating caption');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-yellow-400 py-4 px-6 flex flex-col md:flex-row items-center justify-between shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-sm">
          AI Image Caption Generator
        </h1>
        <p className="text-xs md:text-sm text-white mt-1 md:mt-0 italic">
          A project by Mr. Irshad Ahmad using AI and Deep Learning
        </p>
      </header>

      {/* Upload Form */}
      <main className="flex flex-col items-center px-4 py-8 space-y-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-600 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Caption'}
          </button>
        </form>

        {/* Image Preview and Caption Display */}
        {selectedFile && (
          <div className="flex flex-col items-center space-y-4 mt-4">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="max-w-sm rounded-lg shadow-md"
            />
            {caption && (
              <div className="bg-white p-4 rounded-lg shadow-md max-w-sm text-center">
                <h2 className="text-xl font-semibold mb-2">Generated Caption</h2>
                <p className="text-gray-800">{caption}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
