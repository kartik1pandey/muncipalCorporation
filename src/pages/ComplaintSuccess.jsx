import { Link } from 'react-router-dom';

function ComplaintSuccess() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        <h1 className="text-3xl font-bold mb-4">Complaint Submitted Successfully!</h1>
        <p className="mb-4">
          Thank you for submitting your complaint. We have received it and will process it shortly.
          You will receive an email confirmation with the details of your complaint.
        </p>
        <p className="mb-6">
          Our team will review your complaint and take appropriate action. You can track the status
          of your complaint through your email notifications.
        </p>
        <div className="space-x-4">
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Return to Home
          </Link>
          <Link
            to="/complaint"
            className="inline-block bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Submit Another Complaint
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ComplaintSuccess; 