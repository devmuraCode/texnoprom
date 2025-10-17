import type { ITweet } from "@/shared/types/tweet.interface";
import HeaderSlider from "./Sections/HeaderSlider";
import BestSallers from "./Sections/BestSallers";

interface Props {
    tweet: ITweet;
}

export function HomePage({}: Props){
    return (
        <div>
            <HeaderSlider/>
            <BestSallers/>
        </div>
    );
}