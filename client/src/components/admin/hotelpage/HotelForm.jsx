import { useEffect, useState } from 'react';
import './HotelForm.css';

function HotelForm({hotel,editable,onCancel,onSave}){
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
        // console.log(hotelForm);
        if(onSave)
            onSave(hotelForm);
    }

    const handleReset = () => {
        setForm({
            hotelname : hotel?.hotelname || "",
            address: hotel?.address || "",
            contact: hotel?.contact || "",
            rating: hotel?.rating || ""
        });
    }

    return (
        <div className='form'>
           
            <form className="hotel-info" onSubmit={handleSubmit}>
                {
                    Object.entries(hotelForm).map(([key,value]) => (
                        <div key={key} className='hotel-row'>
                            <label htmlFor={key}>{key.replace(/^\w/, c => c.toUpperCase())}</label> 
                            <input 
                            key={key}
                            name={key}
                            value={value} 
                            onChange={handleChange}
                            readOnly={!editable}/>
                        </div>
                    ))
                }                

                {
                    ( editable &&
                        <div>
                            <button type="submit"> Save </button>
                            <button onClick={handleReset}> Reset </button>                          
                            <button onClick={onCancel}> Cancel </button>
                        </div>
                    )
                }
            </form>

        </div>
    );
}

export default HotelForm;