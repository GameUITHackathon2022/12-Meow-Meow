import Image from 'next/image';

import ErrorCat from '../../public/asset/error_cat.svg';

export default function ErrorPage({ title, message, code = "???" }) {
  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center">
      <div className="container grid grid-cols-1 md:grid-cols-2 items-center justify-center px-5 text-gray-700 mx-auto">
        <div className="max-w-lg mx-auto md:mr-0">
            <Image src={ErrorCat} alt="img_error_page"/>
        </div>
        <div className="max-w-sm md:ml-10">
          <div className="text-5xl font-dark font-bold">{code}</div>
          <p className="text-2xl md:text-3xl leading-normal">
            {title}{" "}
          </p>
          <p className="text-xl mb-8">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
