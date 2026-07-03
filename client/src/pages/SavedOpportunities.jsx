import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import OpportunityCard from "../components/OpportunityCard";

function SavedOpportunities() {

    const [saved, setSaved] = useState([]);

    useEffect(() => {

    const token = localStorage.getItem("token");

    axios.get(
        "http://localhost:5000/saved",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    .then((res) => {
        setSaved(res.data);
    })
    .catch((err) => {
        console.log(err);
    });

}, []);

    const removeSaved = (id) => {

    const token = localStorage.getItem("token");

    axios.delete(
        `http://localhost:5000/saved/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    .then((res) => {

        alert(res.data.message);

        setSaved(saved.filter((item) => item.id !== id));

    })
    .catch((err) => {

        console.log(err);

        if (err.response?.status === 401) {
            alert("Please login first!");
        }

    });

};

    return (

        <div className="min-h-screen bg-gray-100">

            <Navbar />

            <div className="max-w-6xl mx-auto p-6">

                <h1 className="text-4xl font-bold">
                    Saved Opportunities
                </h1>

                <div className="grid md:grid-cols-3 gap-6 mt-8">

                    {saved.length === 0 ? (
                        <p className="text-gray-600 text-lg">
                            No saved opportunities yet.
                        </p>
                    ) : (
                        saved.map((item) => (

                            <div key={item.id}>

                                <OpportunityCard
                                    opportunity={item}
                                />

                                <button
                                    onClick={() => removeSaved(item.id)}
                                    className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                                >
                                    Remove
                                </button>

                            </div>

                        ))
                    )}

                </div>

            </div>

        </div>

    );
}

export default SavedOpportunities;