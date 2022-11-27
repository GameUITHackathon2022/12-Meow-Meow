
import QuestionDetail from '../../components/QuestionDetail'
import { Axios } from '../../service/axios/config'
import ErrorPage from '../../components/error/ErrorPage'
import Head from "next/head"
import { SideNavBarLayout } from "../../components/layout/sidenavbar";
import GetTranslateText from '../../service/react-intl/getTranslateText';

const questionDetailPage = ({ qDetail, qReply }) => {
    const { convert } = require('html-to-text');
    const content = convert(qDetail.content, {
        selectors: [ { selector: 'img', format: 'skip' } ]
    })
    return (
        <>
            {(qDetail !== undefined && qDetail !== null) ?
                <>
                    <Head>
                        <title>{GetTranslateText("app.name")} - {qDetail.title}</title>
                        <meta name="description" content={content}/>
                    </Head>
                </>
                :
                <></>}
                {(qDetail === undefined || qDetail === null) ? <ErrorPage code="404" /> : <SideNavBarLayout><div className="py-5 md:py-16 px-0 md:px-20"><QuestionDetail data={qDetail} answer={qReply}/></div></SideNavBarLayout>}
        </>
    )
}

// export async function getStaticPaths() {
//     let data = await Axios
//         .get(`/question/`)
//         .then(res => {
//             let data = res.data.data
//             return data
//         })
//         .catch(() => {
//             return []
//         }
//         )
//     const paths = data.map(question => ({
//         params: { qid: question._id },
//     }));
//     return {
//         paths,
//         fallback: 'blocking' // false or 'blocking'
//     };
// }

export async function getServerSideProps({ params }) {
    let data = await Axios
        .get(`/question/`)
        .then(res => {
            let data = res.data.data
            return data
        })
        .catch(() => {
            return null
        }
        )
    let qDetail = data.find(question => question._id === params.qid);
    let qReply = await Axios
        .get(`/question/${params.qid}/reply/`)
        .then(res => {
            let data = res.data.data
            return data
        })
        .catch(() => {
            return null
        }
        )
    return {
        props: { 
            qDetail: qDetail || null,
            qReply: qReply || null
        }
    }
}

export default questionDetailPage;