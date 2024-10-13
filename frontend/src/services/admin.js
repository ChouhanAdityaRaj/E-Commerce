import config  from "../config/config";

class AdminService {

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

}

const adminService = new AdminService();

export default adminService;