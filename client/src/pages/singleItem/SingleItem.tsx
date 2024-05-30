import { Container } from '@mui/material'
import './SingleItem.scss'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { addComment, getSingleItem, unLike } from '../../redux/features/itemSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { Item, User } from '../../types/ElementTypes'
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { doLike } from '../../redux/features/itemSlice'
import Avatar from '@mui/joy/Avatar';
import { IoSend } from "react-icons/io5";
import ActionController from '../../components/actionController/ActionController'
import { useTranslation } from 'react-i18next'
const SingleItem = () => {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const item = useSelector((state:RootState) => state.items.item) as Item
  const user = useSelector((state:RootState) => state.auth.user) as User
  const [comment, setComment] = useState<string>('')
  const {t} = useTranslation()
  useEffect(() => {
    dispatch(getSingleItem(id))
  },[])
  function addLike(){
    dispatch(doLike({ item_id: id, id: user._id }));
  }
  function rmLike(){
    dispatch(unLike({ item_id: id, id: user._id }));
  }
  function writeComment(){
    setComment("")
    id && dispatch(addComment({
      data: {
        name: user.name,
        text: comment,
        item_id: id
    }
    }));
  }
  return (
    item && <Container>
        <ActionController/>
        <div className='single-item-wrapper'>
          <img src={item.image} alt="" />
          <div className='single-item-info'>
              <p>{t('name')}: {item.name}</p>
              <div className='single-item-tags'>
                <p>{t('tags')}:</p>
                {
                  item.tags.split("#").slice(1,item.tags.split('#').length).map((tag:string,index:number) => {
                    return <Link key={index} className='tagName' to={`/search/${tag}`}>#{tag}</Link>
                  })
                }
              </div>
              <div className='single-item-like'>
               {
                 user ? <>{item.likes.includes(user._id) ? <FaHeart className='like-btn' onClick={() => rmLike()}/> : <FaRegHeart className='unlike-btn' onClick={() => addLike()}/>}
                 <p>{item.likes.length} {item.likes.length > 1 ? t('likes') : t('like')}</p></>:<p>{item.likes.length} {item.likes.length > 1 ? t('likes') : t('like')}</p>
               }
              </div>
              <div className='single-item-add-info'>
                {
                 item.additionalInfo.length > 0 && JSON.parse(item.additionalInfo).map((item:string, index:number) => (
                    Object.entries(item).map(([key, value]) => (
                      <p key={index}>{`${key}: ${value}`}</p>
                    ))
                  ))
                }
              </div>
          </div>
        </div>
        {
          user && <div className='write-comment-wrapper'>
              <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} className='comment-input' placeholder={t('write-comment')}/>
              <IoSend className='send-btn' onClick={() => writeComment()}/>
          </div>
        }
        <div className='single-item-comments'>
            <div className='comments-header'>
              <p>{t('Comments')}</p>
              <p>{item.comments.length} {item.comments.length > 1 ? t('comments') : t("comment")}</p>
            </div>
            <div className='comments-wrapper'>
              {
                item.comments.length > 0 ? item.comments.map((comment,index) => {
                  return <div key={index} className='comment'>
                    <div className='user-info'>
                      <Avatar>{comment.name[0]}</Avatar>
                      <strong className='user-name'>{comment.name}</strong>
                    </div>
                    <p className='user-comment'>{comment.text}</p>
                  </div> 
                }) : <p>No Comments</p>
              }
            </div>
        </div>
    </Container>
  )
}

export default SingleItem