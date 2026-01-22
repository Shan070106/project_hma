import './HotelForm.css'

function HotelHeader({heading, description}) {
    return (
        <div >
            <h2>{heading}</h2>
            <div className="hotel-header">
                <p>{description}</p>
            </div>
        </div> 
    );
}

export default  HotelHeader;