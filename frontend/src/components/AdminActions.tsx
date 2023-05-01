import { IconButton, Tooltip, HStack } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { User } from "./authContext";
import { BlogPost } from "./BlogPost";
import NewBlogPostModal from "./NewBlogPostModal";

interface AdminActionsProps {
  user: User | null;
  onDelete: () => void;
  onUpdatePost: (
    postId: number,
    title: string,
    content: string,
    image: File | null
  ) => Promise<void>;
  onRefreshPosts: () => void;
  post: BlogPost;
}

export const AdminActions: React.FC<AdminActionsProps> = ({
  user,
  onDelete,
  onUpdatePost,
  onRefreshPosts,
  post,
}) => {
  return (
    <HStack spacing={2} position="absolute" top="5px" right="20px" zIndex={1}>
      <NewBlogPostModal
        trigger={
          <Tooltip label="Edit" placement="top">
            <IconButton
              aria-label="Edit"
              icon={<EditIcon />}
              size="sm"
              colorScheme="blue"
              variant="ghost"
            />
          </Tooltip>
        }
        onUpdatePost={onUpdatePost}
        onRefreshPosts={onRefreshPosts}
        initialPost={post}
      />
      <Tooltip label="Delete" placement="top">
        <IconButton
          aria-label="Delete"
          icon={<DeleteIcon />}
          size="sm"
          colorScheme="red"
          variant="ghost"
          onClick={onDelete}
        />
      </Tooltip>
    </HStack>
  );
};
