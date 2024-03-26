import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { forgetpasswordstart } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Forgetpassword() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/forgotpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
    
        return;
      }
      alert("check your email for reset password link");
      navigate("/sign-in");
     
    } catch (error) {
      console.log(error);
    }
  };
  console.log(formData);
  return (
    <div className="bg-white m-24 h-full rounded-2xl p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Forget Password
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border h-16 p-3 text-xl rounded-lg"
          id="email"
          onChange={handleChange}
        />

        <button className="border h-16 bg-blue-800 text-xl text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          Send
        </button>
      </form>
      <div className="flex text-xl gap-2 mt-5 ">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700 hover:underline">Sign up</span>
        </Link>
      </div>
    </div>
  );
}
