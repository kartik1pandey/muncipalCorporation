import PublicNoticeBoard from '../components/PublicNoticeBoard';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col md:flex-row md:items-start md:justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero/Main Section */}
        <section className="flex-1 md:mr-6 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold text-indigo-700 mb-4">Welcome to Raipur Smart City Mission</h1>
          <p className="text-lg text-gray-700 mb-6">
            Empowering citizens with digital services, transparent governance, and a smarter, greener Raipur.
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6">
            <li>Access online municipal services</li>
            <li>Stay updated with public notices</li>
            <li>Submit complaints and feedback</li>
            <li>Learn about Raipur's development initiatives</li>
          </ul>
          <a href="/online-services" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 font-medium transition">Explore Online Services</a>
        </section>
        {/* Notice Board */}
        <PublicNoticeBoard />
      </div>
      <Footer />
    </div>
  );
};

export default Home; 