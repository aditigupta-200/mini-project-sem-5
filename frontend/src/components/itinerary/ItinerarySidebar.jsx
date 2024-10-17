// components/itinerary/ItinerarySidebar.jsx
import { useItinerary } from '../../context/ItineraryContext';
import { useState } from 'react';
import axios from 'axios';

const ItinerarySidebar = ({ onClose }) => {
  const { itineraryItems, removeFromItinerary } = useItinerary();
  const [loading, setLoading] = useState(false);

  const handleBuildItinerary = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/itinerary/build', {
        destinations: itineraryItems.map(item => item._id)
      });
      
      // Download the generated PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'travel-itinerary.pdf';
      a.click();
    } catch (error) {
      console.error('Failed to build itinerary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-white dark:bg-gray-900 shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-white">Your Itinerary</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      
      {itineraryItems.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No destinations added yet</p>
      ) : (
        <>
          <div className="space-y-4 mb-4">
            {itineraryItems.map((item) => (
              <div key={item._id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="dark:text-white">{item.name}</span>
                <button
                  onClick={() => removeFromItinerary(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <button
            onClick={handleBuildItinerary}
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Building...' : 'Build Itinerary'}
          </button>
        </>
      )}
    </div>
  );
};

export default ItinerarySidebar;