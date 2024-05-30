import { Link } from 'react-router-dom';
import LangSwitcher from '../langSwitcher/LangSwitcher'
import './ActionController.scss'
const ActionController = () => {
  return (
    <div className='action-controller-wrapper'>
      <h1 className='nav-title'>CollectIT</h1>
      <div>
        <LangSwitcher/>
        <Link to='/'>Home</Link>
      </div>
    </div>
  );
};

export default ActionController;
