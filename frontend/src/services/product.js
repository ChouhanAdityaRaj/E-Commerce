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



        return {
            urlPath: url,
        };
    }

    getProductById(productId){
        return {
            urlPath: `${config.backendUrl}/product/${productId}`,
        };
    }

    //Category
    getAllCategories(){
        return {
            urlPath: `${config.backendUrl}/category/`,
        };
    }

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

        return {
            urlPath: url,
        };

    }

    //Review
    createReview(productId, {content, rating, reviewImages}){
        return {
            urlPath: `${config.backendUrl}/review/p/${productId}`,
            method: "post",
            data: {content, rating, reviewImages}
        };
    }

    updateReview(reviewId, data){
        return {
            urlPath: `${config.backendUrl}/review/${reviewId}`,
            method: "patch",
            data
        };
    }

    deleteReviewImages(reviewId, idList){
        return {
            urlPath: `${config.backendUrl}/review/${reviewId}/images`,
            method: "delete",
            data: {idList}
        };
    }

    addReviewImage(reviewId, reviewImages){
        return {
            urlPath: `${config.backendUrl}/review/${reviewId}/images`,
            method: "patch",
            data: { reviewImages}
        };
    }

    deleteReview(reviewId){
        return {
            urlPath: `${config.backendUrl}/review/${reviewId}`,
            method: "delete",
        };
    }

    getReviewById(reviewId){
        return {
            urlPath: `${config.backendUrl}/review/${reviewId}`,
        };
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


        return {
            urlPath: url,
        };
    }
}

const product = new Product();

export default product;