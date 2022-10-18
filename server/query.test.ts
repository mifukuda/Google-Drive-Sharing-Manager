import { FileInfoSnapshot, DriveRoot, Query } from './DriveAdapter';
const {GoogleDriveAdapter, dummyTreeTest} = require('./DriveAdapter.ts');
const {auth_client} = require('./controllers/auth_controller.ts');

test('adds 1 + 2 to equal 3', async () => {
    let decoded_token = "";
    auth_client.setCredentials(decoded_token)
    let google_drive_adapter = new GoogleDriveAdapter()
    let snapshot: FileInfoSnapshot = await google_drive_adapter.createFileInfoSnapshot(decoded_token)
    console.log(snapshot);
    let query = ""
    let prop = query.split(":")[0]
    let val = query.split(":")[1]
    let drivefiles = snapshot.applyQuery(new Query(prop, val)).map(f => {
      return f.serialize()
    })
  });