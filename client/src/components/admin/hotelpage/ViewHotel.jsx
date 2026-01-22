import '../../../assets/styles/HotelPage.css';

function ViewHotel({hotel}){
    if(!hotel) return <p>No hotel data available.</p> ;
    
    return (
        <div className="view">
            <p>Hotel Name: <strong>{hotel.hotelname}</strong> </p> 
            <p>Address: <strong>{hotel.address}</strong></p>
            <p>Contact Number: <strong>{hotel.contact}</strong></p>
            <p>Rating: <strong>{hotel.rating}</strong></p>
        </div>
    );
}

export default ViewHotel;