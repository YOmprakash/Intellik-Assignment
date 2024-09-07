import { createContext, useState } from 'react';

// Create a context
export const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch cities function with pagination
  const fetchCities = async () => {
    if (loading) return; // Prevent fetching while already loading
    setLoading(true);
    try {
      const response = await fetch(
        `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&rows=10&page=${page}`
      );
      const data = await response.json();
      console.log('Data:', data);
      setCities((prevCities) => [...prevCities, ...data.records]);
      setPage((prevPage) => prevPage + 1); // Increment page for next fetch
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };

  return (
    <CityContext.Provider value={{ cities, fetchCities, loading }}>
      {children}
    </CityContext.Provider>
  );
};
