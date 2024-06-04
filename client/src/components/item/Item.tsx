import { Link } from "react-router-dom"
import { Item } from "../../types/ElementTypes"
import { useTranslation } from "react-i18next"
import './Item.scss'
const ItemC = ({item}:{item:Item}) => {
  const { t } = useTranslation()
  return (
    <div className="collection-wrapper" key={item._id}>
      <img  className="item-image" src={item.image} alt="" />
      <div className="collection-info">
        <Link to={`/singleItem/${item._id}`}>{t("view-item")}</Link>
      </div>
      <div className="collection-info-wrapper">
        <p>{item.name}</p>
        <p>
          {item.comments.length} {item.comments.length > 1 ? ' ' + t('comments') : ' ' + t('comment')}
        </p>
      </div>
      <p>
        {item.likes.length} {item.likes.length > 1 ? ' ' + t('likes') : ' ' + t('like')}
      </p>
    </div>
  )
}

export default ItemC