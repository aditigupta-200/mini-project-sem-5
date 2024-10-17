// context/ItineraryContext.jsx
import { createContext, useState, useContext } from 'react';

const ItineraryContext = createContext();

export function ItineraryProvider({ children }) {
  const [itineraryItems, setItineraryItems] = useState([]);
  
  const addToItinerary = (destination) => {
    setItineraryItems(prev => [...prev, destination]);
  };
  
  const removeFromItinerary = (destinationId) => {
    setItineraryItems(prev => prev.filter(item => item._id !== destinationId));
  };
  
  return (
    <ItineraryContext.Provider value={{
      itineraryItems,
      addToItinerary,
      removeFromItinerary
    }}>
      {children}
    </ItineraryContext.Provider>
  );
}

export const useItinerary = () => useContext(ItineraryContext);