export interface BlogPost {
  blog_id: number;
  user_id: number;
  title: string;
  content: string;
  image: string;
  category: string;
  preview: string;
  date_posted: Date;
  last_edited_date: Date | null;
}

export interface CreateBlogPost {
  title: string;
  content: string;
  image: string;
  category: string;
}

export interface UpdateBlogPost {
  title: string;
  content: string;
  image: string;
  category: string;
}
