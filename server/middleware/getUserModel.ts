import Models from "../db/Models"

export const getModel = async(token: string) => {
    //get the user UserProfile
    let user: any = null
    try{
        user = await Models.UserModel.findById((token))
    }catch(err){
        console.log("Error querying user profile.", err)
    }
    return user
}