export interface Blog {
  blogTitle: string;
  blogID: number
  blogCreatedDate: Date
  blogUpdatedDate: Date
  blogContent: string
  tagID: number
}


export interface BlogRes {
  status: number;
  message: string;
  data: Blog[]
}
