import React from "react";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import BlogPostItem from "@theme-original/BlogPostItem";
import GiscusComponent from "@site/src/components/GiscusComponent";

export default function BlogPostItemWrapper(props) {
  const { metadata, isBlogPostPage } = useBlogPost();

  const { frontMatter } = metadata;
  const { disableComments } = frontMatter;

  return (
    <>
      <BlogPostItem {...props} />
      <br />
      {!disableComments && isBlogPostPage && <GiscusComponent />}
    </>
  );
}
