import { useEffect, useState } from 'react';
import './HotelForm.css';

function HotelForm({hotel,editable,onCancel,onSave}){
    const [hotelForm, setForm] = useState({
        name: "",
        description: "",
        rating: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        phone: "",
        email: ""
    });

    useEffect(()=>{
        if(hotel){
            setForm({
                name : hotel.name || "",
                description: hotel.description || "",
                rating: hotel.rating || "",
                address: hotel.address || "",
                city: hotel.city || "",
                state: hotel.state || "",
                country: hotel.country || "",
                pincode: hotel.pincode || "",
                phone: hotel.phone || "",
                email: hotel.email || ""
            });
        }
    }, [hotel]);

    const handleChange = (event) => {
        const {name,value} = event.target;
        setForm((prev)=>({...prev,[name] : value}));
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        
        if(onSave)
            onSave(hotelForm);
    }

    const handleReset = () => {
        setForm({
            name : hotel?.name || "",
            description: hotel?.description || "",
            rating: hotel?.rating || "",
            address: hotel?.address || "",
            city: hotel?.city || "",
            state: hotel?.state || "",
            country: hotel?.country || "",
            pincode: hotel?.pincode || "",
            phone: hotel?.phone || "",
            email: hotel?.email || ""
        });
    }

    return (
        <div className='form'>
            {/* Info Section */}
            <div className="form-section">
                <h3>Info</h3>
                <div className='hotel-row'>
                    <label htmlFor="name">Name</label>
                    <input 
                        id="name"
                        type="text"
                        name="name"
                        value={hotelForm.name}   
                        onChange={handleChange}
                        readOnly={!editable}
                    />
                </div>
                <div className='hotel-row'>
                    <label htmlFor="description">Description</label>
                    <textarea 
                        id="description"
                        name="description"
                        value={hotelForm.description}   
                        onChange={handleChange}
                        readOnly={!editable}
                        rows="3"
                    />
                </div>
                <div className='hotel-row'>
                    <label htmlFor="rating">Rating</label>
                    <select 
                        id="rating"
                        name="rating"
                        value={hotelForm.rating}   
                        onChange={handleChange}
                        disabled={!editable}
                    >
                        <option value="">Select Rating</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
            </div>

            {/* Location Section */}
            <div className="form-section">
                <h3>Location</h3>
                <div className='hotel-row'>
                    <label htmlFor="address">Address</label>
                    <textarea 
                        name="address"
                        id="address"
                        value={hotelForm.address}   
                        onChange={handleChange}
                        readOnly={!editable}
                        rows="2"
                    />
                </div>
                <div className='hotel-row'>
                    <label htmlFor="city">City</label>
                    <input 
                        type="text"
                        id="city"
                        name="city"
                        value={hotelForm.city}   
                        onChange={handleChange}
                        readOnly={!editable}
                    />
                </div>
                <div className='hotel-row'>
                    <label htmlFor="state">State</label>
                    <input 
                        type="text"
                        id="state"
                        name="state"
                        value={hotelForm.state}   
                        onChange={handleChange}
                        readOnly={!editable}
                    />
                </div>
                <div className='hotel-row'>
                    <label htmlFor="country">Country</label>
                    <input 
                        type="text"
                        id="country"
                        name="country"
                        value={hotelForm.country}   
                        onChange={handleChange}
                        readOnly={!editable}
                    />
                </div>
                <div className='hotel-row'>
                    <label htmlFor="pincode">Pincode</label>
                    <input 
                        type="number"
                        id="pincode"
                        name="pincode"
                        value={hotelForm.pincode}   
                        onChange={handleChange}
                        readOnly={!editable}
                    />
                </div>
            </div>

            {/* Contact Section */}
            <div className="form-section">
                <h3>Contact</h3>
                <div className='hotel-row'>
                    <label htmlFor="phone">Phone</label>
                    <input 
                        type="tel"
                        id="phone"
                        name="phone"
                        value={hotelForm.phone}   
                        onChange={handleChange}
                        readOnly={!editable}
                    />
                </div>
                <div className='hotel-row'>
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email"
                        id="email"
                        name="email"
                        value={hotelForm.email}   
                        onChange={handleChange}
                        readOnly={!editable}
                    />
                </div>
            </div>

            {/* Buttons */}
            {
                ( editable &&
                    <div className='btn-section'>
                        <button type="submit" onClick={handleSubmit}> Save </button>
                        <button id="reset-btn" onClick={handleReset}> Reset </button>                          
                        <button id="cancel-btn" onClick={onCancel}> Cancel </button>
                    </div>
                )
            }
        </div>
    );
}

export default HotelForm;