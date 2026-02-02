import './DisplayMenu.css';

function MenuBox({menu,open}) {
    return (
        <tr>
            <td className="td">
                {menu?.image && <img src={menu.image?.url} alt="Dish image" />}
            </td>
            <td className="td"> <p>{menu.name}</p></td>
            <td className="td"><p>{menu.amount}</p></td>
            <td className="td"><p>{menu.avail?"yes":"no"}</p></td>
            <td>
                <button className="menu-box" onClick={()=>(open(menu))}> open </button>
            </td>
        </tr>
    );
}


function DisplayMenu({ menus,open }) {
    const MenuList = menus.map(menuItem => {
        return < MenuBox 
            key={menuItem.id || menuItem.name}
            menu={menuItem}
            open={open}
        />
    });

    return (
        <>
        <table>
        <caption>Displaying menu</caption>
        
        <thead>
            <tr>
                <th className="th">Image</th>
                <th className="th">Name</th>
                <th className="th">Price</th>
                <th className="th">Availability</th>
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