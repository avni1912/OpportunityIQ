import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        axios.post("http://localhost:5000/login", formData)
            .then((res) => {

                localStorage.setItem("token", res.data.token);

                alert("Login Successful!");
                navigate("/");

            })
            .catch((err) => {

                console.log(err.response);

                alert(err.response.data.message);

            });

    };

    return (

        <div className="min-h-screen flex justify-center items-center bg-gray-100">

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg w-96"
            >

                <h1 className="text-3xl font-bold mb-6 text-center">
                    Login
                </h1>

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
                    className="w-full border p-2 mb-6 rounded"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Login
                </button>

            </form>

        </div>

    );

}

export default Login;