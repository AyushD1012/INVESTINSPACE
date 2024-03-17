import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  // console.log(landlord.username);
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-4" >
          <p className="text-xl text-slate-700">
            Contact <span className="font-semibold text-black">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold text-black">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            onChange={onChange}
            name="message"
            id="message"
            rows="4"
            placeholder="Enter your message here..."
            className="w-full p-3 border rounded-lg"
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-blue-800 text-white text-center w-full p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
