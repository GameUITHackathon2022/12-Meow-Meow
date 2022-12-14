import React, { Component, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import CommentBox from '../CommentBox'
import Detail from '../Detail'
import IntlMessages from '../../../service/react-intl/IntlMessages'
import { loggedIn } from'../../../service/auth/index'
import { Axios } from '../../../service/axios/config'

const Comment = ({ qDetail, qAnswer }) => {
    const authUser = loggedIn();
    const [comments, setComments] = useState(qAnswer)
    const update = (qDetail) => {
        Axios
            .get(`/question/${qDetail._id}/reply`)
            .then(({ data }) => {
                setComments(data.data)
                toast.success(<IntlMessages id="noti.answer.addSuccess"/>)
            })
            .catch(() => {
                console.log(null)
            }
            )
    }
    return (
        <>
            <div className="container a-content-container">
                <h3 className="text-xl mb-5">{comments.length} {(comments.length > 1) ? <IntlMessages id="questions.answers" /> : <IntlMessages id="questions.answer" />}</h3>
                {comments.map((comment) => (
                    <>
                        <Detail user={comment.userID} detail={comment.content} voteIndex={comment.numUpVote - comment.numDownVote} time={comment.dateCreated} question={false} questionId={qDetail._id} id={comment._id} />
                        <div className="divider my-1"></div>
                    </>
                )
                )}
            </div>
            {authUser ? <CommentBox questionId={qDetail._id} updateComment={() => update(qDetail)} /> : <></>}
        </>
    )
}

export default Comment
