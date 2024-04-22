import { ComponentChildren } from "preact";
import { AppContext } from "apps/blog/mod.ts";
import { BlogPost } from "apps/blog/types.ts";
import { getRecordsByPath } from "apps/blog/utils/records.ts";
import { BlogCard } from "site/components/ui/Blog/BlogCard.tsx";

export interface Props {
  sectionTitle?: string;
  slug?: string;
}

function Container({ children }: { children: ComponentChildren }) {
  return (
    <div class="container lg:mx-auto lg:py-14 mx-2 py-12 text-sm">
      <div class="space-y-8">{children}</div>
    </div>
  );
}

export default function BlogPosts({
  posts,
  sectionTitle,
}: Awaited<ReturnType<typeof loader>>) {
  return (
    <Container>
      <>
        <h2 class="text-xl text-accent font-medium py-6 px-2">
          {sectionTitle}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-auto items-stretch gap-8">
          {posts?.map((post) => (
            <BlogCard post={post} />
          ))}
        </div>
      </>
    </Container>
  );
}

const COLLECTION_PATH = "collections/blog/posts";
const ACCESSOR = "post";

/**
 * @title BlogPostCategory
 * @description Fetches a specific blog post page by its category slug.
 *
 * @param props - Contains the slug of the category.
 * @param _req - The request object (unused).
 * @param ctx - The application context.
 * @returns A promise that resolves to the blog post or undefined if not found.
 */
export async function loader(props: Props, req: Request, ctx: AppContext) {
  const posts = await getRecordsByPath<BlogPost>(
    ctx,
    COLLECTION_PATH,
    ACCESSOR
  );

  const categoryPosts = posts.filter(
    (post) => post.categories.findIndex((cat) => cat.slug === props.slug) !== -1
  );

  if (!categoryPosts) {
    return { ...props, posts: null };
  }

  return { ...props, posts: categoryPosts };
}
