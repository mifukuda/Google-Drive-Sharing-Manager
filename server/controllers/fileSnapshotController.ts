import { Request, Response} from 'express';
import { User } from '../classes/User';
import { UserProfile } from '../classes/UserProfile'

const createSnapshot = async (req: Request, res: Response) => {
    //get the user UserProfile
    const user: UserProfile = await UserProfile.getUserProfileById((req as any)._id)

    //create the snapshotvb 

    //update and save the user userProfile

    //serilize the snapshot and return
}

const getSnap = (req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK'
    })
}

const saveSnap = (req: Request, res: Response) => {
    res.status(200).json({ 
        status: 'OK' 
    })
}

export { createSnapshot, getSnap, saveSnap }