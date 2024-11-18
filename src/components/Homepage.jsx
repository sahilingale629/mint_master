// src/components/Homepage.js
import React, { useState, useEffect } from "react";
import Papa from "papaparse"; // Import PapaParse to parse CSV
import "./Homepage.css"; // Import the CSS file for styling

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [data, setData] = useState([]); // State to store the CSV data
  const [searchResult, setSearchResult] = useState([]); // State for search results

  // Fetch and parse the CSV file
  useEffect(() => {
    Papa.parse("/merged_file.csv", {
      download: true, // This makes sure to download the file from the public folder
      header: true, // If the CSV file has a header row
      dynamicTyping: true, // Automatically converts types like strings to numbers
      complete: (result) => {
        setData(result.data); // Store the parsed data into state
      },
      error: (error) => {
        console.error("Error parsing CSV file:", error);
      },
    });
  }, []);

  // Handle search on form submit
  const handleSearch = (event) => {
    event.preventDefault();

    // Filter the CSV data based on the search query in the Trading Symbol field
    if (searchQuery.trim() !== "") {
      const filteredData = data.filter((row) => {
        // Search only within the Trading Symbol column
        return (
          row["Trading Symbol"] &&
          row["Trading Symbol"]
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      });

      setSearchResult(filteredData); // Set filtered data as search result
    } else {
      setSearchResult([]); // If search query is empty, clear the results
    }
  };

  return (
    <div className="homepage-container">
      <h1>Welcome to the Homepage!</h1>
      <p>You are now logged in.</p>

      {/* Search Bar Section */}
      <div className="search-bar-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by Trading Symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>

      {/* Display Search Results */}
      {searchResult.length > 0 ? (
        <div className="search-result">
          <h3>Search Results for "{searchQuery}":</h3>{" "}
          {/* Heading added here */}
          <table className="result-table">
            <thead>
              <tr>
                {/* Column names (headers) */}
                <th>Token</th>
                <th>Instrument Type</th>
                <th>Option Type</th>
                <th>Strike Price</th>
                <th>Instrument Name</th>
                <th>Formatted Ins Name</th>
                <th>Trading Symbol</th>
                <th>Expiry Date</th>
                <th>Lot Size</th>
                <th>Tick Size</th>
              </tr>
            </thead>
            <tbody>
              {/* Map through the filtered data and display rows */}
              {searchResult.map((row, index) => (
                <tr key={index}>
                  <td>{row["Token"]}</td>
                  <td>{row["Instrument Type"]}</td>
                  <td>{row["Option Type"]}</td>
                  <td>{row["Strike Price"]}</td>
                  <td>{row["Instrument Name"]}</td>
                  <td>{row["Formatted Ins Name"]}</td>
                  <td>{row["Trading Symbol"]}</td>
                  <td>{row["Expiry Date"]}</td>
                  <td>{row["Lot Size"]}</td>
                  <td>{row["Tick Size"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        searchQuery && (
          <div className="search-result">
            <p>No results found for "{searchQuery}"</p>
          </div>
        )
      )}
    </div>
  );
};

export default Homepage;
