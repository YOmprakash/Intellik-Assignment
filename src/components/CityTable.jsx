import React, { useContext, useEffect, useState } from "react";
import { CityContext } from "../context/CityContext";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader"; // Import ClipLoader from react-spinners

const CityTable = () => {
  const { cities, fetchCities, loading } = useContext(CityContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [hasMore, setHasMore] = useState(true); // Track if more data is available

  // Initial fetch
  useEffect(() => {
    fetchCities();
  }, []);

  // Scroll handling and fetching more cities
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      // Check if near bottom and if there are more cities to fetch
      if (
        !loading &&
        hasMore &&
        scrollTop + clientHeight >= scrollHeight - 100
      ) {
        fetchCities();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, fetchCities]);

  // Filter cities based on search query
  useEffect(() => {
    setFilteredCities(
      cities.filter(
        (city) =>
          city.fields.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          city.fields.cou_name_en
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, cities]);

  // Example to update `hasMore` based on fetched data
  useEffect(() => {
    if (!loading && cities.length % 10 !== 0) {
      setHasMore(false); // No more data to fetch
    }
  }, [loading, cities]);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 via-white to-gray-200">
      {/* Search bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search by city or country..."
          className="w-full max-w-md p-3 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="font-bold text-[18px] text-white bg-gradient-to-r from-blue-500 to-green-500">
            <tr>
              <th className="px-6 py-3 font-semibold text-left border-b border-gray-300">City</th>
              <th className="px-6 py-3 font-semibold text-left border-b border-gray-300">Country</th>
              <th className="px-6 py-3 font-semibold text-left border-b border-gray-300">Timezone</th>
              <th className="px-6 py-3 font-semibold text-left border-b border-gray-300">Population</th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.length > 0 ? (
              filteredCities.map((city, index) => (
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

      {/* Show spinner while loading */}
      {loading && !filteredCities.length && (
        <div className="py-8 text-center">
          <ClipLoader color="#FF007F" size={50} />
        </div>
      )}

      {/* Show infinite scroll spinner */}
      {loading && filteredCities.length > 0 && (
        <div className="py-8 text-center">
          <ClipLoader color="#FF007F" size={50} />
        </div>
      )}
    </div>
  );
};

export default CityTable;
