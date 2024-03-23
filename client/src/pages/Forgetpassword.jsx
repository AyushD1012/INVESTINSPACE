import React from 'react'

export default function Forgetpassword() {
  return (
    <div className="bg-white m-24 h-full rounded-2xl p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4">
        
        <input 
          type="email"
          placeholder="Email"
          className="border h-16 p-3 text-xl rounded-lg"
          id="email"
          
        />
        <input 
          type="password"
          placeholder="Password"
          className="border p-3 h-16 text-xl rounded-lg"
          id="password"
          
        />
        <button  className="border h-16 bg-blue-800 text-xl text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
        Sign In
        </button>
        
      </form>
      <div className="flex text-xl gap-2 mt-5 ">
        <p>Dont have an account?</p>
        
          <span className="text-blue-700 hover:underline">Sign up</span>
      
      </div>
     
     

      
    </div>
    )
}
