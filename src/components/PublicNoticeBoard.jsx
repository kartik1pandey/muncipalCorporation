import React, { useEffect, useState } from 'react';

const notices = [
  {
    id: 1,
    title: 'Water Supply Interruption',
    date: '2024-06-10',
    content: 'Water supply will be interrupted in Sector 5 from 10am to 2pm for maintenance.'
  },
  {
    id: 2,
    title: 'Power Outage Notice',
    date: '2024-06-12',
    content: 'Scheduled power outage in Raipur city center on June 12th from 1pm to 4pm.'
  },
  {
    id: 3,
    title: 'Public Meeting',
    date: '2024-06-15',
    content: 'Join the Smart City Mission Cell public meeting at Town Hall, 5pm.'
  }
];

const PublicNoticeBoard = () => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % notices.length);
        setFade(true);
      }, 400); // fade out before changing
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-full md:w-80 bg-white shadow rounded-lg p-4 mb-6 md:mb-0 md:ml-6">
      <h2 className="text-lg font-semibold text-indigo-700 mb-4">Public Notice Board</h2>
      <div className={`transition-opacity duration-400 ${fade ? 'opacity-100' : 'opacity-0'}`} key={notices[current].id}>
        <div className="border-b pb-2">
          <div className="text-sm text-gray-500 mb-1">{notices[current].date}</div>
          <div className="font-medium text-gray-900">{notices[current].title}</div>
          <div className="text-gray-700 text-sm">{notices[current].content}</div>
        </div>
      </div>
      <div className="flex justify-center mt-3 space-x-1">
        {notices.map((_, idx) => (
          <span
            key={idx}
            className={`inline-block w-2 h-2 rounded-full ${idx === current ? 'bg-indigo-600' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </aside>
  );
};

export default PublicNoticeBoard; 