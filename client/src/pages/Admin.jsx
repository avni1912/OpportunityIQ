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
    const [editingId, setEditingId] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");

    const url = editingId
        ? `http://localhost:5000/opportunities/${editingId}`
        : "http://localhost:5000/opportunities";

    try {

        if (editingId) {

            await axios.put(url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Opportunity updated successfully!");

        } else {

            await axios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Opportunity added successfully!");

        }

        setEditingId(null);
        console.log("editingId reset");

        setFormData({
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
        console.log("Form reset");

        const res = await axios.get("http://localhost:5000/opportunities");

        setOpportunities(res.data);
        console.log("Updated opportunities", res.data);

    } catch (err) {

        console.log(err);
        alert(
            err.response?.data?.message ||
            "Something went wrong."
        );

    }

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

const editOpportunity = (item) => {

    setEditingId(item.id);

    setFormData({
        title: item.title,
        organization: item.organization,
        category: item.category,
        description: item.description,
        deadline: item.deadline?.split("T")[0] || "",
        skills_required: item.skills_required,
        eligible_years: item.eligible_years,
        eligible_branches: item.eligible_branches,
        apply_link: item.apply_link
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

                    <input name="title" value={formData.title} placeholder="Title" onChange={handleChange} className="w-full border p-2 rounded"/>

                    <input name="organization" value={formData.organization} placeholder="Organization" onChange={handleChange} className="w-full border p-2 rounded"/>

                    <input name="category" value={formData.category} placeholder="Category" onChange={handleChange} className="w-full border p-2 rounded"/>

                    <textarea name="description" value={formData.description}  placeholder="Description" onChange={handleChange} className="w-full border p-2 rounded"/>

                    <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full border p-2 rounded"/>

                    <input name="skills_required" value={formData.skills_required} placeholder="Skills Required" onChange={handleChange} className="w-full border p-2 rounded"/>

                    <input name="eligible_years" value={formData.eligible_years} placeholder="Eligible Years" onChange={handleChange} className="w-full border p-2 rounded"/>

                    <input name="eligible_branches" value={formData.eligible_branches} placeholder="Eligible Branches" onChange={handleChange} className="w-full border p-2 rounded"/>

                    <input name="apply_link" value={formData.apply_link} placeholder="Apply Link" onChange={handleChange} className="w-full border p-2 rounded"/>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        {editingId ? "Update Opportunity" : "Add Opportunity"}
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
                                onClick={() => editOpportunity(item)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
                            >
                                Edit
                            </button>

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