import { useState } from 'react';
import axios from 'axios';

function Complaint() {
  const [detectionResult, setDetectionResult] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      
      // Detect pothole if category is 'roads'
      if (category === 'roads') {
        setIsDetecting(true);
        try {
          const formData = new FormData();
          formData.append('photo', file);
          
          const response = await axios.post('http://localhost:5000/api/complaints/detect-pothole', formData);
          
          if (response.data.success) {
            setDetectionResult(response.data.data);
            if (response.data.data.is_pothole) {
              setDescription(prev => 
                `${prev}\n\nPothole Detected (Confidence: ${(response.data.data.confidence * 100).toFixed(2)}%)`
              );
            }
          }
        } catch (error) {
          console.error('Error detecting pothole:', error);
        } finally {
          setIsDetecting(false);
        }
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Submit a Complaint</h1>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="water">Water Supply</option>
          <option value="electricity">Electricity</option>
          <option value="roads">Roads</option>
          <option value="sanitation">Sanitation</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Photo
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isDetecting && (
          <p className="text-blue-500 mt-2">Detecting pothole in image...</p>
        )}
        {detectionResult && category === 'roads' && (
          <div className={`mt-2 p-2 rounded ${
            detectionResult.is_pothole ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {detectionResult.is_pothole 
              ? `Pothole Detected (Confidence: ${(detectionResult.confidence * 100).toFixed(2)}%)`
              : 'No Pothole Detected'}
          </div>
        )}
      </div>
    </div>
  );
}

export default Complaint; 