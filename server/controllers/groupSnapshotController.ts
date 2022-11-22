import { UploadedFile } from "express-fileupload";
import Models from "../db/Models";
import { groupSnapshotModel } from "../db/Models/GroupSnapshotSchema";

const uploadGroup = async (req: any, res: any) => {
    let user: any = await Models.UserModel.findById((req.cookies.jwt))
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send({ message: 'No files were uploaded.' });
    }
    let file: UploadedFile = req.files.memberlist
    let emails: Set<string> = new Set<string>()
    let text: string = file.data.toString()
        Array.from(text.matchAll(/mailto:[^\"]*\"/g)).forEach((match) => {
            emails.add(match[0].slice(match[0].indexOf(":") + 1, -1))
        })
    if (emails.size === 0)
        return res.status(400).send({ message: "No emails found in input file" })
    let saved: any
    try {
        let groupModel = new groupSnapshotModel({ name: req.body.name, members: [...emails] })
        saved = await groupModel.save()
        user.groupSnapshots.push(saved._id)
        await user.save()
    } catch (e) {
        console.log(e)
        return res.status(400).send("Error with saving to database: " + e)
    }
    res.send({ id: saved._id }) 
}

const getGroupMembers = async (req: any, res: any) => {
    let snapshot: any = await Models.FileSnapshotModel.findById(req.body.snapshot_id)
    if (!snapshot) res.status(400).send({ message: 'snapshot with given id not found' });
    // let timestamp = snapshot.createdAt
    let groupModel: any = await Models.GroupSnapshotModel.findOne({ name: req.body.group_name })
    if (!groupModel) res.status(400).send({ message: 'group with given name not found' });
    console.log(groupModel)
    res.status(200).json({ members: groupModel.members })
}

export { uploadGroup, getGroupMembers }