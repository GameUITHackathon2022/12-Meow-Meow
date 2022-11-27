import QuestionOverview from "../../components/discussion";
import { Axios } from "../../service/axios/config";
import { SideNavBarLayout } from "../../components/layout/sidenavbar";

const questionPage = ({ qAll }) => {
  return (
    <>
      <SideNavBarLayout sideBar={false}>
        <div className="py-5 md:py-16 px-0 md:px-20">
          <QuestionOverview data={qAll} />
        </div>
      </SideNavBarLayout>
    </>
  );
};

export async function getServerSideProps() {
  let data = await Axios.get(`/question/`)
    .then((res) => {
      let data = res.data.data;
      return data;
    })
    .catch(() => {
      return null;
    });
  return {
    props: {
      qAll: data || null,
    },
  };
}

export default questionPage;
