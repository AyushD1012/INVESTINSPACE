import { useSelector } from "react-redux";

export default function Profile() {
  const {currentUser}=useSelector(state => state.user);
  return (
    <div className="bg-white rounded-lg max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold my-9  text-center ">{currentUser.username}</h1>
      <form className="flex flex-col gap-5">
      <img className="h-25 w-25  rounded-full self-center mt-2 object-cover cursor-pointer" src={currentUser.avatar} alt="profile" />
      <input className="border p-3 mx-2 rounded-lg" type="text" placeholder="Username" id="username"/>
      <input className="border p-3 mx-2 rounded-lg" type="text" placeholder="Email Id" id="email"/>
      <input className="border p-3 mx-2 rounded-lg" type="text" placeholder="Password" id="password"/>
      <button className="bg-blue-700 p-3 mx-2 rounded-lg text-white text-xl hover:opacity-95 uppercase disabled:opacity-80">Update</button>
      </form>
      <div className="flex justify-between mt-5 p-2">
        <span className="text-red-600 cursor-pointer">Delete account</span>
        <span className="text-red-600 cursor-pointer">Sign out</span>
      </div>

    
    </div>

  )
}
