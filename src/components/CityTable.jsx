import { useContext, useEffect, useState } from "react";
import { CityContext } from "../context/CityContext";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { FaSortUp, FaSortDown } from "react-icons/fa";

const CityTable = () => {
  const { cities, fetchCities, loading } = useContext(CityContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (!loading && hasMore && scrollTop + clientHeight >= scrollHeight - 100) {
        fetchCities();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, fetchCities]);

  useEffect(() => {
    if (!loading && cities.length % 10 !== 0) {
      setHasMore(false);
    }
  }, [loading, cities]);

  // Update suggestions based on the search query
  useEffect(() => {
    if (searchQuery) {
      const filteredSuggestions = cities
        .filter((city) =>
          city.fields.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5); // Limit number of suggestions
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, cities]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedCities = [...cities].sort((a, b) => {
    if (sortConfig.key !== null) {
      const fieldA = a.fields[sortConfig.key];
      const fieldB = b.fields[sortConfig.key];
      if (typeof fieldA === "string") {
        return sortConfig.direction === "ascending"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      } else {
        return sortConfig.direction === "ascending"
          ? fieldA - fieldB
          : fieldB - fieldA;
      }
    }
    return 0;
  });

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <div className="relative flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search by city..."
          className="w-full max-w-md p-3 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClick={() => setShowSuggestions(true)} // Show suggestions on input click
        />
        {showSuggestions && (
          <div
            style={{ top: "100%" }}
            className="absolute top-0 z-50 w-full max-w-md mt-2 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg max-h-60"
          >
            {searchQuery && suggestions.length > 0 ? (
              suggestions.map((city) => (
                <Link
                  key={city.fields.name}
                  to={`/weather/${city.fields.name}`}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => {
                    setSearchQuery("");
                    setShowSuggestions(false);
                  }}
                >
                  {city.fields.name}
                </Link>
              ))
            ) : searchQuery ? (
              <div className="px-4 py-2 text-gray-600">No suggestions</div>
            ) : null} {/* Hide "No suggestions" when searchQuery is empty */}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="font-bold text-[18px] text-white bg-gradient-to-r from-blue-500 to-green-500">
            <tr>
              <th
                className="px-6 py-3 font-semibold text-left border-b border-gray-300 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                City
                {sortConfig.key === "name" && sortConfig.direction === "ascending" ? (
                  <FaSortUp className="inline ml-2 text-black" />
                ) : (
                  <FaSortDown className="inline ml-2 text-black" />
                )}
              </th>
              <th
                className="px-6 py-3 font-semibold text-left border-b border-gray-300 cursor-pointer"
                onClick={() => handleSort("cou_name_en")}
              >
                Country
                {sortConfig.key === "cou_name_en" && sortConfig.direction === "ascending" ? (
                  <FaSortUp className="inline ml-2 text-black" />
                ) : (
                  <FaSortDown className="inline ml-2 text-black" />
                )}
              </th>
              <th className="px-6 py-3 font-semibold text-left border-b border-gray-300">
                Timezone
              </th>
              <th
                className="px-6 py-3 font-semibold text-left border-b border-gray-300 cursor-pointer"
                onClick={() => handleSort("population")}
              >
                Population
                {sortConfig.key === "population" && sortConfig.direction === "ascending" ? (
                  <FaSortUp className="inline ml-2 text-black" />
                ) : (
                  <FaSortDown className="inline ml-2 text-black" />
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCities.length > 0 ? (
              sortedCities.map((city, index) => (
                <tr
                  key={`${city.fields.name}-${city.fields.cou_name_en}-${index}`}
                  className="transition-colors duration-200 cursor-pointer hover:bg-gray-100"
                >
                  <td className="px-6 py-4 border-b border-gray-300">
                    <Link
                      to={`/weather/${city.fields.name}`}
                      className="block w-full h-full"
                    >
                      {city.fields.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-300">
                    <Link
                      to={`/weather/${city.fields.name}`}
                      className="block w-full h-full"
                    >
                      {city.fields.cou_name_en}
                    </Link>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-300">
                    <Link
                      to={`/weather/${city.fields.name}`}
                      className="block w-full h-full"
                    >
                      {city.fields.timezone}
                    </Link>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-300">
                    <Link
                      to={`/weather/${city.fields.name}`}
                      className="block w-full h-full"
                    >
                      {city.fields.population.toLocaleString()}
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-600">
                  No cities found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && !sortedCities.length && (
        <div className="py-8 text-center">
          <ClipLoader color="#FF007F" size={50} />
        </div>
      )}

      {loading && sortedCities.length > 0 && (
        <div className="py-8 text-center">
          <ClipLoader color="#FF007F" size={50} />
        </div>
      )}
    </div>
  );
};

export default CityTable;
