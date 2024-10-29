import config  from "../config/config";

class AdminService {


    //Admin User Services
    verifyAdmin(){
        return {
            urlPath: `${config.backendUrl}/admin/verify-admin`
        }
    }

    getAllUsers({search, sortBy, sortType, limit, page}){
        let url = `${config.backendUrl}/admin/user`;

        const queryStringArray = [];

        if(search){
            queryStringArray.push(`search=${search}`);
        }

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

    // Admin Product Services
    addNewProduct(data){
        return {
            urlPath: `${config.backendUrl}/admin/product`,
            method: "post",
            data,
            isFormData: true
        };
    }
    
    deleteProductById(productid){
        return {
            urlPath: `${config.backendUrl}/admin/product/${productid}`,
            method: "delete",
        };
    }

    updateProductDetails(productid, {productName, description, price}){
        return {
            urlPath: `${config.backendUrl}/admin/product/${productid}/details`,
            method: "patch",
            data: {productName, description, price},
        };
    }

    updateProductImage(productid, data){
        return {
            urlPath: `${config.backendUrl}/admin/product/${productid}/image`,
            method: "patch",
            data,
            isFormData: true
        };
    }

    deleteProductOtherImage(productid, idList){
        return {
            urlPath: `${config.backendUrl}/admin/product/${productid}/other-image/delete`,
            method: "patch",
            data: {idList}
        };
    }

    addProductOtherImage(productid, data){
        return {
            urlPath: `${config.backendUrl}/admin/product/${productid}/other-image`,
            method: "patch",
            data,
            isFormData: true
        };
    }

    updateProductStocks(productid, stocks){
        return {
            urlPath: `${config.backendUrl}/admin/product/${productid}/stock`,
            method: "patch",
            data: {stocks} 
        };
    }

    updateProductCategory(productid, categoryid, data={}){
        return {
            urlPath: `${config.backendUrl}/admin/product/${productid}/category/${categoryid}`,
            method: "patch",
            data,
        };
    }

    updateProductsDiscount(productid, {discount}){
        return {
            urlPath: `${config.backendUrl}/admin/product/${productid}/discount`,
            method: "patch",
            data: {discount},
        };
    }

    removeProductsDiscount(productid){
        return {
            urlPath: `${config.backendUrl}/admin/product/${productid}/discount`,
            method: "delete",
        };
    }

    // Admin Categories Services
    createCategory(data){
        return {
            urlPath: `${config.backendUrl}/admin/category/`,
            method: "post",
            data,
            isFormData: true
        }
    }

    updateCategoryDetails(categoryId, {name, description}){
        return {
            urlPath: `${config.backendUrl}/admin/category/${categoryId}`,
            method: "patch",
            data: {name, description}
        }
    }

    updateCategoryImage(categoryId, data){
        return {
            urlPath: `${config.backendUrl}/admin/category/${categoryId}/image`,
            method: "patch",
            data,
            isFormData: true
        }
    }

    deleteCategory(categoryId){
        return {
            urlPath: `${config.backendUrl}/admin/category/${categoryId}`,
            method: "delete",
        }
    }

    // Order
    getAllOrders({sortBy, sortType, limit, page}){
        let url = `${config.backendUrl}/admin/orders`;

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

    getOrderById(orderid){
        return {
            urlPath: `${config.backendUrl}/admin/orders/${orderid}`,
        }
    }

    updateOrderStatus(orderid, {status}){
        return {
            urlPath: `${config.backendUrl}/admin/orders/${orderid}/status`,
            method: "patch",
            data: {status}
        }
    }


    //Banner
    createBanner(data){
        return {
            urlPath: `${config.backendUrl}/admin/banner`,
            method: "post",
            data
        }
    }

    deleteBanner(bannerid){
        return {
            urlPath: `${config.backendUrl}/admin/banner/${bannerid}`,
            method: "delete",
        }
    }

    addProductsToBanner(bannerid, products){
        return {
            urlPath: `${config.backendUrl}/admin/banner/${bannerid}/products`,
            method: "patch",
            data: products,
        }
    }
    
    updateBannerDetails(bannerid, data){
        return {
            urlPath: `${config.backendUrl}/admin/banner/${bannerid}/details`,
            method: "patch",
            data
        }
    }
    
    updateBannerImage(bannerid, bannerImage){
        return {
            urlPath: `${config.backendUrl}/admin/banner/${bannerid}/image`,
            method: "patch",
            data: bannerImage
        }
    }
    
};

const adminService = new AdminService();

export default adminService;