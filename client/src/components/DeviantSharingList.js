import React from "react";
import DeviantSharingCard from "./DeviantSharingCard";

export default function DeviantSharingList() {
    const roles = ["Viewer", "Commenter", "Editor", "Owner"];
    let key = 0;
    let data =
    [
        [
            [
            {
                "dbID": "NEEDS TO BE CHANGED",
                "id": "09030750548068505369",
                "granted_to": {
                "email": "psekar@cs.stonybrook.edu",
                "display_name": "Qamber Jafri"
                },
                "role": 0
            },
            {
                "dbID": "NEEDS TO BE CHANGED",
                "id": "07998414906160512060",
                "granted_to": {
                "email": "qjafri@cs.stonybrook.edu",
                "display_name": "Qamber Jafri"
                },
                "role": 3
            }
            ],
            [
            {
                "_id": "NEEDS TO BE CHANGED",
                "id": "17qIfalc5ZpeKnnIVKbiTq-zEf9hyY_qr2Stgly3OPa0",
                "parent": null,
                "date_created": "2022-11-01T02:35:08.738Z",
                "date_modified": "2022-11-01T02:35:52.352Z",
                "name": "i want to make money now",
                "owner": {
                "email": "qjafri@cs.stonybrook.edu",
                "display_name": "Qamber Jafri"
                },
                "permissions": [
                {
                    "dbID": "NEEDS TO BE CHANGED",
                    "id": "12955906192933072242",
                    "granted_to": {
                    "email": "qamber.jafri@stonybrook.edu",
                    "display_name": "Qamber Jafri"
                    },
                    "role": 2
                },
                {
                    "dbID": "NEEDS TO BE CHANGED",
                    "id": "09030750548068505369",
                    "granted_to": {
                    "email": "psekar@cs.stonybrook.edu",
                    "display_name": "Qamber Jafri"
                    },
                    "role": 0
                },
                {
                    "dbID": "NEEDS TO BE CHANGED",
                    "id": "07998414906160512060",
                    "granted_to": {
                    "email": "qjafri@cs.stonybrook.edu",
                    "display_name": "Qamber Jafri"
                    },
                    "role": 3
                }
                ],
                "shared_by": null,
                "mime_type": "application/vnd.google-apps.document",
                "source": "ml vip "
            }
            ]
        ]
    ]

    let cards = []
    buildList(data);

    function buildList(results) {
        for(let i=0; i < results.length; i++) {
            buildListHelper(results[i]);
        }
    }

    function buildListHelper(result) {
        let majorityPermissions = result[0].map((element, i) =>  <p key={i}>{i + 1}. {element.granted_to.email}, {element.granted_to.display_name} ({roles[element.role]})</p>)
        majorityPermissions.unshift(<p><b>Majority Permissions</b></p>);
        cards = cards.concat(result[1].map((element, i) => <DeviantSharingCard key={key++} majorityPermissions={majorityPermissions} deviantFile={element}/>))
    }

    return (
        <div className="deviantsharinglist">
            {cards}
        </div>
    );
}