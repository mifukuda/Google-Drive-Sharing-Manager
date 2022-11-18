import { Request, Response } from "express"

const saveQuery = async (req: Request, res: Response) => {
    res.status(200).json({ 
        status: 'OK' 
    })
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

export { saveQuery, getAccessControlPolicies, addAccessControlPolicy, deleteAccessControlPolicy }