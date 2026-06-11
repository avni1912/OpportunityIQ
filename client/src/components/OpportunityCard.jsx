function OpportunityCard({ opportunity }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <h2 className="text-xl font-bold">
        {opportunity.title}
      </h2>

      <p className="text-gray-600 mt-2">
        {opportunity.organization}
      </p>

      <span className="inline-block mt-3 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
        {opportunity.category}
      </span>

      <p className="mt-3 text-sm">
        Deadline: {opportunity.deadline?.split("T")[0]}
      </p>
    </div>
  );
}

export default OpportunityCard;