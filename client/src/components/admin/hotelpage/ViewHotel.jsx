import '../../../assets/styles/HotelPage.css';
import './ViewHotel.css';

function ViewHotel({hotel}){
    if(!hotel) return <p className="no-data">No hotel data available.</p> ;
    
    return (
        <div className="view-hotel-container">
            <div className="hotel-header">
                <h2>{hotel.name || 'Hotel Name'}</h2>
                <div className="rating-badge">
                    ⭐ {hotel.rating || 'N/A'}
                </div>
            </div>
            
            <div className="hotel-content">
                <div className="hotel-section">
                    <h3>📍 Location</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="label">Address:</span>
                            <span className="value">{hotel.address || 'Not provided'}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">City:</span>
                            <span className="value">{hotel.city || 'Not provided'}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">State:</span>
                            <span className="value">{hotel.state || 'Not provided'}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Country:</span>
                            <span className="value">{hotel.country || 'Not provided'}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Pincode:</span>
                            <span className="value">{hotel.pincode || 'Not provided'}</span>
                        </div>
                    </div>
                </div>
                
                <div className="hotel-section">
                    <h3>📞 Contact</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="label">Phone:</span>
                            <span className="value">{hotel.phone || 'Not provided'}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Email:</span>
                            <span className="value">{hotel.email || 'Not provided'}</span>
                        </div>
                    </div>
                </div>
                
                {hotel.description && (
                    <div className="hotel-section">
                        <h3>📝 Description</h3>
                        <p className="description">{hotel.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewHotel;