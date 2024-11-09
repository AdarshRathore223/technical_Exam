import Image from "next/image";
import bg from "@/app/assets/bg.jpg";

function Page() {
  return <div className="w-full h-full relative flex justify-center items-center">
    <h1 className="text-3xl font-extrabold font-serif">Home Page</h1>
    <Image src={bg} alt="Background" layout="responsive" className="opacity-20 absolute w-full"/>
  </div>;
}

export default Page;
