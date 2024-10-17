// pages/itinerary/ItineraryPage.jsx
import { useState } from 'react';
import { useItinerary } from '../../context/ItineraryContext';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ItineraryPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: currentItinerary, isLoading } = useQuery({
    queryKey: ['currentItinerary'],
    queryFn: async () => {
      const res = await fetch('/api/itinerary/current');
      if (!res.ok) throw new Error('Failed to fetch itinerary');
      return res.json();
    }
  });

  const handleGenerateItinerary = async () => {
    try {
      setIsGenerating(true);
      const res = await fetch('/api/itinerary/build', {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Failed to generate itinerary');

      const data = await res.json();
      
      // Create a blob and download the file
      const blob = new Blob([data.plan], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'travel-itinerary.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Itinerary generated successfully!');
    } catch (error) {
      toast.error('Failed to generate itinerary');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className='flex-[4_4_0] mr-auto border-r border-gray-200 dark:border-gray-800 min-h-screen bg-white dark:bg-gray-950 p-4'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold mb-4'>Your Travel Itinerary</h1>
        {currentItinerary?.destinations?.length === 0 ? (
          <p className='text-gray-500'>No destinations added to your itinerary yet.</p>
        ) : (
          <>
            <div className='grid gap-4'>
              {currentItinerary?.destinations.map((destination) => (
                <div 
                  key={destination._id} 
                  className='bg-gray-800 p-4 rounded-lg flex items-start gap-4'
                >
                  <img 
                    src={destination.img} 
                    alt={destination.placeName}
                    className='w-24 h-24 object-cover rounded'
                  />
                  <div>
                    <h3 className='font-bold text-lg'>{destination.placeName}</h3>
                    <p className='text-sm text-gray-400'>Location: {destination.location}</p>
                    <p className='text-sm text-gray-400'>Best Season: {destination.bestSeasonToVisit}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleGenerateItinerary}
              disabled={isGenerating}
              className='mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isGenerating ? 'Generating...' : 'Generate Day-wise Plan'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ItineraryPage;