import RatingType from "../_types/RatingType";

import './RatingWidget.css';

export default function RatingWidget(
    {
        ratingType,
    }
    :
    {
        ratingType:RatingType,
    }
){
    return (
        <>
            <div className="label">
                {ratingType.label}
            </div>
        </>
    );
}