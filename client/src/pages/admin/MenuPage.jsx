import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "../../assets/styles/MenuPage.css";
import MenuSample from "../../sample data/MenuSample";
import MenuForm from "../../components/admin/menupage/MenuForm";
import DisplayMenu from "../../components/admin/menupage/DisplayMenu";

function MenuPage() {
    const [mode, setMode] = useState("list"); // mode : list | form 
    const [opened, setOpened] = useState(null);
    const [editable, setEditable] = useState(false);
    const [menuItems,setMenuItem] = useState([]);

    const handleSuccess = (successMessage) => {
        toast.success(successMessage,{
            position: 'top-center'
        });
    }

    const handleError = (errorMessage) => {
        toast.error(errorMessage,{ 
            position: 'top-center' 
        });
    }

    // menuList fectched from server side later...
    // const menuList = menuItems;
    // const menuList = [];

    useEffect(() => {
        fetchMenuItems();
    }, []); 

    const handleAdd = () => {
        setOpened(null);
        setEditable(true);
        setMode("form");
    }

    const handleOpen = (menu) => {
        setMode("form");
        setEditable(false);
        setOpened(menu);
    }

    const handleBack = () => {
        setMode("list");
        setOpened(null);
        setEditable(false);
        fetchMenuItems(); // Refresh menu list when returning from form
    }

    const getMenuId = (menu) => menu?._id || menu?.id;

    const handleSave = async (menuData) => {
        try {
            const token = localStorage.getItem("token");
            
            if (opened) {
                const menuId = getMenuId(opened);
                if (!menuId) {
                    throw new Error("Selected menu id is missing");
                }

                // Update existing menu
                await axios.put(
                    `http://localhost:5000/api/menu/${menuId}`,
                    menuData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                handleSuccess("Menu updated successfully");
            } else {
                // Create new menu
                await axios.post(
                    'http://localhost:5000/api/menu/create',
                    menuData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                handleSuccess("Menu created successfully");
            }
            
            fetchMenuItems(); // Refresh menu list after save
            handleBack();
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to save menu item";
            console.error("Error saving menu item:", errorMessage);
            handleError(errorMessage);
        }
    }

    const handleEdit = () => {
        if (opened) {
            setEditable(true);
        }
    }

    const isEditMode = () => {
        return editable;
    }

    const handleCancel = () => {
        setEditable(false);
        handleBack();
    }

    async function fetchMenuItems() {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                'http://localhost:5000/api/menu/list',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setMenuItem(response.data.menus || []); // Extract menus array from response
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch menu items";
            console.error("Error fetching menu items:", errorMessage);
            handleError(errorMessage);
        }
    }

    return (
        <div className="menu-page">
            <header>
                <h2>Menu Page</h2>
                <p>Add, delete, update, view all menu items here.</p>
                <br />
            </header>

            <main>
                {
                    mode === "list" &&
                    (
                        <>
                            <button onClick={handleAdd}>ADD</button>

                            {menuItems.length === 0 ? (
                                <p>No menu added yet...!</p>
                            ) : (
                                <DisplayMenu menus={menuItems} open={handleOpen} />
                            )}
                        </>
                    )

                }

                {
                    mode === "form" &&
                    < MenuForm
                        menu={opened}
                        edit={isEditMode()}
                        onEdit={handleEdit}
                        onCancel={handleCancel}
                        onSave={handleSave}
                        onBack={handleBack}
                    />
                }
            </main>
            <ToastContainer/>
        </div>
    );
}

export default MenuPage;