import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">

      <h1 className="text-2xl font-bold text-blue-600">
        OpportunityIQ
      </h1>

      <div className="flex gap-6">

        <Link
          to="/"
          className="hover:text-blue-600 font-medium"
        >
          Home
        </Link>

        <Link
          to="/saved"
          className="hover:text-blue-600 font-medium"
        >
          Saved Opportunities
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;