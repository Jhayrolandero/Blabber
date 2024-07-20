export interface CommentRes {
  status: number;
  message: string;
  data: Comment[]
}

export interface Comment {
  commentID: number,
  commentContent: string,
  commentDate: Date,
  authorName: string
}
