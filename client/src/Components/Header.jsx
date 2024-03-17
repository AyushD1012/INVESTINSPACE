import {FaSearch} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';


export default function Header() {
  const {currentUser}=useSelector(state=>state.user);
  const [searchTerm,setSearchTerm]=useState('');
const navigate=useNavigate();

  const handleSubmit=(e)=>{
    e.preventDefault();
    const urlParams= new URLSearchParams(window.location.search);
    urlParams.set('searchTerm',searchTerm);
    const searchQuery=urlParams.toString();
    navigate(`/search?${searchQuery}`);


  };

  useEffect(()=>{
    const urlParams= new URLSearchParams(location.search);
    const searchTermFromUrl=urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }

  },[location.search]);
  return (
    <header className='bg-blue-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
        <span className='text-blue-500'>INVEST</span>
        <span className='text-red-700'>&</span>
        <span className='text-blue-900'>SCAPE</span>
        </h1>
        </Link> 

        <form onClick={handleSubmit} className='bg-blue-100 p-3 rounded-lg flex items-center'>
          <input onChange={(e)=>setSearchTerm(e.target.value)} value={searchTerm} type="text" placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64'/>
          <button>
          <FaSearch className='text-slate-700'></FaSearch>
          </button>
          
        </form>
        <ul className='flex gap-4'>
          
        <Link to='/'>
          <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
          </Link>
          <Link to='/about'>

          <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
          </Link>
          <Link to='/profile'>
            {currentUser ? (
              <img className='rounded-full h-8 w-8 object-cover' src={currentUser.avatar} alt="profile" />
            ):( <li className=' text-slate-700 hover:underline'>Sign in</li>)}
         
          </Link>
          

        </ul>
        </div>
    </header>
  )
}
