export interface Profile {
  authorImg: string
  authorID: number
  authorName: string
}


export interface ProfileRes {
  status: number;
  message: string;
  data: Profile[]
}
