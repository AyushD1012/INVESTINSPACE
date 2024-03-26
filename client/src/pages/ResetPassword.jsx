import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

export default function ResetPassword() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {id,token}=useParams();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/auth/resetpassword/${id}/${token}`, {
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
      alert("password has been updated")
      navigate("/sign-in");

     
    } catch (error) {
      console.log(error);
    }
  };
  console.log(formData)

  return (
    <div className="bg-white m-24 h-full rounded-2xl p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Reset Password
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input 
          type="password"
          placeholder="New Password"
          className="border p-3 h-16 text-xl rounded-lg"
          id="password"
          onChange={handleChange}
        
        />
      <input 
          type="confirm_password"
          placeholder="Confirm Password"
          className="border p-3 h-16 text-xl rounded-lg"
          id="confirm_password"
          onChange={handleChange}
        
        />

        <button className="border h-16 bg-blue-800 text-xl text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      
    </div>
  );
}
