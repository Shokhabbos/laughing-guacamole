import LangSwitcher from "../langSwitcher/LangSwitcher"
import { Link } from "react-router-dom"
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { logOut } from "../../redux/features/authSlice";
import './AdminNav.scss'
import { useTranslation } from "react-i18next";
const AdminNav = () => {
    const {t} = useTranslation()
    const dispatch = useDispatch<AppDispatch>()
    const user = useSelector((state:RootState) => state.auth.user)
    return (
    <div>
        <div className="admin-nav-wrapper">
            <h2>Dashboard</h2>
            <div className="admin-nav-actions">
                {
                user?.role === 'admin' && <Link className="users-link" to='/dashboard/user-management'>{t('user-management')}</Link> 
                }
                <LangSwitcher/>
                <Dropdown>
                    <MenuButton className="dashboard-title"><Avatar src="/broken-image.jpg" /></MenuButton>
                    <Menu>
                      <MenuItem><Link to='/'>{t('home')}</Link></MenuItem>
                      <MenuItem onClick={() => dispatch(logOut())}>{t('log-out')}</MenuItem>
                    </Menu>
                </Dropdown>
            </div>
        </div>
    </div>
  )
}

export default AdminNav