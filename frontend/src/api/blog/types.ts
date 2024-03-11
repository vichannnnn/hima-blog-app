export interface BlogPost {
  blog_id: number;
  user_id: number;
  title: string;
  slug: string;
  content: string;
  image: string;
  category: string;
  preview: string;
  date_posted: Date;
  last_edited_date?: Date;
}

export interface PaginatedBlogPosts {
  items: BlogPost[];
  page: number;
  pages: number;
  size: number;
  total: number;
}

export interface CreateBlogPost {
  title: string;
  preview: string;
  content: string;
  category: string;
  image?: File;
}

export interface UpdateBlogPost {
  title?: string;
  preview?: string;
  content?: string;
  image?: File;
  category?: string;
}
