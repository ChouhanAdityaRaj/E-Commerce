import config  from "../config/config";

class AdminService {
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

}

const adminService = new AdminService();

export default adminService;