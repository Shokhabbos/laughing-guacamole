import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { Link, useParams } from "react-router-dom";
import { searchByTag } from "../../redux/features/searchSlice";
import { Container } from "../../utils/Utils";
import "./SearchRpage.scss";
import ItemC from "../../components/item/Item";
import { Collection, Comment, Item } from "../../types/ElementTypes";
import Nav from "../../components/nav/Nav";
import CollectionC from "../../components/collection/Collection";
import { useTranslation } from "react-i18next";

interface SearchRProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const SearchRpage: React.FC<SearchRProps> = ({search,setSearch}) => {
  const tagResult = useSelector((state: RootState) => state.search.tagResult);
  const keyResult = useSelector((state: RootState) => state.search.keyResult);
  const dispatch = useDispatch<AppDispatch>();
  const { tag } = useParams<{ tag?: string }>();
  const { t } = useTranslation()
  useEffect(() => {
    if (tag) {
      dispatch(searchByTag(tag));
    }
  }, [tag, dispatch]);
  console.log(keyResult)
  return (
    <Container>
      <Nav setSearch={setSearch} search={search} />
      <p className="search-result-title">{t('search-results')}</p>
      <div className="search-result-section">
        <div className="search-section-title">{t('items-by-tag')}</div>
        <div className="search-result-wrapper">
          {tagResult && tagResult.length > 0 ? (
            tagResult.map((el: Item) => (
              <ItemC key={el._id} item={el} />
            ))
          ) : (
            <p>{t('no-items')}</p>
          )}
        </div>
      </div>
      {
        search.length > 0 &&
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
        </div>
      }
    </Container>
  );
};

export default SearchRpage;
