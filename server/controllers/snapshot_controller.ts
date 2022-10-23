import { Request, Response} from 'express';

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

export { getSnap, saveSnap }