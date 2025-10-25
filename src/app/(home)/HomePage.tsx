import type { ITweet } from "@/shared/types/tweet.interface";
import HeaderSlider from "./Sections/HeaderSlider";
import BestSallers from "./Sections/BestSallers";
import { PapularCategories } from "./Sections/PapularCategories";
import Brands from "./Sections/Brands";

interface Props {
  tweet: ITweet;
}

export function HomePage({}: Props) {
  return (
    <div>
      <HeaderSlider />
      <BestSallers />
      <PapularCategories />
      <Brands/>
    </div>
  );
}
