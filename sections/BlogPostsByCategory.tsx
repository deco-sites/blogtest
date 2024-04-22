import Image from "apps/website/components/Image.tsx";
import { ComponentChildren } from "preact";
import { AppContext } from "apps/blog/mod.ts";
import { BlogPost } from "apps/blog/types.ts";
import { getRecordsByPath } from "apps/blog/utils/records.ts";

export interface Props {
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
}: Awaited<ReturnType<typeof loader>>) {
  return (
    <Container>
      <>
        <div class="gap-8 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
          {posts?.map((post) => (
            <a
              href={`/blog/${post.slug}`}
              class="border border-secondary overflow-hidden rounded-lg"
            >
              <Image
                width={380}
                height={274}
                class="object-fit w-full"
                sizes="(max-width: 640px) 100vw, 30vw"
                src={post.image || ""}
                alt={post.image}
                decoding="async"
                loading="lazy"
              />
              <div class="p-6 space-y-4">
                <div class="space-y-2">
                  <h3 class="text-2xl">{post.title}</h3>
                  <p class="text-base">{post.excerpt}</p>
                </div>
                <div class="flex flex-wrap gap-2">
                  {post.categories?.map((category) => (
                    <div class="badge badge-lg badge-primary text-xs">
                      {category.name}
                    </div>
                  ))}
                </div>
                <div class="flex flex-wrap gap-2">
                  <span>
                    {post.date
                      ? new Date(post.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : ""}
                  </span>
                  <span>•</span>
                  <span>{post.authors[0]?.name}</span>
                </div>
              </div>
            </a>
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
