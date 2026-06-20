import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "../../assets/styles/MenuPage.css";
import MenuForm from "../../components/admin/menupage/MenuForm";
import DisplayMenu from "../../components/admin/menupage/DisplayMenu";
import {
    createMenuItem,
    deleteMenuItem,
    deleteMultipleMenuItems,
    getMenuItems,
    updateMenuItem
} from "../../services/menuService";

function MenuPage() {
    const [mode, setMode] = useState("list"); // mode : list | form 
    const [opened, setOpened] = useState(null);
    const [editable, setEditable] = useState(false);
    const [menuItems,setMenuItem] = useState([]);
    const [selectedMenuIds, setSelectedMenuIds] = useState([]);
    const [deleting, setDeleting] = useState(false);

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

    const visibleMenuIds = menuItems.map(getMenuId).filter(Boolean);

    const clearDeletedMenuItems = (deletedIds) => {
        const deletedIdSet = new Set(deletedIds);
        setMenuItem((currentItems) =>
            currentItems.filter((menuItem) => !deletedIdSet.has(getMenuId(menuItem)))
        );
        setSelectedMenuIds((currentIds) =>
            currentIds.filter((menuId) => !deletedIdSet.has(menuId))
        );
    }

    const handleSave = async (menuData) => {
        try {
            if (opened) {
                const menuId = getMenuId(opened);
                if (!menuId) {
                    throw new Error("Selected menu id is missing");
                }

                // Update existing menu
                const response = await updateMenuItem(menuId, menuData);
                setOpened(response.data.menu || opened);
                setEditable(false);
                handleSuccess("Menu updated successfully");
            } else {
                // Create new menu
                await createMenuItem(menuData);
                handleSuccess("Menu created successfully");
                handleBack();
                return;
            }
            
            fetchMenuItems(); // Refresh menu list after save
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
            const response = await getMenuItems();
            setMenuItem(response.data.menus || []); // Extract menus array from response
            setSelectedMenuIds([]);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch menu items";
            console.error("Error fetching menu items:", errorMessage);
            handleError(errorMessage);
        }
    }

    const handleSelectionChange = (menuId, checked) => {
        setSelectedMenuIds((currentIds) => {
            if (checked) {
                return currentIds.includes(menuId) ? currentIds : [...currentIds, menuId];
            }

            return currentIds.filter((currentId) => currentId !== menuId);
        });
    }

    const handleSelectAllChange = (checked) => {
        setSelectedMenuIds(checked ? visibleMenuIds : []);
    }

    const handleDeleteMenuItem = async (menu) => {
        const menuId = getMenuId(menu);
        if (!menuId) {
            handleError("Selected menu id is missing");
            return;
        }

        const confirmed = window.confirm(`Delete '${menu.name}'? This action cannot be undone.`);
        if (!confirmed) return;

        setDeleting(true);
        try {
            await deleteMenuItem(menuId);
            clearDeletedMenuItems([menuId]);
            handleSuccess("Menu item deleted successfully");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to delete menu item";
            console.error("Error deleting menu item:", errorMessage);
            handleError(errorMessage);
        } finally {
            setDeleting(false);
        }
    }

    const handleDeleteSelected = async () => {
        if (selectedMenuIds.length === 0) return;

        const confirmed = window.confirm(`Delete ${selectedMenuIds.length} selected items?`);
        if (!confirmed) return;

        setDeleting(true);
        try {
            await deleteMultipleMenuItems(selectedMenuIds);
            clearDeletedMenuItems(selectedMenuIds);
            handleSuccess("Selected menu items deleted successfully");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to delete selected menu items";
            console.error("Error deleting selected menu items:", errorMessage);
            handleError(errorMessage);
        } finally {
            setDeleting(false);
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
                                <>
                                    {selectedMenuIds.length > 0 && (
                                        <div className="menu-bulk-actions">
                                            <button
                                                type="button"
                                                onClick={handleDeleteSelected}
                                                disabled={deleting}
                                            >
                                                {deleting ? "Deleting..." : "Delete Selected"}
                                            </button>
                                        </div>
                                    )}

                                    <DisplayMenu
                                        menus={menuItems}
                                        open={handleOpen}
                                        selectedMenuIds={selectedMenuIds}
                                        onSelectMenu={handleSelectionChange}
                                        onSelectAll={handleSelectAllChange}
                                        onDeleteMenu={handleDeleteMenuItem}
                                        deleting={deleting}
                                    />
                                </>
                            )}
                        </>
                    )

                }

                {
                    mode === "form" &&
                    < MenuForm
                        key={`${getMenuId(opened) || "new-menu"}-${editable ? "edit" : "view"}`}
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
