import React, { useState, useEffect } from "react";
import Papa from "papaparse"; // Import PapaParse to parse CSV
import "./Homepage.css"; // Import the CSS file for styling

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [data, setData] = useState([]); // State to store the CSV data
  const [searchResult, setSearchResult] = useState([]); // State for search results
  const [selectedSymbols, setSelectedSymbols] = useState([]); // State to store selected symbols
  const [checkedSymbols, setCheckedSymbols] = useState([]); // State to store checked symbols for deletion

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

  // Handle search on input change (dynamic search)
  const handleSearch = (event) => {
    const query = event.target.value.trim();
    setSearchQuery(query);

    if (query !== "") {
      // Filter the CSV data based on the search query in the Instrument Name field
      const filteredData = data.filter((row) => {
        return (
          row["Instrument Name"] &&
          row["Instrument Name"].toLowerCase().includes(query.toLowerCase())
        );
      });
      setSearchResult(filteredData); // Set filtered data as search result
    } else {
      setSearchResult([]); // If search query is empty, clear the results
    }
  };

  // Handle symbol selection
  const handleSelectSymbol = (symbol) => {
    setSelectedSymbols((prevSymbols) => {
      if (!prevSymbols.includes(symbol)) {
        return [...prevSymbols, symbol]; // Add symbol if not already selected
      }
      return prevSymbols; // Prevent adding duplicate symbols
    });
  };

  // Handle checkbox change (for deletion)
  const handleCheckboxChange = (symbol) => {
    setCheckedSymbols((prevChecked) => {
      if (prevChecked.includes(symbol)) {
        return prevChecked.filter((checkedSymbol) => checkedSymbol !== symbol); // Remove symbol if already checked
      } else {
        return [...prevChecked, symbol]; // Add symbol if not checked
      }
    });
  };

  // Handle delete for checked symbols
  const handleDeleteSelected = () => {
    setSelectedSymbols((prevSymbols) =>
      prevSymbols.filter((symbol) => !checkedSymbols.includes(symbol))
    );
    setCheckedSymbols([]); // Clear checked symbols after deletion
  };

  // Function to save the selected symbols as a CSV file
  const saveToCSV = () => {
    const selectedData = selectedSymbols.map((symbol) => ({
      "Trading Symbol": symbol,
    }));

    // Use PapaParse to generate the CSV and trigger the download
    const csv = Papa.unparse(selectedData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    // Create a link element to trigger the download
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "selected_symbols.csv");
      link.click();
    }
  };

  // Function to handle the 'Login All Clients' button click
  const handleLoginAllClients = () => {
    // Implement the logic for logging in all clients here
    console.log("Logging in all clients...");
    // You can make an API call or trigger some other action here
  };

  return (
    <div className="homepage-container">
      {/* Login All Clients Button */}
      <div className="login-all-clients-button-container">
        <button
          onClick={handleLoginAllClients}
          className="login-all-clients-button"
        >
          Login All Clients
        </button>
      </div>

      <h1>Welcome to the Homepage!</h1>
      <p>You are now logged in.</p>

      {/* Search Bar Section */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search by Instrument Name..."
          value={searchQuery}
          onChange={handleSearch} // Trigger search on every input change
          className="search-input"
        />
      </div>

      {/* Box Section */}
      <div className="boxes-container">
        {/* Box 1: Results */}
        <div className="box" id="box1">
          <h2>Results</h2>
          {searchResult.length > 0 ? (
            <table className="result-table">
              <thead>
                <tr>
                  {/* Show only Instrument Name and Trading Symbol columns */}
                  <th>Instrument Name</th>
                  <th>Trading Symbol</th>
                </tr>
              </thead>
              <tbody>
                {searchResult.map((row, index) => (
                  <tr
                    key={index}
                    onClick={() => handleSelectSymbol(row["Trading Symbol"])}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{row["Instrument Name"]}</td>
                    <td>{row["Trading Symbol"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No results found for "{searchQuery}"</p>
          )}
        </div>

        {/* Box 2: Selected Symbols */}
        <div className="box" id="box2">
          <h2>Selected Symbols</h2>
          {selectedSymbols.length > 0 ? (
            <ul>
              {selectedSymbols.map((symbol, index) => (
                <li key={index}>
                  <input
                    type="checkbox"
                    checked={checkedSymbols.includes(symbol)}
                    onChange={() => handleCheckboxChange(symbol)} // Handle checkbox change
                  />
                  {symbol}
                </li>
              ))}
            </ul>
          ) : (
            <p>No symbols selected yet.</p>
          )}
        </div>
      </div>

      {/* Delete Button */}
      {checkedSymbols.length > 0 && (
        <div className="delete-button-container">
          <button onClick={handleDeleteSelected} className="delete-button">
            Delete Selected Symbols
          </button>
        </div>
      )}

      {/* Save Button */}
      <div className="save-button-container">
        <button onClick={saveToCSV} className="save-button">
          Save Selected Symbols
        </button>
      </div>
    </div>
  );
};

export default Homepage;
