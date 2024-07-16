export interface Tag {
  tagID: number;
  tagTitle: string
}


export interface TagRes {
  status: number;
  message: string;
  data: Tag[]
}
