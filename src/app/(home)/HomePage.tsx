import type { ITweet } from "@/shared/types/tweet.interface";
import HeaderSlider from "./Sections/HeaderSlider";

interface Props {
    tweet: ITweet;
}

export function HomePage({}: Props){
    return (
        <div>
            <HeaderSlider/>
        </div>
    );
}