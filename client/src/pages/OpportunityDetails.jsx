import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function OpportunityDetails() {

  const { id } = useParams();
  const navigate = useNavigate();
  const getDeadlineStatus = (deadline) => {

    const today = new Date();
    const endDate = new Date(deadline);

    const diffTime = endDate - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
        return {
            text: "Expired",
            color: "bg-red-500"
        };
    }

    if (daysLeft <= 3) {
        return {
            text: "Closing Soon",
            color: "bg-orange-500"
        };
    }

    if (daysLeft <= 7) {
        return {
            text: "Closing This Week",
            color: "bg-yellow-500"
        };
    }

    return {
        text: "Open",
        color: "bg-green-500"
    };
};
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

  const status = getDeadlineStatus(opportunity.deadline);

 return (
  <div className="min-h-screen bg-gray-100 py-10">

    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">

      <button
        onClick={() => navigate("/")}
        className="mb-6 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
      >
        ← Back to Opportunities
      </button>

      <h1 className="text-4xl font-bold">
        {opportunity.title}
      </h1>

      <p className="text-xl text-gray-600 mt-2">
        {opportunity.organization}
      </p>

      <div className="flex gap-3 mt-4">

    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
        {opportunity.category}
    </span>

    <span
        className={`${status.color} text-white px-3 py-1 rounded-full`}
    >
        {status.text}
    </span>

</div>

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