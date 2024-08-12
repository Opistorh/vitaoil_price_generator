// src/App.js
import React, { useState } from "react";

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isToggleOn, setToggleOn] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleToggle = () => {
    setToggleOn(!isToggleOn);
  };

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tailwind CSS Demo</h1>
        <p className="text-gray-700">
          Explore the capabilities of our new UI kit.
        </p>
      </header>

      <main>
        {/* Button Examples */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Buttons</h2>
          <div className="space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Primary Button
            </button>
            <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
              Secondary Button
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-800 rounded hover:bg-gray-100">
              Outline Button
            </button>
          </div>
        </section>

        {/* Card Examples */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Card Title 1</h3>
              <p className="text-gray-700 mb-4">
                This is a simple card example with some text content.
              </p>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Action
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Card Title 2</h3>
              <p className="text-gray-700 mb-4">
                This is another card with different content.
              </p>
              <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                Action
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Card Title 3</h3>
              <p className="text-gray-700 mb-4">
                This card has a different action button.
              </p>
              <button className="px-4 py-2 border border-gray-300 text-gray-800 rounded hover:bg-gray-100">
                Action
              </button>
            </div>
          </div>
        </section>

        {/* Modal Example */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Modal</h2>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Open Modal
          </button>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Modal Title</h3>
                <p className="text-gray-700 mb-4">
                  This is a modal with some content.
                </p>
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Toggle Switch Example */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Toggle Switch
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Toggle is {isToggleOn ? "On" : "Off"}
            </span>
            <button
              onClick={handleToggle}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                isToggleOn ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                  isToggleOn ? "translate-x-6" : ""
                }`}
              ></div>
            </button>
          </div>
        </section>

        {/* Dropdown Selector Example */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Dropdown Selector
          </h2>
          <div className="relative inline-block w-64">
            <select
              value={selectedOption}
              onChange={handleSelectChange}
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select an option</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </section>

        {/* Spinner Example */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Spinner</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLoading}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              {isLoading ? (
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-white h-6 w-6"></div>
              ) : (
                "Load Data"
              )}
            </button>
          </div>
        </section>

        {/* Form Example */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Form</h2>
          <form className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Message</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows="4"
                placeholder="Enter your message"
              ></textarea>
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Submit
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;
