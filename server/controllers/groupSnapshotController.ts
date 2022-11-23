import { UploadedFile } from "express-fileupload";
import Models from "../db/Models";
import { groupSnapshotModel } from "../db/Models/GroupSnapshotSchema";
import moment from "moment"

const uploadGroup = async (req: any, res: any) => {
    let user: any = await Models.UserModel.findById((req.cookies.jwt))
    if (!user) return res.status(400).send({ message: "failed to get current user from database" })
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send({ message: 'No files were uploaded.' });
    }
    let file: UploadedFile = req.files.memberlist
    let emails: Set<string> = new Set<string>()
    let text: string = file.data.toString()
    Array.from(text.matchAll(/mailto:[^\"]*\"/g)).forEach((match) => {
        emails.add(match[0].slice(match[0].indexOf(":") + 1, -1))
    })
    if (emails.size === 0) return res.status(400).send({ message: "No emails found in input file" })
    let saved: any
    try {
        let date = new Date(req.body.timestamp).toLocaleString()
        let groupModel = new groupSnapshotModel({ name: req.body.group_name, email: req.body.group_email, members: [...emails], timestamp: date })
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
    let user: any = await Models.UserModel.findById((req.cookies.jwt)).populate({ path: 'groupSnapshots', model: 'GroupSnapshots' })
    if (!user) return res.status(400).send({ message: "failed to get current user from database" })
    if (user.groupSnapshots.length === 0) return res.status(400).send({ message: "no group snapshots found for user" })
    let snapshot: any = await Models.FileSnapshotModel.findById(req.body.snapshot_id)
    if (!snapshot) res.status(400).send({ message: 'snapshot with given id not found' });
    let snapshot_timestamp = moment(snapshot.createdAt)
    let mindiff = Number.MAX_VALUE
    let mingroup = user.groupSnapshots[0]
    let emailFound = false
    for (let i = 0; i < user.groupSnapshots.length; i++) {
        let curr_group = user.groupSnapshots[i]
        if (curr_group.email === req.body.group_email) {
            emailFound = true
        }
        else {
            continue
        }
        let group_timestamp_date = moment(curr_group.timestamp)
        let currdiff = snapshot_timestamp.diff(group_timestamp_date)
        if (currdiff < mindiff) {
            mindiff = currdiff
            mingroup = curr_group
        }
    }
    if (!emailFound) return res.status(400).send({ message: 'email not found in database' }); 
    res.status(200).json({ members: mingroup.members })
}

export { uploadGroup, getGroupMembers }