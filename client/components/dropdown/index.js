import Link from "next/link";
import IntlMessages from "../../service/react-intl/IntlMessages";

export default function Dropdown({ data }) {
  return (
    <div className="absolute top-12 container p-2 shadow rounded-md text-sm font-semibold w-fit">
      {data.map((value, index) => {
        if (value.type == "link")
          return <Link key={value.id} href={value.src}><IntlMessages id={value.label}/></Link>;
      })}
    </div>
  );
}
