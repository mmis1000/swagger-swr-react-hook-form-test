export default (new Array(1000)).fill('').map((_, index) => ({
  "id": index,
  "title": "Post " + index,
  "content": "Content" + index,
  "author": "username" + index
}))