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
        Policies: JSON.stringify(user.AccessControlPolicy)
    })
}

const addAccessControlPolicy = async (req: Request, res: Response) => {
    //get the user model
    let user: any = await getModel(req.cookies.jwt)

    const payload = req.body

    //create driveUsers
    let allowedReaders = payload.allowedReaders.map((driveUser: any) => {
        return new Models.DriveUserModel({
            type: driveUser.type,
            email: driveUser.email,
            displayName: driveUser.displayName
        })
    })

    let deniedReaders = payload.deniedReaders.map((driveUser: any) => {
        return new Models.DriveUserModel({
            type: driveUser.type,
            email: driveUser.email,
            displayName: driveUser.displayName
        })
    })

    let allowedWriters = payload.allowedWriters.map((driveUser: any) => {
        return new Models.DriveUserModel({
            type: driveUser.type,
            email: driveUser.email,
            displayName: driveUser.displayName
        })
    })

    let deniedWriters = payload.deniedWriters.map((driveUser: any) => {
        return new Models.DriveUserModel({
            type: driveUser.type,
            email: driveUser.email,
            displayName: driveUser.displayName
        })
    })

    //create the policy
    let newPolicy = new Models.ACPModel({
        allowedReaders: allowedReaders,
        deniedReaders: deniedReaders,
        allowedWriters: allowedWriters,
        deniedWriters: deniedWriters,
        isGroup: false
    })

    //add the policy to the user model
    user.AccessControlPolicy.push(newPolicy)
    await user.save()
    console.log(JSON.stringify(newPolicy))

    res.status(200).json({ 
        status: 'OK',
        AccessControlPolicy: JSON.stringify(newPolicy)
    })
}

const deleteAccessControlPolicy = async (req: Request, res: Response) => {
    res.status(200).json({ 
        status: 'OK' 
    })
}

export { saveQuery, getSavedQueries, getAccessControlPolicies, addAccessControlPolicy, deleteAccessControlPolicy }