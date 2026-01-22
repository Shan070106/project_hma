import { useEffect, useState } from 'react';
import './HotelForm.css';

function HotelForm({hotel,editable}){
    const [hotelForm, setForm] = useState({
        hotelname: "",
        address: "",
        contact: "",
        rating: ""
    });

    useEffect(()=>{
        if(hotel){
            setForm({
                hotelname : hotel.hotelname || "",
                address: hotel.address || "",
                contact: hotel.contact || "",
                rating: hotel.rating || ""
            });
        }
    }, [hotel]);

    const handleChange = (event) => {
        const {name,value} = event.target;
        setForm((prev)=>({...prev,[name] : value}));
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(hotelForm);
    }

    return (
        <div className='form'>
           
            <form className="hotel-info" onSubmit={handleSubmit}>
                {Object.entries(hotelForm).map(([key,value]) => (
                    <div key={key} className='hotel-row'>
                        <label htmlFor={key}>{key}</label>
                        <input 
                        key={key}
                        name={key}
                        value={value} 
                        onChange={handleChange}
                        readOnly={!editable}/>
                    </div>
                ))}                
                <button type="submit" disabled={!editable} >Save&Continue</button>
            </form>
        </div>
    );
}

export default HotelForm;