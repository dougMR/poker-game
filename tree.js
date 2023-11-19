const data = [
  {
    type: "folder",
    name: "Parent 1",
    children: [
      {
        type: "folder",
        name: "Parent A1",
        children: [{ type: "file", name: "A1-F" }],
      },
      { type: "file", name: "1-F" }
    ],
  },
  {
    type: "file",
    name: "File at Root"
  }
];

const folders = [{id: 1, name: "folder 1"}]
const files = [{id:1, folderID:1, name: "file 1"}, {id:1, folderID:null, name: "file 1"}]

console.log("tree ran")
