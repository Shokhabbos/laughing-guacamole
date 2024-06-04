import { Link, useParams, useNavigate } from 'react-router-dom';
import './ManageCollection.scss';
import AdminNav from '../../components/adminNav/AdminNav';
import { useEffect, useState } from 'react';
import defImage from '../../assets/images/k1.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { createCollection, deleteItems, getSingleCollection, updateCollection } from '../../redux/features/collectionSlice';
import { ToastContainer } from 'react-toastify';
import { Collection, User } from '../../types/ElementTypes';
import ItemsTable from '../../components/itemTable/ItemTable';
import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ManageCollection = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null | string>(null);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const collection = useSelector((state: RootState) => state.collections.collection) as Collection;
  const user = useSelector((state: RootState) => state.auth.user) as User;
  const [itemIds, setItemIds] = useState<string[]>([]);
  const { t } = useTranslation();
  const currentLang = localStorage.getItem('lang');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const createCol = async (formData: FormData) => {
    await dispatch(createCollection(formData));
    navigate('/'); // Redirect to home after creating the collection
  };

  const updateCol = async (formData: FormData) => {
    if (id) {
      await dispatch(updateCollection([formData, id]));
      navigate('/'); // Redirect to home after updating the collection
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (type === 'edit' && id) {
        await dispatch(getSingleCollection(id));
      } else if (type === 'create') {
        setImage(null);
        setDescription('');
        setName('');
        setTopic('');
      }
    };

    loadData();
    // Cleanup
    return () => {
      setImage(null);
      setDescription('');
      setName('');
      setTopic('');
    };
  }, [type, id, dispatch]);

  useEffect(() => {
    if (type === 'edit' && collection) {
      setImage(collection.image);
      setDescription(collection.description);
      setName(collection.name);
      setTopic(collection.topic);
    }
  }, [collection, type]);

  const handleDelete = () => {
    if (itemIds.length > 0 && collection._id) {
      dispatch(deleteItems([itemIds, collection._id]));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image as File);
    formData.append('description', description);
    formData.append('topic', topic);
    formData.append('user_id', user._id as string);

    if (type === 'create') {
      createCol(formData);
    } else if (type === 'edit') {
      updateCol(formData);
    }
  };

  return (
    collection && (
      <>
        <AdminNav />
        <Container>
          <div className='manage-collection-wrapper'>
            <form className='create-content-wrapper' onSubmit={handleSubmit}>
              <div className="img-input">
                {type === 'create' ? (
                  <img width={500} height={400} src={image ? URL.createObjectURL(image as File) : defImage} alt="" />
                ) : (
                  <img width={500} height={400} src={image as string} alt="" />
                )}
                <input type="file" onChange={handleImageChange} />
              </div>
              <div className='collection-info-inputs'>
                <div className='input-wrapper'>
                  <label htmlFor="collectionName">{t('collection-name') + ':'}</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} type="text" required={true} id="collectionName" />
                </div>
                <div className='input-wrapper'>
                  <label htmlFor="description">{t('description') + ':'}</label>
                  <textarea onChange={(e) => setDescription(e.target.value)} value={description} cols={30} required={true} rows={10} id='description'></textarea>
                </div>
                <div className='input-wrapper'>
                  <label htmlFor="topic">{t('topic') + ':'}</label>
                  <input onChange={(e) => setTopic(e.target.value)} value={topic} required={true} type="text" id="topic" />
                </div>
              </div>
              <button type='submit' className='create-btn'>{type === 'create' ? 'Create' : 'Update'}</button>
            </form>
            {type === 'edit' && (
              <div className='admin-items-wrapper'>
                <h3 className='admin-editItem-title'>{currentLang === 'en' ? `Items of ${collection.name}` : `${collection.name}ning buyumlari`}</h3>
                <div className='actions-wrapper'>
                  <Link to='/dashboard/manage-item/create/'>{t('create')}</Link>
                  <Link to={`/dashboard/manage-item/edit/${itemIds[itemIds.length - 1]}`}>{t('edit')}</Link>
                  <button onClick={handleDelete}>{t('delete')}</button>
                </div>
                <ItemsTable items={collection.items} itemIds={itemIds} setItemIds={setItemIds} />
              </div>
            )}
            <ToastContainer />
          </div>
        </Container>
      </>
    )
  );
};

export default ManageCollection;
