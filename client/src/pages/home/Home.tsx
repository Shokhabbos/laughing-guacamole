import { useEffect, useState } from "react"
import Nav from "../../components/nav/Nav"
import { Container } from "../../utils/Utils"
import './Home.scss'
import { Link } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import { getCollections } from "../../redux/features/collectionSlice"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../redux/store"
import { Collection, Comment, Item, Items } from '../../types/ElementTypes'
import { getItems } from "../../redux/features/itemSlice"
import Footer from "../../components/footer/Footer"
import CollectionC from "../../components/collection/Collection"
import ItemC from "../../components/item/Item"
import { Button } from "@mui/material"

interface HomeProps {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  search:string
}

const Home:React.FC<HomeProps> = ({setSearch,search}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const collections = useSelector((state: RootState) => state.collections.collections) as Collection[];  
  const items = useSelector((state: RootState) => state.items.items) as Items;   
  const [itemStatus, setItemStatus] = useState<boolean>(false)
  const [colStatus, setColStatus] = useState<boolean>(false)
  const keyResult = useSelector((state: RootState) => state.search.keyResult);
  useEffect(()=>{
    dispatch(getCollections())
    dispatch(getItems())
  },[dispatch])
  return (
    items && <>
      <Nav setSearch={setSearch} search={search}/>
      <Container>
        <div className="tag-cloud-wrapper">
          <div className="tag-header">
            <p>{t('search-tags')}</p>
          </div>
          <div className="tags-wrapper">
              {
               items.tags && items.tags.map((tag: string, index: number) => {
                return <Link className="tagName" to={`/search/${tag}`} key={index}>#{tag}</Link>
               })
              }
          </div>
        </div>
        {
          search.length > 0 ? 
          <div className="search-result-section">
            <div className="search-section-title">{t('Items')}</div>
            <div className="search-result-wrapper">
                {keyResult && keyResult.items.length > 0 ? (
                  keyResult.items.map((el: Item) => (
                    <ItemC key={el._id} item={el} />
                  ))
                ) : (
                  <p>{t("no-items")}</p>
                )}
            </div>  
            <div className="search-section-title">{t('Collections')}</div>
            <div className="search-result-wrapper">
                {keyResult && keyResult.collections.length > 0 ? (
                  keyResult.collections.map((el: Collection) => (
                    <CollectionC key={el._id} collection={el} />
                  ))
                ) : (
                  <p>{t('no-collections')}</p>
                )}
            </div>  
            <div className="search-section-title">{t('Comments')}</div>
            <div className="search-result-wrapper">
              {keyResult && keyResult.comments.length > 0 ? (
                keyResult.comments.map((el: Comment) => (
                  <div>
                    <p>{t('Comment')} "{el.text}" {t('at-this')} <Link className="item_link" to={`/singleItem/${el.item_id}`}>Item</Link></p>
                  </div>  
                ))
              ) : (
                <p>{t('no-comments')}</p>
              )}
            </div>  
          </div> :
          <div className="main-content">
            <div className="section-title">
            <h3 className="collection-title">{t('collection-title')}</h3>
            <Button onClick={() => setColStatus(!colStatus)}>{colStatus ? t('hide') : t('see-all-c')}</Button>
            </div>
            <div className="largest-collections-wrapper">
              {
                colStatus ? collections && collections.map((collection:Collection) => {
                  return <CollectionC key={collection._id} collection={collection}/>
                }) : collections && collections.slice(0,5).map((collection:Collection) => {
                  return <CollectionC key={collection._id} collection={collection}/>
                })
              }
            </div>
            <div className="section-title">
            <h3 className="collection-title">{t('item-title')}</h3>
            <Button onClick={() => setItemStatus(!itemStatus)}>{itemStatus ? t('hide') : t('see-all-i')}</Button>
            </div>
            <div className="latest-items-wrapper">
              {
                itemStatus ? (items.result as Item[]).map((item: Item): JSX.Element => {
                  return <ItemC key={item._id} item={item}/>
                }) : (items.result.slice(0, 5) as Item[]).map((item: Item): JSX.Element => {
                  return <ItemC key={item._id} item={item}/>
                })
              }
            </div>
          </div>
        }
      </Container>
      <Footer/>
    </>
  )
}

export default Home
