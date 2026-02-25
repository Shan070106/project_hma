import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import HotelForm from '../../components/admin/hotelpage/HotelForm';
import ViewHotel from '../../components/admin/hotelpage/ViewHotel';
import '../../assets/styles/HotelPage.css';
import axios from 'axios';

function HotelPage() {

    const [hotel, setHotel] = useState({
        hotelname: "",
        address: "",
        contact: "",
        rating: ""
    });

    const [edit, setEdit] = useState(false);

    useEffect(() => {
        getHotel();
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
        console.log(hotelData);
        setEdit(false);
    }

    const handleError = (errorMessage) => {
        toast.error(errorMessage,{ position: 'top-center' });
    }

    async function getHotel() {
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

            const { hotelname, address, rating } = response.data;
            setHotel({
                hotelname: hotelname || "",
                address: address || "",
                // contact: contact || "",
                rating: rating || ""
            });
        } catch (error) {
             const errorMsg = error?.response?.data?.message || "Server error" ;
             console.log(error);
            console.log(errorMsg);
            handleError(errorMsg);
        }
    }

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
                hotel ? (
                    edit ? (
                        <HotelForm hotel={hotel} editable={edit} onCancel={handleCancel} onSave={handleSave} />
                    ) : (
                        <ViewHotel hotel={hotel} />
                    )
                ) : (
                    <HotelForm hotel={null} editable={true} />
                )
            }
            <ToastContainer/>
        </div>

    );

}

export default HotelPage;