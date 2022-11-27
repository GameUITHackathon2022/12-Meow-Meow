import React, { useState } from "react";
import { useAuth } from "../../../service/auth/index";
import { toast } from "react-hot-toast";
import IntlMessages from "../../../service/react-intl/IntlMessages";
import { Axios } from "../../../service/axios/config";
import { BiLike } from "react-icons/bi";

const Vote = ({ questionId, voteIndex, question, id }) => {
  // console.log(questionId)
  const [vote, setVote] = useState(voteIndex);
  const { authUser } = useAuth();

  const upVote = async () => {
    if (authUser) {
      if (question) {
        let res = await Axios.post(`/question/${questionId}/up-vote/`)
          .then(({ data }) => {
            if (data.statusCode == 200) setVote(data.data);
            else toast.error(<IntlMessages id="noti.vote.error.upvoted" />);
          })
          .catch((error) => {
            toast.error(<IntlMessages id="noti.vote.error.upvoted" />);
          });
      } else {
        let res = await Axios.post(`/question/reply/${id}/up-vote`)
          .then(({ data }) => {
            if (data.statusCode == 200) setVote(data.data);
            else toast.error(<IntlMessages id="noti.vote.error.upvoted" />);
          })
          .catch((error) => {
            toast.error(<IntlMessages id="noti.vote.error.upvoted" />);
          });
      }
    } else {
      toast.error(<IntlMessages id="noti.signin.required" />);
    }
  };

  const downVote = async () => {
    if (authUser) {
      if (question) {
        let res = await Axios.post(`/question/${questionId}/down-vote`)
          .then(({ data }) => {
            if (data.statusCode == 200) setVote(data.data);
            else toast.error(<IntlMessages id="noti.vote.error.downvoted" />);
          })
          .catch((error) => {
            toast.error(<IntlMessages id="noti.vote.error.upvoted" />);
          });
      } else {
        let res = await Axios.post(`/question/reply/${id}/down-vote`)
          .then(({ data }) => {
            if (data.statusCode == 200) setVote(data.data);
            else toast.error(<IntlMessages id="noti.vote.error.downvoted" />);
          })
          .catch((error) => {
            toast.error(<IntlMessages id="noti.vote.error.upvoted" />);
          });
      }
    } else {
      toast.error(<IntlMessages id="noti.signin.required" />);
    }
  };

  return (
    <div className="flex m-vote items-center">
      <BiLike className="text-2xl text-gray-400" onClick={upVote}/>
      <p className="text-2xl text-gray-400">{vote}</p>
    </div>
  );
};

export default Vote;
