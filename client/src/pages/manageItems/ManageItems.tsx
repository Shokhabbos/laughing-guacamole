import { useParams } from "react-router-dom"
import { Container } from "../../utils/Utils"
import AdminNav from "../../components/adminNav/AdminNav"
import defImage from '../../assets/images/k1.jpg';
import { useEffect, useState } from "react";
import './ManageItems.scss'
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { addItem, editItem } from "../../redux/features/collectionSlice";
import { Collection, Item, User } from "../../types/ElementTypes";
import { ToastContainer } from "react-toastify";
import { getSingleItem } from "../../redux/features/itemSlice";
import { useTranslation } from "react-i18next";

const ManageItems = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [image, setImage] = useState<File | null | any>(null);
  const [name, setName] = useState<string>('');
  const [tags, setTags] = useState<string>('')
  const [keyInput, setKeyInput] = useState<string>('');
  const [valueInput, setValueInput] = useState<string>('');
  const [items, setItems] = useState<{ [key: string]: string }[]>([]);
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state:RootState) => state.auth.user) as User
  const collection = useSelector((state:RootState) => state.collections.collection) as Collection
  const item = useSelector((state:RootState) => state.items.item) as Item
  const {t} = useTranslation()

  const handleKeyInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyInput(event.target.value);
  };
  const handleValueInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueInput(event.target.value);
  };
  const handleButtonClick = () => {
    const newItem = { [keyInput]: valueInput };
    setItems([...items, newItem]);
    setKeyInput('');
    setValueInput('');
  };
  const handleRemoveButtonClick = (indexToRemove: number) => {
    const updatedItems = [...items];
    updatedItems.splice(indexToRemove, 1);
    setItems(updatedItems); 
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };
  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);
    formData.append('tags', tags);
    formData.append('user_id', user._id); 
    formData.append('collection_id', collection._id);
    formData.append('additionalInfo', JSON.stringify(items));
    if (type === 'create'){
      dispatch(addItem(formData))
    }
    if (type === 'edit'){
      id && dispatch(editItem([formData, id]))
    }
  }
  useEffect(() => {
    const loadData = async () => {
      if (type === 'edit' && id) {
        await dispatch(getSingleItem(id));
      }
      if (type === 'create') {
        setImage(null);
        setName('');
        setTags('')
      }
    };

    loadData();
  }, []);
  useEffect(() => {
    if (type === 'edit' && item) {
      setImage(item.image);
      setName(item.name);
      setTags(item.tags)
      item.additionalInfo.length > 0 && setItems(JSON.parse(item.additionalInfo))
    }
  }, [item]);

  return (
    <>
      <AdminNav/>
      <Container>
        <div className="manage-item-wrapper">
          <form className="create-content-wrapper" onSubmit={(e) => handleSubmit(e)}>
            <div className="img-input">
              {type === 'create' ? 
                <img width={500} height={400} src={image ? URL.createObjectURL(image) : defImage} alt="" />
                :
                <img width={500} height={400} src={image} alt="" />
              }
              <input type="file" onChange={handleImageChange} />
            </div>
            <div className='collection-info-inputs'>
              <div className='input-wrapper'>
                <label htmlFor="collectionName">{t('item-name')+':'}</label>
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" required={true} id="collectionName" />
              </div>
              <div className='input-wrapper'>
                <label htmlFor="topic">{t('tags')+':'}</label>
                <p style={{color:'#d50000'}}>{t('tags-info')}</p>
                <input onChange={(e) => setTags(e.target.value)} value={tags} required={true} type="text" id="topic" />
              </div>
              <div>
                <div className="additional-inputs">
                  <input
                    type="text"
                    value={keyInput}
                    onChange={handleKeyInputChange}
                    placeholder={t('enter-key')}
                  />
                  <input
                    type="text"
                    value={valueInput}
                    onChange={handleValueInputChange}
                    placeholder={t('enter-value')}
                    className=""
                  />
                  <button type="button" className="addInput-btn" onClick={handleButtonClick}>{t('add')}</button>
                </div>
                {
                  items.map((item, index) => (
                    <div className="additional-info" key={index}>
                      {
                        Object.entries(item).map(([key, value]) => (
                          <p key={key}>{`${key}:${value}`}</p>
                        ))
                      } 
                      <button type="button" className="addInput-btn" onClick={() => handleRemoveButtonClick(index)}>{t('delete')}</button>
                    </div>
                  ))
                }
              </div>
              <button style={{width:"100%"}} className="addInput-btn">{type === 'edit' ? t('edit-item') : t('add-item')}</button>
            </div>
          </form>
        </div>
        <ToastContainer/>
      </Container>
    </>
  )
}

export default ManageItems