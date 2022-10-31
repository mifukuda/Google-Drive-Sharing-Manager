import mongoose, {ConnectOptions} from "mongoose"
const CONFIG = require('../configs.js')

const connect = () => {
    return mongoose
        .connect(CONFIG.dbUri).then(() => {
            console.log("MongoDB Connected")
        }).catch((err) => {
            console.log("Mongodb Connection Error:", err)
        })
}

export default connect