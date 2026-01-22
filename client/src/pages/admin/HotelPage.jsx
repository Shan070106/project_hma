import { useState } from 'react';
import HotelForm from '../../components/admin/hotelpage/HotelForm';
import ViewHotel from '../../components/admin/hotelpage/ViewHotel';
import '../../assets/styles/HotelPage.css';

function HotelPage(){
    const [edit, setEdit] = useState(false);
    const hotel = {
        hotelname: "annapoorna",
        address: "Coimbatore",
        contact: "989669",
        rating: '5'
    };
    // fetch hotel later
    // const hotel = null;

    const handleEdit = () => {
        if(hotel){
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
            hotel? (
                edit? (
                    <HotelForm hotel={hotel} editable={edit} onCancel={handleCancel} onSave={handleSave}/>
                ): (
                    <ViewHotel hotel = {hotel}/>
                )
            ) : (
                <HotelForm hotel={null} editable={true}/>
            )
        }

      </div>      
        
    );

}

export default HotelPage;