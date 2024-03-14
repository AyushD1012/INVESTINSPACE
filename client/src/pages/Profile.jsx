import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

// firebase storage
// allow read;
// allow write:if
// request.resource.size < 2 * 1024 * 1024 &&
// request.resource.contentType.matches('image/.*');

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete= async (listingId)=>{
    try {
      
      const res = await fetch(`/api/listing/delete/${listingId}`,{
        method:'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev)=>prev.filter((listing)=> listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div className="bg-white  rounded-lg max-w-3xl mx-auto">
      <h1 className="text-4xl font-semibold my-10 p-2  text-center ">
        {currentUser.username}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          className="h-44 w-44 hover:opacity-95  rounded-full self-center mt-2 object-cover cursor-pointer"
          src={formData.avatar || currentUser.avatar}
          alt="profile"
        />
        <p className="text-small self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image Upload(image must be under 2mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc} %`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image Succesfully Uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          className="border p-3 mx-3 h-16 text-xl rounded-lg"
          type="text"
          defaultValue={currentUser.username}
          placeholder="Username"
          id="username"
          onChange={handleChange}
        />
        <input
          className="border p-3 mx-3 h-16  text-xl rounded-lg"
          type="text"
          defaultValue={currentUser.email}
          placeholder="Email Id"
          id="email"
          onChange={handleChange}
        />
        <input
          className="border p-3 mx-3 h-16 text-xl rounded-lg"
          type="password"
          placeholder="Password"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-blue-700 p-3 mx-3 h-16  rounded-lg text-white text-xl hover:opacity-95 uppercase disabled:opacity-80"
        >
          {loading ? "loading..." : "Update"}
        </button>
        <Link
          className="bg-green-600 p-4 mx-3 my-1 h-16 rounded-lg text-white text-xl hover:opacity-95 uppercase text-center"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5 p-2">
        <span
          onClick={handleDeleteUser}
          className="text-xl text-red-600 cursor-pointer"
        >
          Delete account
        </span>
        <span
          onClick={handleSignOut}
          className="text-xl text-red-600 cursor-pointer"
        >
          Sign out
        </span>
      </div>
      <p className="text-red-600 mt-5">{error ? error.message : ""}</p>
      <p className="text-green-600 mt-5">
        {updateSuccess ? "User is updated successfully!" : ""}
      </p>
      <button
        onClick={handleShowListings}
        className="text-green-600 text-xl w-full"
      >
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listing" : ""}
      </p>
      {userListings &&
        userListings.length > 0 &&
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold text-center my-7">Your Listings</h1>
          {userListings.map((listing) => (
          <div
            key={listing._id}
            className="border my-2 flex p-3 justify-between items-center gap-4"
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                className="h-16 w-16 object-contain "
                src={listing.imageURLs[0]}
                alt="lisiting image"
              />
            </Link>

            <Link
              className="flex-1 truncate hover:underline font-semibold"
              to={`/listing/${listing._id}`}
            >
              <p>{listing.name}</p>
            </Link>
            <div className="flex flex-col items-center">
              <button onClick={()=>handleListingDelete(listing._id)} className="text-red-700 uppercase">Delete</button>
              <Link to={`/update-listing/${listing._id}`}>
              <button className="text-green-700 uppercase">Edit</button>
              </Link>
              
            </div>
          </div>
        ))}</div>
        }
    </div>
  );
}
