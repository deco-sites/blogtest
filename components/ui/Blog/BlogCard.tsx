import { BlogPost } from "apps/blog/types.ts";

export const BlogCard = ({ post }: { post: BlogPost }) => {
  return (
    <div class="shadow-card rounded-lg overflow-hidden bg-white w-full">
      <img
        loading="lazy"
        src={post.image || ""}
        alt={post.image}
        class="w-full h-[120px] object-cover"
      />

      <div class="pt-3 pb-4 px-[30px] mx-auto flex flex-col gap-3 h-full">
        <h3 class="uppercase text-center text-base font-normal">
          {post.title}
        </h3>

        <div
          class="text-xs text-neutral-700 max-h-32 overflow-hidden mask-text grow"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <a
          class="text-base text-[#6745BF] underline text-center"
          href={`/blog/${post.slug}`}
        >
          Leia mais
        </a>
      </div>
    </div>
  );
};
