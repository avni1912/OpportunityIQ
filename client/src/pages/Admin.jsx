import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Admin() {

    const [formData, setFormData] = useState({
        title: "",
        organization: "",
        category: "",
        description: "",
        deadline: "",
        skills_required: "",
        eligible_years: "",
        eligible_branches: "",
        apply_link: ""
    });

    const [opportunities, setOpportunities] = useState([]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {

        e.preventDefault();
        console.log("Submit clicked");

        const token = localStorage.getItem("token");

        axios.post(
            "http://localhost:5000/opportunities",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((res) => {
            alert(res.data.message);
        })
        .catch((err) => {
            console.log(err);
        });

    };

    const deleteOpportunity = (id) => {

    const token = localStorage.getItem("token");

    axios.delete(
        `http://localhost:5000/opportunities/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    .then((res) => {

        alert(res.data.message);

        setOpportunities(
            opportunities.filter((item) => item.id !== id)
        );

    })
    .catch((err) => {
        console.log(err);
    });

};

    useEffect(() => {

    axios.get("http://localhost:5000/opportunities")
        .then((res) => {
            setOpportunities(res.data);
        });

    }, []);

    return (

        <div className="min-h-screen bg-gray-100">

            <Navbar />

            <div className="max-w-3xl mx-auto p-8">

                <h1 className="text-4xl font-bold mb-6">
                    Admin Dashboard
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-lg shadow-lg space-y-4"
                >

                    <input name="title" placeholder="Title" onChange={handleChange} className="w-full border p-2 rounded"/>

                    <input name="organization" placeholder="Organization" onChange={handleChange} className="w-full border p-2 rounded"/>

                    <input name="category" placeholder="Category" onChange={handleChange} className="w-full border p-2 rounded"/>

                    <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full border p-2 rounded"/>

                    <input type="date" name="deadline" onChange={handleChange} className="w-full border p-2 rounded"/>

                    <input name="skills_required" placeholder="Skills Required" onChange={handleChange} className="w-full border p-2 rounded"/>

                    <input name="eligible_years" placeholder="Eligible Years" onChange={handleChange} className="w-full border p-2 rounded"/>

                    <input name="eligible_branches" placeholder="Eligible Branches" onChange={handleChange} className="w-full border p-2 rounded"/>

                    <input name="apply_link" placeholder="Apply Link" onChange={handleChange} className="w-full border p-2 rounded"/>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Add Opportunity
                    </button>

                </form>

                <h2 className="text-2xl font-bold mt-10 mb-4">
                    All Opportunities
                </h2>

                {
                    opportunities.map((item) => (

                        <div
                            key={item.id}
                            className="bg-white p-4 rounded shadow mb-4 flex justify-between items-center"
                        >

                            <div>
                                <h3 className="font-bold">{item.title}</h3>
                                <p>{item.organization}</p>
                            </div>

                           <button
                                onClick={() => deleteOpportunity(item.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>

                        </div>

                    ))
                }

            </div>

        </div>

    );

}

export default Admin;