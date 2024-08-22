import useApi from "../hooks/useApi";
import config from "../config/config";

class Product{
    searchProducts({search, sortBy, sortType, limit, page}){
        let url = `${config.backendUrl}/product/?search=${search}`

        if(sortBy){
            url+= `&sortBy=${sortBy}`
        }

        if(sortType){
            url+= `&sortType=${sortType}`
        }

        if(limit){
            url+= `&limit=${limit}`
        }

        if(page){
            url+= `&page=${page}`
        }


        const response = useApi(url);

        return response;
    }

    getProductById(productId){
        const response = useApi(`${config.backendUrl}/product/${productId}`)

        return response;
    }

    getAllCategories(){
        const response = useApi(`${config.backendUrl}/category/`);

        return response;
    }

    //Category
    getCategoryById(categoryId, {sortBy, sortType, limit, page}){
        let url = `${config.backendUrl}/category/${categoryId}`;

        const queryStringArray = [];

        if(sortBy){
            queryStringArray.push(`sortBy=${sortBy}`);
        }

        if(sortType){
            queryStringArray.push(`sortType=${sortType}`)
        }

        if(limit){
            queryStringArray.push(`limit=${limit}`)
        }

        if(page){
            queryStringArray.push(`page=${page}`)
        }

        url += `?${queryStringArray.join("&")}`;


        const response = useApi(url);

        return response;

    }

    //Review
    createReview(productId, {content, rating, reviewImages}){
        const response = useApi(`${config.backendUrl}/review/p/${productId}`, "post", {
            content,
            rating,
            reviewImages
        });

        return response;
    }

    updateReview(reviewId, data){
        const response = useApi(`${config.backendUrl}/review/${reviewId}`, "patch", data);

        return response;
    }

    deleteReviewImages(reviewId, idList){
        const response = useApi(`${config.backendUrl}/review/${reviewId}/images`, "delete", {idList});

        return response;
    }

    addReviewImage(reviewId, reviewImages){
        const response = useApi(`${config.backendUrl}/review/${reviewId}/images`, "patch", {
            reviewImages
        });

        return response;
    }

    deleteReview(reviewId){
        const response = useApi(`${config.backendUrl}/review/${reviewId}`, "delete");

        return response;
    }

    getReviewById(reviewId){
        const response = useApi(`${config.backendUrl}/review/${reviewId}`);

        return response;
    }

    getProductReview(productId, {sortBy, sortType, limit, page}){
        const url = `${config.backendUrl}/review/p/${productId}`;

        const queryStringArray = [];

        if(sortBy){
            queryStringArray.push(`sortBy=${sortBy}`);
        }

        if(sortType){
            queryStringArray.push(`sortType=${sortType}`)
        }

        if(limit){
            queryStringArray.push(`limit=${limit}`)
        }

        if(page){
            queryStringArray.push(`page=${page}`)
        }

        url += `?${queryStringArray.join("&")}`;


        const response = useApi(url);

        return response;
    }
}

const product = new Product();

export default product;