import { useState } from "react";

import "../../assets/styles/MenuPage.css";
import MenuSample from "../../sample data/MenuSample";
import MenuForm from "../../components/admin/menupage/MenuForm";
import DisplayMenu from "../../components/admin/menupage/DisplayMenu";

function MenuPage() {
    const [mode, setMode] = useState("list"); // mode : list | form 
    const [opened, setOpened] = useState(null);
    const [editable, setEdit] = useState(false);

    // menuList fectched from server side later...
    const menuList = MenuSample;
    // const menuList = [];

    const handleAdd = () => {
        setOpened(null);
        setMode("form");
        setEdit(true);
    }

    const handleOpen = (menu) => {
        setMode("form");
        setEdit(false);
        setOpened(menu);
    }

    const handleSave = (menuData) => {
        menuData.forEach((key,value) => {
            console.log(key, value);
        });

        setEdit(false);
        // setMode("list");
        // setOpened(null);
    }

    const handleEdit = () => {
        setEdit(true);
    }

    const handleCancel = () => {
        setOpened(null);
        setMode("list");
        setEdit(false);
    }

    const onBack = () => {
        setMode("list");
        setOpened(null);
        setEdit(false);
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

                            {menuList.length === 0 ? (
                                <p>No menu added yet...!</p>
                            ) : (
                                <DisplayMenu menus={menuList} open={handleOpen} />
                            )}
                        </>
                    )

                }

                {
                    mode === "form" &&
                    < MenuForm
                        menu={opened}
                        edit={editable}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onEdit={handleEdit}
                        onBack={onBack}
                    />
                }
            </main>
        </div>
    );
}

export default MenuPage;