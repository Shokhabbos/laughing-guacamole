  import { useParams } from 'react-router-dom'
  import { Container } from '../../utils/Utils'
  import './SingleCol.scss'
  import { useEffect } from 'react'
  import { useDispatch, useSelector } from 'react-redux'
  import { AppDispatch, RootState } from '../../redux/store'
  import { getSingleCollection } from '../../redux/features/collectionSlice'
  import { Collection } from '../../types/ElementTypes'
  import ItemC from '../../components/item/Item'
  import ActionController from '../../components/actionController/ActionController'
import { useTranslation } from 'react-i18next'
  const SingleCol = () => {
    const {id} = useParams()
    const {t} = useTranslation()
    const dispatch = useDispatch<AppDispatch>()
    const collection = useSelector((state:RootState) => state.collections.collection) as Collection
    useEffect(() => {
    id && dispatch(getSingleCollection(id))
    },[id])
    console.log(collection)
    return (
      collection && <Container>
          <ActionController/>
          <div className='single-col-wrapper'>
              <img className='single-col-image' src={collection.image} alt="" />
              <div className='single-col-info'>
                  <p>{t('name')}: {collection.name}</p>
                  <p>{t('topic')}: {collection.topic}</p>
                  <p>{t('description')}:<br/>{collection.discreption}</p>
                  <p>{t('items-count')}: {collection.items.length}</p>
              </div>
          </div>
          <div className='single-col-items'>
            {
              collection.items.map((item:any) => {
                return <ItemC key={item._id} item={item}/>
              })
            }
          </div>
      </Container>
    )
}
export default SingleCol