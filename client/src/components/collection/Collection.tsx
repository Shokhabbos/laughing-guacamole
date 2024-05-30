import { Collection } from "../../types/ElementTypes";
import { useTranslation } from "react-i18next";
import './Collections.scss';
import { Link } from "react-router-dom";

const CollectionC = ({collection}:{collection:Collection}) => {
  const { t } = useTranslation();
  return (
    <div className="collections-all-wrapper">
      <div className="collection-wrapper" key={collection._id}>
        <img className="item-image" width={400} height={300} src={collection.image} alt="" />
        <div className="collection-info">
          <Link to={`/singleCol/${collection._id}`}>View collection</Link>
        </div>
        <div className="collection-info-wrapper">
          <p>{collection.name}</p>
          <p>{collection.items.length}{collection.items.length > 1 ? ' ' + t('items') : ' ' + t('item')}</p>
        </div>
      </div>
      <div className="collection-cover"></div>
    </div>
  );
};

export default CollectionC;
