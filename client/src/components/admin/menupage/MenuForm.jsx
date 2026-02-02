import { useEffect, useState } from "react";

import noImage from "../../../assets/images/no-image.jpg";
import "./MenuForm.css";

function MenuImageInput({ perviewUrl, onImageClick }) {
    return (
        <div className="image-input">
            {perviewUrl && <img src={perviewUrl || noImage} alt="Dish image" /> }
           { 
           <input
                type="file"
                accept="image/*"
                onChange={onImageClick}
            />}
        </div>
    );
}


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

    const handleSubmit = (event) => {
        event.preventDefault();

        const menuData = new FormData();

        Object.entries(menuForm).forEach(([key, value]) => {
            menuData.append(key, value);
        });

        if (menuImageFile)
            menuData.append("image",menuImageFile);

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

        if (menuImageFile) {
            setImageFile(menu.image?.url || noImage);
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageFile(reader.result); // URL for preview
            };
            reader.readAsDataURL(file);
        }
    };

    return (
    <>
        <button type="button" onClick={onBack}>{"<- back"}</button>
            
        <div className="menu-form">
            <MenuImageInput
                perviewUrl={menuImageFile || noImage}
                onImageClick={handleImageChange}
                />
            <form className="form" onSubmit={handleSubmit}>
                {
                    Object.entries(menuForm).map(([key, value]) => (
                        <div key={key} className='menu-row'>
                            <label htmlFor={key}>{key.replace(/^\w/, c => c.toUpperCase())}</label>
                            <input
                                key={key}
                                name={key}
                                value={value}
                                onChange={handleChange}
                                readOnly={!edit} />
                        </div>
                    ))
                }

                {
                    (edit &&
                        <div>
                            <button type="submit"> Save </button>
                            <button type="button" onClick={handleReset}> Reset </button>
                            <button type="button" onClick={onCancel}> Cancel </button>
                        </div>
                    )
                }
                {menu && <button type="button" onClick={onEdit}>Edit</button>}
            </form>
        </div>
        </>
    );
}

export default MenuForm;