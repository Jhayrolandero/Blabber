export interface Blog {
  blogTitle: string;
  blogID: number
  blogCreatedDate: Date
  blogUpdatedDate: Date
  blogContent: string
  tagID: number
  authorID: number
  authorName: string
  email: string
  author_blogID: number
  public: boolean
}


export interface BlogRes {
  status: number;
  message: string;
  data: Blog[]
}
