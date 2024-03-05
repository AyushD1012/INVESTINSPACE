import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from "../firebase";

// firebase storage
// allow read;
      // allow write:if 
      // request.resource.size < 2 * 1024 * 1024 && 
      // request.resource.contentType.matches('image/.*');


export default function Profile() {
  const fileRef=useRef(null);
  const {currentUser}=useSelector(state => state.user);
  const [file,setFile]=useState(undefined);
  const [filePerc,setFilePerc]=useState(0);
  const [fileUploadError, setFileUploadError]=useState(false);
  const [formData, setFormData]=useState({});

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file]);

const handleFileUpload= (file) => {
  const storage=getStorage(app);
  const fileName= new Date().getTime() + file.name;
  const storageRef=ref(storage,fileName);
  const uploadTask=uploadBytesResumable(storageRef,file);


uploadTask.on(
  'state_changed',
  (snapshot)=>{
    const progress=(snapshot.bytesTransferred / snapshot.totalBytes)* 100;
    setFilePerc(Math.round(progress));
  },
  (error)=>{
    setFileUploadError(true);
  },
  ()=>{
    getDownloadURL(uploadTask.snapshot.ref).then
    ((downloadURL)=>
      setFormData({...formData, avatar:downloadURL})
    
    );
  }

);
}
  return (
    <div className="bg-white rounded-lg max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold my-10 p-2  text-center ">{currentUser.username}</h1>
      <form className="flex flex-col gap-5">
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />
      <img onClick={()=> fileRef.current.click()} className="h-44 w-44 hover:opacity-95  rounded-full self-center mt-2 object-cover cursor-pointer" src={formData.avatar || currentUser.avatar} alt="profile" />
      <p className="text-small self-center">
        {fileUploadError ? (
          <span className="text-red-700">Error Image Upload(image must be under 2mb)</span>
        ) : filePerc>0 && filePerc<100 ?(
          <span className="text-slate-700">{`Uploading ${filePerc} %`}</span>
        ) : filePerc === 100 ? (
          <span className="text-green-700">Image Succesfully Uploaded!</span>
        ) : (
          ''
        )
      }
        </p> 
      <input className="border p-3 mx-3 rounded-lg" type="text" placeholder="Username" id="username"/>
      <input className="border p-3 mx-3 rounded-lg" type="text" placeholder="Email Id" id="email"/>
      <input className="border p-3 mx-3 rounded-lg" type="text" placeholder="Password" id="password"/>
      <button className="bg-blue-700 p-3 mx-3 rounded-lg text-white text-xl hover:opacity-95 uppercase disabled:opacity-80">Update</button>
      </form>
      <div className="flex justify-between mt-5 p-2">
        <span className="text-xl text-red-600 cursor-pointer">Delete account</span>
        <span className="text-xl text-red-600 cursor-pointer">Sign out</span>
      </div>

    
    </div>

  )
}
