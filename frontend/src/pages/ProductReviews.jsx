import React from "react";
import { useParams } from "react-router-dom";
import { ReviewList } from "../components";

function ProductReviews() {
  const { productid } = useParams();

  return (
    <div>
      <ReviewList productid={productid}/>
    </div>
  );
}

export default ProductReviews;
