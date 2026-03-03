import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import HotelForm from '../../components/admin/hotelpage/HotelForm';
import ViewHotel from '../../components/admin/hotelpage/ViewHotel';
import '../../assets/styles/HotelPage.css';
import axios from 'axios';

function HotelPage() {

    const [hotel, setHotel] = useState(null);
    const [edit, setEdit] = useState(false);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        fetchHotel();
    }, []);

    const handleEdit = () => {
        if (hotel) {
            setEdit(true);
        }
    }

    const handleCancel = () => {
        setEdit(false);
    }

    const handleSave = (hotelData) => {
        if (hotel) {
            // Update existing hotel
            updateHotel(hotelData);
        } else {
            // Create new hotel
            postHotel(hotelData);
        }
        console.log(hotelData);
        setEdit(false);
    }

    const handleSuccess = (msg) => {
        toast.success(msg,{
            position: 'top-center'
        });
    }

    const handleError = (errorMessage) => {
        toast.error(errorMessage,{ position: 'top-center' });
    }

    async function fetchHotel() {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                'http://localhost:5000/api/hotel/me',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setHotel(response.data);

        } catch (error) {
            const errorMsg = error?.response?.data?.message || "Server error" ;
            console.log(error);
            console.log(errorMsg);

            if(errorMsg === "Hotel not found") setHotel(null);           
            else handleError(errorMsg);
            
        } finally{
            setLoading(false);
        }

    }

    async function updateHotel(hotelData) {
         try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                'http://localhost:5000/api/hotel/me',
                hotelData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log(response);
            setHotel(response?.data?.data);
            handleSuccess(response?.data?.message);
        } catch (error) {
            const errorMsg = error?.response?.data?.message || "Server Error on update";
            console.log(error);
            handleError(errorMsg);
        }         
        fetchHotel();
    }

    async function postHotel(hotelData) {
         try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                'http://localhost:5000/api/hotel/create',
                hotelData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            handleSuccess(response?.data?.message);
            fetchHotel(); 
        } catch (error) {
            const errorMsg = error?.response?.data?.message || "Server Error on post";
            console.log(error);
            handleError(errorMsg);
        } 
    }

    if(loading) return <p>Loading the page</p>;

    return (
        <div className='hotelpage'>
            <header>
                <h2>Hotel Information Page</h2>
                <p>
                    If you are a new user, fill the form. To view the hotel info click the button below.
                </p>
            </header>

            <div className='btns'>
                <button onClick={handleEdit}>Edit</button>
            </div>

            {
                hotel && edit && (
                    <HotelForm 
                        hotel={hotel} 
                        editable={edit} 
                        onCancel={handleCancel} 
                        onSave={handleSave} 
                    />
                )
            }
                
            {
                hotel && !edit && (
                    <ViewHotel hotel={hotel} />
                )
            }
                
            {
                !hotel && (
                    <HotelForm 
                        hotel={hotel} 
                        editable={true} 
                        onSave={handleSave}
                    />
                )
            }
            <ToastContainer/>
        </div>

    );

}

export default HotelPage;