import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { Collection, User } from "../../types/ElementTypes";
import './Dashboard.scss';
import { Link, Outlet } from "react-router-dom";
import AdminNav from "../../components/adminNav/AdminNav";
import AdminTable from "../../components/adminTable/AdminTable";
import { deleteCollections } from "../../redux/features/collectionSlice";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user) as User;
  const allCollections = useSelector((state: RootState) => state.collections.collections) as Collection[];
  const [collections, setCollections] = useState<Collection[]>([]);
  const dispatch = useDispatch<AppDispatch>()
  const [collectionIds, setCollectionIds] = useState<string[]>([]);
  const {t} = useTranslation()
  useEffect(() => {
    if (user?.role === 'admin') {
      setCollections(allCollections);
    } else {
      setCollections(user?.collections || []);
    }
  }, [user, allCollections]);

  function handleDelete(){
    dispatch(deleteCollections([collectionIds,user._id]))
  }
  return (
    <div>
      <AdminNav />
      <div className="dashboard-wrapper">
        <div className="actions-wrapper">
          <Link to={`manage-collection/create/${user._id}`}>{t('create')}</Link>
          <Link to={`manage-collection/edit/${collectionIds[collectionIds.length-1]}`}>{t('edit')}</Link>
          <button onClick={() => handleDelete()}>{t('delete')}</button>
        </div>
        <AdminTable collections={collections} collectionIds={collectionIds} setCollectionIds={setCollectionIds} />
        <Outlet/>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Dashboard;
