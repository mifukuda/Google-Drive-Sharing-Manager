import { Request, Response } from "express"
import { getModel } from "../middleware/getUserModel"


const getSavedQueries = async (req: Request, res: Response) => {
    let user: any = await getModel(req.cookies.jwt)
    res.status(200).json({ queries: user.queryHistory })
}

const saveQuery = async (req: Request, res: Response) => {
    let user: any = await getModel(req.cookies.jwt)
    user.queryHistory.push(req.body.query)
    await user.save()
    res.status(200).json({ status: 'OK' })
}

const getAccessControlPolicies = async (req: Request, res: Response) => {
    res.status(200).json({ 
        status: 'OK' 
    })
}

const addAccessControlPolicy = async (req: Request, res: Response) => {
    res.status(200).json({ 
        status: 'OK' 
    })
}

const deleteAccessControlPolicy = async (req: Request, res: Response) => {
    res.status(200).json({ 
        status: 'OK' 
    })
}

export { saveQuery, getSavedQueries, getAccessControlPolicies, addAccessControlPolicy, deleteAccessControlPolicy }