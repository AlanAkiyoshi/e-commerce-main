import Login from "@/components/login/login";
import Image from "next/image";
import background from "../../assets/background.jpg";

export default function login() {
  return (
    <main>
      {/* <Image className="background-image" src={background} alt="Background" /> */}
      <Login />
    </main>
  );
}
