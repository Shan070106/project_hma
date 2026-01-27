import { useEffect, useState } from "react";

import "./MenuForm.css";

function MenuForm({ menu, edit,onEdit,onCancel, onSave, onBack }) {
    const [menuForm, setForm] = useState({
        name: "",
        description: "",
        amount: "",
        rating: "",
        image: "",
        recipe: "",
        avail: ""
    });

    useEffect(() => {
        if (menu) {
            setForm({
                name: menu.name || "",
                description: menu.description || "",
                amount: menu.amount || "",
                rating: menu.rating || "",
                image: menu.image || "",
                recipe: menu.recipe || "",
                avail: menu.avail?"yes":"no" 
            });
        }
    }, [menu]);

   const handleSubmit = (event) => {
        event.preventDefault();
        if(onSave)
            onSave(menuForm);
    }

    const handleChange = (event) => {
        const {name,value} = event.target;
        setForm((prev)=>({...prev,[name] : value}));
    }

    const handleReset = () => {
        setForm({
             name: menu?.name || "",
            description: menu?.description || "",
            amount: menu?.amount || "",
            rating: menu?.rating || "",
            image: menu?.image || "",
            recipe: menu?.recipe || "",
            avail: menu?.avail?"yes":"no" 
        })
    }

    return (
        <div className="menu-form">
            <button type="button" onClick={onBack}>{"<-"}</button>
            {menu?.image && <img src={menu.image} alt="food image" />}
            <form className="form" onSubmit={handleSubmit}>
                 {
                    Object.entries(menuForm).map(([key,value]) => (
                        <div key={key} className='menu-row'>
                            <label htmlFor={key}>{key.replace(/^\w/, c => c.toUpperCase())}</label> 
                            <input 
                            key={key}
                            name={key}
                            value={value} 
                            onChange={handleChange}
                            readOnly={!edit}/>
                        </div>
                    ))
                } 

                 {
                    ( edit &&
                        <div>
                            <button type="submit"> Save </button>
                            <button type="button" onClick={handleReset}> Reset </button>                          
                            <button type="button" onClick={onCancel}> Cancel </button>
                        </div>
                    )
                }
                { menu && <button type="button" onClick={onEdit}>Edit</button>}
            </form>
        </div>
    );
}

export default MenuForm;