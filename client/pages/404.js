import ErrorPage from "../components/error/ErrorPage";

export default function Custom404() {
    return <ErrorPage code={404} title="Not Found" message="Vui lòng kiểm tra lại đường dẫn và thử lại!"/>
  }