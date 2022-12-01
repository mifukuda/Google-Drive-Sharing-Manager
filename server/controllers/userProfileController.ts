import { Request, Response } from "express"
import { getModel } from "../middleware/getUserModel"
import { Types } from 'mongoose'
import Models from '../db/Models';


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
    //get the userModel
    let user: any = await getModel(req.cookies.jwt)

    res.status(200).json({ 
        status: 'OK',
        acps: user.AccessControlPolicy
    })
}

const addAccessControlPolicy = async (req: Request, res: Response) => {
    //get the user model
    let user: any = await getModel(req.cookies.jwt)
    if (!user) return res.status(400).send({ message: "user not found" });

    const { query, AR, DR, AW, DW, is_group } = req.body

    //create the policy
    let newPolicy = new Models.ACPModel({
        query: query,
        AR: (AR == "" ? [] : AR.split(",").map((element: any) => element.trim())),
        DR: (DR == "" ? [] : DR.split(",").map((element: any) => element.trim())),
        AW: (AW == "" ? [] : AW.split(",").map((element: any) => element.trim())),
        DW: (DW == "" ? [] : DW.split(",").map((element: any) => element.trim())),
        isGroup: is_group
    })

    //add the policy to the user model
    user.AccessControlPolicy.push(newPolicy) 
    await user.save()

    res.status(200).json({ 
        status: 'OK',
        acp: newPolicy
    })
}

const deleteAccessControlPolicy = async (req: Request, res: Response) => {
    let user: any = await getModel(req.cookies.jwt)
    console.log(user.AccessControlPolicy)
    user.AccessControlPolicy = user.AccessControlPolicy.filter((acp: any) => {
        return acp._id.toString() !== req.body.acp_id
    })
    await user.save()
    res.status(200).json({ status: 'OK' })
}

export { saveQuery, getSavedQueries, getAccessControlPolicies, addAccessControlPolicy, deleteAccessControlPolicy }