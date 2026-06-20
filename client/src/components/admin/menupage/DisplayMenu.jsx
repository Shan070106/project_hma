import './DisplayMenu.css';

function MenuBox({ menuId, menu, open, selected, onSelectMenu, onDeleteMenu, deleting }) {
    return (
        <tr key={menuId}>
            <td className="td selection-cell">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={(event) => onSelectMenu(menuId, event.target.checked)}
                    disabled={deleting}
                    aria-label={`Select ${menu.name}`}
                />
            </td>
            <td className="td">
                {menu?.image && <img src={menu.image?.url} alt="Dish image" />}
            </td>
            <td className="td"> <p>{menu.name}</p></td>
            <td className="td"><p>{menu.amount}</p></td>
            <td className="td"><p>{menu.avail?"yes":"no"}</p></td>
            <td className="action-cell">
                <button className="menu-box" onClick={()=>(open(menu))}> open </button>
                <button
                    className="menu-box delete-menu-box"
                    onClick={() => onDeleteMenu(menu)}
                    disabled={deleting}
                >
                    Delete
                </button>
            </td>
        </tr>
    );
}


function DisplayMenu({
    menus,
    open,
    selectedMenuIds,
    onSelectMenu,
    onSelectAll,
    onDeleteMenu,
    deleting
}) {
    const visibleMenuIds = menus.map((menuItem) => menuItem._id || menuItem.id).filter(Boolean);
    const allSelected = visibleMenuIds.length > 0 && visibleMenuIds.every((menuId) => selectedMenuIds.includes(menuId));

    const MenuList = menus.map(menuItem => {
        const menuId = menuItem._id || menuItem.id;

        return < MenuBox 
            key={menuId}
            menuId={menuId}
            menu={menuItem}
            open={open}
            selected={selectedMenuIds.includes(menuId)}
            onSelectMenu={onSelectMenu}
            onDeleteMenu={onDeleteMenu}
            deleting={deleting}
        />
    });

    return (
        <>
        <table>
        <caption>Displaying menu</caption>
        
        <thead>
            <tr>
                <th className="th selection-cell">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(event) => onSelectAll(event.target.checked)}
                        disabled={deleting || visibleMenuIds.length === 0}
                        aria-label="Select all menu items"
                    />
                </th>
                <th className="th">Image</th>
                <th className="th">Name</th>
                <th className="th">Price</th>
                <th className="th">Availability</th>
                <th className="th">Actions</th>
            </tr>
        </thead>

        <tbody>
                  {MenuList}
        </tbody>

        </table>
        </>
    );
}

export default DisplayMenu;
