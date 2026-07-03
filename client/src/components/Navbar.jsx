import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const handleLogout = () => {

        localStorage.removeItem("token");

        alert("Logged out successfully!");

        navigate("/login");

    };

    return (

        <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">

            <h1 className="text-2xl font-bold text-blue-600">
                OpportunityIQ
            </h1>

            <div className="flex gap-6 items-center">

                <Link
                    to="/"
                    className="hover:text-blue-600 font-medium"
                >
                    Home
                </Link>

                {token ? (
                    <>

                        <Link
                            to="/saved"
                            className="hover:text-blue-600 font-medium"
                        >
                            Saved Opportunities
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="text-red-600 font-medium hover:text-red-800"
                        >
                            Logout
                        </button>

                    </>
                ) : (
                    <>

                        <Link
                            to="/login"
                            className="hover:text-blue-600 font-medium"
                        >
                            Login
                        </Link>

                        <Link
                            to="/signup"
                            className="hover:text-blue-600 font-medium"
                        >
                            Sign Up
                        </Link>

                    </>
                )}

            </div>

        </nav>

    );

}

export default Navbar;