import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import OpportunityCard from "../components/OpportunityCard";
import SearchBar from "../components/SearchBar";

function Home() {

  const [opportunities, setOpportunities] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {

  let url = "http://localhost:5000/opportunities";


  if (search) {
    url = `http://localhost:5000/search?q=${search}`;
  }


  if (category) {
    url = `http://localhost:5000/opportunities?category=${category}`;
  }


  axios
    .get(url)
    .then((response) => {
      setOpportunities(response.data);
    })
    .catch((error) => {
      console.log(error);
    });


}, [search, category]);


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

        <SearchBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
        />

        <div className="grid md:grid-cols-3 gap-6 mt-8">

          {opportunities.map((item) => (
            <OpportunityCard
              key={item.id}
              opportunity={item}
            />
          ))}

        </div>

      </div>

    </div>
  );
}

export default Home;