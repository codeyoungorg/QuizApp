import Image from "next/image";


// Create a reusable Icon component
const Icon = ({ src, alt }: { src: string; alt: string }) => (
  <Image 
  src={`/images/icons/${src}.svg`}
    alt={alt} 
    width={24} 
    height={24} 
    className="inline-block"
  />
);

export const Icons = {
  burger: <Icon src="burger" alt="Burger" />,
  coin: <Icon src="coin" alt="Coin" />,
  greetings: <Icon src="greetings" alt="Greetings" />,
  school: <Icon src="school" alt="School" />,
  numbers: <Icon src="numbers" alt="Numbers" />,  
  makefriends: <Icon src="make-friends" alt="Make Friends" />,

};