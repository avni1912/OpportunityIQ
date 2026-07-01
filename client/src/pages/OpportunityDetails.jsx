import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function OpportunityDetails() {

  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/opportunities/${id}`)
      .then((res) => {
        setOpportunity(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if (!opportunity) {
    return <h2 className="text-center mt-10">Loading...</h2>;
  }

 return (
  <div className="min-h-screen bg-gray-100 py-10">

    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">

      <h1 className="text-4xl font-bold">
        {opportunity.title}
      </h1>

      <p className="text-xl text-gray-600 mt-2">
        {opportunity.organization}
      </p>

      <span className="inline-block mt-4 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
        {opportunity.category}
      </span>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold">
        Description
      </h2>

      <p className="mt-2 text-gray-700">
        {opportunity.description}
      </p>

      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <div>
          <h3 className="font-semibold">
            Skills Required
          </h3>

          <p>{opportunity.skills_required}</p>
        </div>

        <div>
          <h3 className="font-semibold">
            Deadline
          </h3>

          <p>{opportunity.deadline?.split("T")[0]}</p>
        </div>

        <div>
          <h3 className="font-semibold">
            Eligible Years
          </h3>

          <p>{opportunity.eligible_years}</p>
        </div>

        <div>
          <h3 className="font-semibold">
            Eligible Branches
          </h3>

          <p>{opportunity.eligible_branches}</p>
        </div>

      </div>

      <a
        href={opportunity.apply_link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Apply Now
      </a>

    </div>

  </div>
);
}

export default OpportunityDetails;