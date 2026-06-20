import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import ImageInput from "../../ImageInput";
import { deleteMenuItem } from "../../../services/menuService";

import "./MenuForm.css";

const buildMenuForm = (menu) => ({
    name: menu?.name || "",
    description: menu?.description || "",
    amount: menu?.amount || "",
    rating: menu?.rating || "",
    recipe: menu?.recipe || "",
    avail: menu ? (menu.avail ? "yes" : "no") : ""
});

const getMenuImageUrl = (menu) => menu?.image?.url || null;
const getMenuId = (menu) => menu?._id || menu?.id;

function MenuForm({ menu, edit, onEdit, onCancel, onSave, onBack }) {
    const [menuForm, setForm] = useState(() => buildMenuForm(menu));
    const [menuImageFile, setImageFile] = useState(() => getMenuImageUrl(menu));
    const [selectedFile, setSelectedFile] = useState(null); // Store actual File object
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const isExistingMenu = Boolean(getMenuId(menu));

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
        setForm(buildMenuForm(menu));
        setImageFile(getMenuImageUrl(menu));
        setSelectedFile(null); // Clear actual file
    }

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    }

    const handleDeleteCancel = () => {
        if (!deleting) {
            setShowDeleteConfirm(false);
        }
    }

    const handleDeleteConfirm = async () => {
        const menuId = getMenuId(menu);
        if (!menuId) return;

        setDeleting(true);
        try {
            await deleteMenuItem(menuId);
            toast.success("Menu item deleted successfully", {
                position: "top-center"
            });
            setShowDeleteConfirm(false);
            if (onBack) onBack();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to delete menu item";
            console.error("Error deleting menu item:", errorMessage);
            toast.error(errorMessage, {
                position: "top-center"
            });
        } finally {
            setDeleting(false);
        }
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
        <div className='menu-form'>
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

            <div className="menu-action-bar">
                <button type="button" className="action-btn action-btn-neutral" onClick={onBack}>
                    Back
                </button>

                <div className="menu-action-group">
                    {edit ? (
                        <>
                            <button type="button" className="action-btn action-btn-neutral" onClick={handleReset}>
                                Reset
                            </button>
                            <button type="button" className="action-btn action-btn-neutral" onClick={handleCancel}>
                                Cancel
                            </button>
                            <button type="button" className="action-btn action-btn-primary" onClick={handleSubmit}>
                                Save
                            </button>
                        </>
                    ) : (
                        <>
                            {isExistingMenu && (
                                <button type="button" className="action-btn action-btn-secondary" onClick={handleEdit}>
                                    Edit
                                </button>
                            )}
                            {isExistingMenu && (
                                <button
                                    type="button"
                                    className="action-btn action-btn-destructive"
                                    onClick={handleDeleteClick}
                                    disabled={deleting}
                                >
                                    {deleting ? "Deleting..." : "Delete"}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="menu-modal-backdrop" role="presentation">
                    <div className="menu-delete-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-menu-title">
                        <h3 id="delete-menu-title">Delete Menu Item</h3>
                        <p>
                            Are you sure you want to delete '{menu?.name}'? This action cannot be undone.
                        </p>

                        <div className="menu-dialog-actions">
                            <button
                                type="button"
                                className="action-btn action-btn-neutral"
                                onClick={handleDeleteCancel}
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="action-btn action-btn-destructive"
                                onClick={handleDeleteConfirm}
                                disabled={deleting}
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}

export default MenuForm;
