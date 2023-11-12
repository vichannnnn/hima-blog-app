export interface BlogPost {
  blog_id: number;
  user_id: number;
  title: string;
  content: string;
  image: string;
  category: string;
  preview: string;
  date_posted: Date;
  last_edited_date?: Date;
}

export interface CreateBlogPost {
  title: string;
  preview: string;
  content: string;
  image?: File;
  category?: string;
}

export interface UpdateBlogPost {
  title?: string;
  preview?: string;
  content?: string;
  image?: File;
  category?: string;
}
