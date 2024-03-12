import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useState } from "react";
import {useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"
import { Link } from "react-router-dom";


export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    imageURLs: [],
    name:'',
    description:'',
    address:'',
    type:'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice:0,
    discountPrice:0,
    offer:false,
    parking:false,
    furnished:false,
  });
  console.log(formData);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const {currentUser}=useSelector((state)=>state.user);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageURLs.length < 7) {
      const promises = [];
      setUploading(true);
      setImageUploadError(false);

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageURLs: formData.imageURLs.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed(max 2mb per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageURLs: formData.imageURLs.filter((_, i) => i !== index),
    });
  };

  const handleChange=(e)=>{
    if(e.target.id === 'sale' || e.target.id === 'rent'){
      setFormData({...formData,
      type:e.target.id})
    }
    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
      setFormData({...formData,
      [e.target.id]:e.target.checked
    })
    }
    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
      setFormData({...formData,
      [e.target.id]:e.target.value
    })
    }


  }
const handleSubmit=async (e)=>{
  e.preventDefault();
  try {
    if(formData.imageURLs.length <1){
      return setError('You must upload atleast one image')
    }
    if(+formData.regularPrice < +formData.discountPrice){
      return setError('Discount Price must be lower than regular price')
    }
    setLoading(true);
    setError(false);
    
    const res = await fetch('/api/listing/create', {
      method: 'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        ...formData,
        userRef: currentUser._id,
      }),
    
    });

    const data=await res.json();
    setLoading(false);
    if(data.success===false){
       setError(data.message);
    }

    navigate(`/listing/${data._id}`);
    
   
  } catch (error) {
    setLoading(false);
    setError(error.message);
  }

}
  return (
    <main className="p-4 max-w-screen-xl mx-auto bg-white my-14 rounded-3xl">
      <h1 className="font-bold text-center my-10 text-4xl  ">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-10">
        <div className="gap-4 flex flex-col flex-1">
          <input
            type="text"
            placeholder="Name"
            className="p-3 text-xl rounded-lg  border"
            id="name"
           
            required
            onChange={handleChange}
            value={formData.name}
          />

          <textarea
            type="text"
            placeholder="Description"
            className="p-3 text-xl rounded-lg  border"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />

          <input
            type="text"
            placeholder="Address"
            className="p-3 text-xl rounded-lg  border"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-6" onChange={handleChange} checked={formData.type === 'sale'} />
              <span className="text-xl">Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-6"  onChange={handleChange} checked={formData.type === 'rent'} />
              <span className="text-xl">Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-6" onChange={handleChange} checked={formData.parking} />
              <span className="text-xl">Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-6" onChange={handleChange} checked={formData.furnished} />
              <span className="text-xl">Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-6" onChange={handleChange} checked={formData.offer} />
              <span className="text-xl">Offer</span>
            </div>
          </div>
          
            <div className="flex gap-28  justify-between">
              <div className="flex items-center gap-3">
                <input
                  className="h-12 w-20 border rounded-lg border-gray-400"
                  type="number"
                  id="bedrooms"
                  min='1'
                  max='10'
                  required
                  onChange={handleChange} 
                  value={formData.bedrooms}
                />
                <p className="text-xl my-2">Bedrooms</p>
              </div>
              <div className="flex gap-2">
                <input
                  className="h-12 w-20 border rounded-lg border-gray-400"
                  type="number"
                  id="bathrooms"
                  min='1'
                  max='10'
                  required
                  onChange={handleChange} 
                  value={formData.bathrooms}
                />
                <p className="text-xl my-2">Bathrooms</p>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex my-10 gap-6">
                <input
                  className="h-12 w-32 border rounded-lg border-gray-400"
                  type="number"
                  id="regularPrice"
                  min="0"
                  max="1000000000"
                  required
                  onChange={handleChange} 
                  value={formData.regularPrice}
                />
                <div className="flex flex-col items-center">
                  <p className="text-xl">Regular Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
              {formData.offer && (
              <div className="flex my-10 gap-6">
              <input
                className="h-12 w-32 border rounded-lg border-gray-400"
                type="number"
                id="discountPrice"
                min="0"
                max="1000000000"
                required
                onChange={handleChange} 
                value={formData.discountPrice}
              />
              <div className="flex flex-col items-center">
                <p className="text-xl">Discounted Price</p>
                <span className="text-xs ">($ / month)</span>
              </div>
            </div>
              )
              }
              
            </div>
          </div>
        
        <div className="flex flex-col flex-1">
          <p className="font-semibold text-xl">
            Images:
            <span className="font-normal text-lg text-gray-600 ml-2 ">
              The first image will be the cover(max 6)
            </span>
          </p>
          <div className="flex gap-4 my-5">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />

            <button
              disabled={uploading}
              type="button"
              onClick={handleImageSubmit}
              className="bg-blue-700 p-3 rounded-lg uppercase text-white border hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-600 p-2">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageURLs.length > 0 &&
            formData.imageURLs.map((url, index) => (
              <div
                key={url}
                className="flex justify-between items-center p-3 border my-1 rounded-lg"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg "
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-700 text-lg p-3 rounded-lg hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <div>
            <button disabled={loading || uploading} className=" w-full  uppercase p-4  text-xl bg-green-600 rounded-lg text-white hover:opacity-95 disabled:opacity-80">
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            
            
          </div>
        </div>
      </form>
    </main>
  );
}
