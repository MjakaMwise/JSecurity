import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBlogPostById, blogPosts } from "@/lib/blogData";
import BackgroundBoxes from "@/components/aceternity/BackgroundBoxes";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = getBlogPostById(Number(id));

  if (!post) {
    return (
      <div className="pt-16">
        <section className="relative section-padding text-center overflow-hidden" style={{ background: "#07122E" }}>
          <BackgroundBoxes />
          <div className="container mx-auto max-w-3xl relative z-10">
            <h1 className="text-4xl font-display font-black mb-4" style={{ color: "#FFFFFF" }}>
              Post Not Found
            </h1>
            <p className="mb-6" style={{ color: "#B0BED1" }}>The blog post you're looking for doesn't exist.</p>
            <Button
              onClick={() => navigate("/blog")}
              style={{ background: "#00D4FF", color: "#07122E" }}
              className="font-semibold"
            >
              ← Back to Blog
            </Button>
          </div>
        </section>
      </div>
    );
  }

  // Get related posts (same category, different post)
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="pt-16" style={{ background: "#0D1B45" }}>
      {/* Back Button */}
      <div className="sticky top-0 z-40 border-b" style={{ background: "rgba(13, 27, 69, 0.95)", borderColor: "rgba(0,212,255,0.1)" }}>
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-cyan-400"
            style={{ color: "#008CBF" }}
          >
            <ArrowLeft size={16} />
            Back to Blog
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="section-padding" style={{ background: "#07122E" }}>
        <div className="container mx-auto max-w-3xl">
          <div className="mb-6">
            <span className="badge-pill inline-block mb-4">{post.category}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black leading-tight mb-6" style={{ color: "#FFFFFF" }}>
            {post.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b" style={{ borderColor: "rgba(0,212,255,0.15)" }}>
            <div className="flex items-center gap-2" style={{ color: "#008CBF" }}>
              <User size={16} />
              <span className="text-sm">{post.author}</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: "#008CBF" }}>
              <Calendar size={16} />
              <span className="text-sm">{post.date}</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: "#008CBF" }}>
              <Clock size={16} />
              <span className="text-sm">{post.readTime} read</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ background: "rgba(0,212,255,0.1)", color: "#00D4FF" }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Excerpt */}
          <p className="text-lg font-light leading-relaxed mb-8" style={{ color: "#B0BED1" }}>
            {post.excerpt}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container mx-auto max-w-3xl">
          <div
            className="prose prose-invert max-w-none"
            style={{
              "--tw-prose-body": "#B0BED1",
              "--tw-prose-headings": "#FFFFFF",
              "--tw-prose-bold": "#FFFFFF",
            } as React.CSSProperties}
          >
            <article
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="blog-content"
              style={{
                color: "#B0BED1",
                lineHeight: "1.8",
              }}
            />
          </div>

          {/* Post Footer */}
          <div className="mt-16 pt-8 border-t" style={{ borderColor: "rgba(0,212,255,0.15)" }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex-1">
                <p className="text-sm mb-2" style={{ color: "#B0BED1" }}>
                  <strong>Author:</strong> {post.author}
                </p>
                <p className="text-sm" style={{ color: "#B0BED1" }}>
                  <strong>Category:</strong> {post.category}
                </p>
              </div>
              <Button
                onClick={() => navigate("/blog")}
                style={{ background: "#00D4FF", color: "#07122E" }}
                className="font-semibold"
              >
                ← Back to Blog
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section-padding" style={{ background: "#0F2050" }}>
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl font-display font-black mb-8" style={{ color: "#FFFFFF" }}>
              Related Articles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <div
                  key={relatedPost.id}
                  className="rounded-lg p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
                  style={{
                    background: "#07122E",
                    border: "1px solid rgba(0,212,255,0.12)",
                  }}
                  onClick={() => navigate(`/blog/${relatedPost.id}`)}
                >
                  <span className="badge-pill text-[10px] mb-3 inline-block">{relatedPost.category}</span>
                  <h3 className="text-sm font-display font-bold mb-2 leading-tight group-hover:text-cyan-400 transition-colors" style={{ color: "#FFFFFF" }}>
                    {relatedPost.title}
                  </h3>
                  <p className="text-xs mb-3 leading-relaxed" style={{ color: "#B0BED1" }}>
                    {relatedPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs" style={{ color: "#008CBF" }}>
                    <span>{relatedPost.author}</span>
                    <span>{relatedPost.readTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetail;
