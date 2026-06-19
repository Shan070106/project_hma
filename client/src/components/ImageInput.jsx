// import noImage from "../../assets/images/no-image.jpg";
import '../components/admin/menupage/MenuForm.css';

function ImageInput({ perviewUrl, onImageClick }) {
    return (
        <div className="image-input">
            {perviewUrl && <img src={perviewUrl} alt="Dish image" /> }
           { 
           <input
                type="file"
                accept="image/*"
                onChange={onImageClick}
            />}
        </div>
    );
}

export default ImageInput;