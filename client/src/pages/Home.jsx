import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold">
          Discover Opportunities
        </h1>

        <p className="text-gray-600 mt-2">
          Internships, Hackathons, Scholarships and more.
        </p>
      </div>
    </div>
  );
}

export default Home;