import React, { useState, useEffect, Component } from 'react'
import IntlMessages from '../../service/react-intl/IntlMessages'
import 'react-quill/dist/quill.snow.css'
import 'highlight.js/styles/base16/solarized-light.css'
import Detail from './Detail'
import { loggedIn } from'../../service/auth/index'
import Comment from './Comment'
import { getAirQuality } from '../../service/open-meteo'
import MultiLineChart from '../chart/multiline'
import { date2local, getLocalStorage } from '../../service/open-meteo'



function QuestionDetail(props) {
    // const [qDetail, setQDetail] = useState()
    // const questionId = getQid()
    // useEffect(() => {
    //     Axios
    //         .get(`/question/${questionId}/detail`)
    //         .then(({ data }) => {
    //             setQDetail(data.data)
    //         })
    //         .catch(() => {
    //             console.log(null)
    //         }
    //         )
    // })

    const qDetail = props.data
    const location = (qDetail.location).split(",")
    const [openChart, setOpenChart] = useState(false)
    let chartData = {}
    async function getAirQualityData(){
        try {
            // setOpenChart(false)
            var param = new URLSearchParams({
                latitude: location[0],
                longitude: location[1],
                start_date:qDetail.dateStarted,
                end_date: qDetail.dateEnded,
            });
            param = param.toString();
            param = "?" + param + "&hourly=pm2_5,carbon_monoxide,uv_index";
            chartData = await getAirQuality(param);
            setOpenChart(true)
        }
        catch {
            return null
        }
    }
    useEffect(() => {
        getAirQualityData()// Update the document title using the browser API
      });
    
    const qAnswer = props.answer
    const authUser = loggedIn();
    return (
        <>
            <div className="container q-title-container">
                <div className="flex flex-nowrap gap-5">
                    <div className="grid grid-rows-1 gap-1">
                        <h2 className="text-3xl">{qDetail.title}</h2>
                        
                    </div>
                </div>
            </div>
            <div className="divider my-1"></div>
            <div className="container q-content-container">
                <Detail user={qDetail.userID} detail={qDetail.content} voteIndex={qDetail.numUpVote - qDetail.numDownVote} time={qDetail.dateCreated} question={true}  id={qDetail._id} questionId={qDetail._id}/>
                { openChart && <MultiLineChart value={chartData}/> }
            </div>
            <div className="divider my-1"></div>
            <Comment qDetail={qDetail} qAnswer={qAnswer}/>
        </>
        // : <>
        //     <PageLoader />
        // </>
    )
}

export default QuestionDetail;

