import { Container } from '../../utils/Utils'
import { CiSearch } from "react-icons/ci";
import './Nav.scss'
import { Link } from 'react-router-dom';
import LangSwitcher from '../langSwitcher/LangSwitcher';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { searchByKey } from '../../redux/features/searchSlice';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import { logOut } from '../../redux/features/authSlice';
import { Avatar } from '@mui/material';
interface navProps {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  search:string,
}

const Nav:React.FC<navProps> = ({setSearch,search}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const userState = useSelector((state:RootState) => state.auth.token)
  useEffect(() => {   
    dispatch(searchByKey(search))
  },[search])
  return (
    <Container>
        <div className='navbar-wrapper'>
            <h1 className='nav-title'>CollectIT</h1>
              <div className='nav-search-wrapper'>
                  <input type="text" placeholder={t('nav-search-ps')} onChange={(e) => setSearch(e.target.value)}/>
                  <CiSearch className='search-icon'/>
              </div>
              <div className='nav-reg-wrapper'>
                  <LangSwitcher/>
                  {
                    userState ? <Dropdown>
                    <MenuButton className="dashboard-title"><Avatar src="/broken-image.jpg" /></MenuButton>
                    <Menu>
                      <MenuItem><Link to='/dashboard'>My account</Link></MenuItem>
                      <MenuItem onClick={() => dispatch(logOut())}>Logout</MenuItem>
                    </Menu>
                  </Dropdown> : <Link to='/signIn'>{t('nav-login')}</Link>
                  }
              </div>
        </div>
    </Container>
  )
}

export default Nav