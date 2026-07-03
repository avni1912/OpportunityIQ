import { useState } from "react";
import axios from "axios";

function Signup() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        branch: "",
        year: "",
        skills: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        axios.post("http://localhost:5000/signup", formData)
            .then((res) => {
                alert(res.data.message);
            })
            .catch((err) => {
                console.log(err);
            });

    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg w-96"
            >

                <h1 className="text-3xl font-bold mb-6 text-center">
                    Sign Up
                </h1>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                    className="w-full border p-2 mb-4 rounded"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="w-full border p-2 mb-4 rounded"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="w-full border p-2 mb-4 rounded"
                />

                <input
                    type="text"
                    name="branch"
                    placeholder="Branch"
                    onChange={handleChange}
                    className="w-full border p-2 mb-4 rounded"
                />

                <input
                    type="number"
                    name="year"
                    placeholder="Year"
                    onChange={handleChange}
                    className="w-full border p-2 mb-4 rounded"
                />

                <input
                    type="text"
                    name="skills"
                    placeholder="Skills"
                    onChange={handleChange}
                    className="w-full border p-2 mb-6 rounded"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Sign Up
                </button>

            </form>

        </div>
    );

}

export default Signup;