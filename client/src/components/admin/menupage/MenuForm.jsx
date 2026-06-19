import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import ImageInput from "../../ImageInput";

import "./MenuForm.css";

function MenuForm({ menu, edit, onEdit, onCancel, onSave, onBack }) {
    const [menuForm, setForm] = useState({
        name: "",
        description: "",
        amount: "",
        rating: "",
        recipe: "",
        avail: ""
    });

    const [menuImageFile, setImageFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null); // Store actual File object

    useEffect(() => {
        if (menu) {
            setForm({
                name: menu.name || "",
                description: menu.description || "",
                amount: menu.amount || "",
                rating: menu.rating || "",
                recipe: menu.recipe || "",
                avail: menu.avail ? "yes" : "no"
            });
            
            if (menu.image?.url) {
                setImageFile(menu.image.url);
            }
        }

    }, [menu]);

    const handleEdit = () => {
        if (onEdit) onEdit();
    }

    const handleCancel = () => {
        if (onCancel) onCancel();
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const menuData = new FormData();

        Object.entries(menuForm).forEach(([key, value]) => {
            menuData.append(key, value);
        });

        if (selectedFile)
            menuData.append("image", selectedFile); // Send actual File object

        if (onSave)
            onSave(menuData);
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    const handleReset = () => {
        setForm({
            name: menu?.name || "",
            description: menu?.description || "",
            amount: menu?.amount || "",
            rating: menu?.rating || "",
            recipe: menu?.recipe || "",
            avail: menu?.avail ? "yes" : "no"
        });

        setImageFile(menu?.image?.url || null);
        setSelectedFile(null); // Clear actual file
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file); // Store actual File object
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageFile(reader.result); // URL for preview
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className='form'>
            {/* Back Button */}
            <button type="button" onClick={onBack}>{"<- back"}</button>

            {/* Image Section */}
            <div className="form-section">
                <h3>Image</h3>
                <ImageInput
                    perviewUrl={menuImageFile}
                    onImageClick={handleImageChange}
                />
            </div>

            {/* Info Section */}
            <div className="form-section">
                <h3>Info</h3>
                <div className='menu-row'>
                    <label htmlFor="name">Name</label>
                    <input 
                        id="name"
                        type="text"
                        name="name"
                        value={menuForm.name}   
                        onChange={handleChange}
                        readOnly={!edit}
                    />
                </div>
                <div className='menu-row'>
                    <label htmlFor="description">Description</label>
                    <textarea 
                        id="description"
                        name="description"
                        value={menuForm.description}   
                        onChange={handleChange}
                        readOnly={!edit}
                        rows="3"
                    />
                </div>
                <div className='menu-row'>
                    <label htmlFor="amount">Amount</label>
                    <input 
                        id="amount"
                        type="number"
                        name="amount"
                        value={menuForm.amount}   
                        onChange={handleChange}
                        readOnly={!edit}
                    />
                </div>
                <div className='menu-row'>
                    <label htmlFor="rating">Rating</label>
                    <select 
                        id="rating"
                        name="rating"
                        value={menuForm.rating}   
                        onChange={handleChange}
                        disabled={!edit}
                    >
                        <option value="">Select Rating</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <div className='menu-row'>
                    <label htmlFor="avail">Available</label>
                    <select 
                        id="avail"
                        name="avail"
                        value={menuForm.avail}   
                        onChange={handleChange}
                        disabled={!edit}
                    >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
                <div className='menu-row'>
                    <label htmlFor="recipe">Recipe</label>
                    <textarea 
                        id="recipe"
                        name="recipe"
                        value={menuForm.recipe}   
                        onChange={handleChange}
                        readOnly={!edit}
                        rows="3"
                    />
                </div>
            </div>

            {/* Buttons */}
            {
                ( edit &&
                    <div className='btn-section'>
                        <form onSubmit={handleSubmit}>
                            <button type="submit"> Save </button>
                            <button type="button" id="reset-btn" onClick={handleReset}> Reset </button>                          
                            <button type="button" id="cancel-btn" onClick={handleCancel}> Cancel </button>
                        </form>
                    </div>
                )
            }
            
            {menu && <button type="button" onClick={handleEdit}>Edit</button>}
            <ToastContainer />
        </div>
    );
}

export default MenuForm;