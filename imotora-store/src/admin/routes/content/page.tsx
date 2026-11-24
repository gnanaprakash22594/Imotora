import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BookOpen } from "@medusajs/icons"
import { Button, Container, Heading, Input, Label, Select, Text, Textarea, Badge } from "@medusajs/ui"
import { useEffect, useState } from "react"

type Article = {
  id: number
  slug: string
  type: "blog" | "encyclopedia"
  category: string
  title: string
  excerpt: string
  author: string
  created_at: string
}

const ContentAdminPage = () => {
  const [posts, setPosts] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState<"blog" | "encyclopedia">("blog")
  const [category, setCategory] = useState("F1 News")
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState("/images/col-motorsport.jpg")
  const [tags, setTags] = useState("F1,Motorsport,Diecast")
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const loadPosts = async () => {
    setLoading(true)
    try {
      const res = await fetch("/admin/content/posts", { credentials: "include" })
      const data = await res.json()
      setPosts(data.posts || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setSaving(true)
    setMsg(null)
    try {
      const res = await fetch("/admin/content/posts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          category,
          title,
          excerpt,
          content,
          cover_image: coverImage,
          tags,
        }),
      })
      if (!res.ok) throw new Error("Failed to publish")
      setTitle("")
      setExcerpt("")
      setContent("")
      setMsg("Published successfully! Live on the iMotora Blog & F1 Encyclopedia.")
      loadPosts()
    } catch (err: any) {
      setMsg(err?.message || "Publish failed")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    await fetch(`/admin/content/posts/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
    loadPosts()
  }

  return (
    <div className="space-y-6">
      <Container className="p-6 space-y-4">
        <div>
          <Heading level="h1">iMotora Blog &amp; F1 Encyclopedia Manager</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Publish Formula 1 news articles and F1 Encyclopedia profiles (Racers, Teams &amp; Cars).
          </Text>
        </div>

        <form onSubmit={handlePublish} className="space-y-4 pt-2 border-t border-ui-border-base">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label size="small">Section</Label>
              <Select
                value={type}
                onValueChange={(v) => {
                  const nextType = v as "blog" | "encyclopedia"
                  setType(nextType)
                  setCategory(nextType === "blog" ? "F1 News" : "F1 Racers")
                }}
              >
                <Select.Trigger className="mt-1">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="blog">Blog — Latest F1 News</Select.Item>
                  <Select.Item value="encyclopedia">Blog — F1 Encyclopedia (Racers / Teams / Cars)</Select.Item>
                </Select.Content>
              </Select>
            </div>
            <div>
              <Label size="small">Category</Label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="F1 News, F1 Racers, F1 Teams, F1 Cars..."
                className="mt-1"
              />
            </div>
            <div>
              <Label size="small">Cover Image Path / URL</Label>
              <Input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label size="small">Headline / Encyclopedia Title *</Label>
            <Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lando Norris (#4) — McLaren F1 Star"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label size="small">Short Excerpt</Label>
              <Input
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="1–2 sentence summary shown on cards"
                className="mt-1"
              />
            </div>
            <div>
              <Label size="small">Tags (comma-separated)</Label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label size="small">Full Content *</Label>
            <Textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your F1 race report or F1 racer/team/car encyclopedia profile..."
              className="mt-1"
            />
          </div>

          {msg && <Text size="small" className="text-emerald-600 font-medium">{msg}</Text>}

          <div className="flex justify-end">
            <Button type="submit" variant="primary" isLoading={saving}>
              Publish to Blog
            </Button>
          </div>
        </form>
      </Container>

      <Container className="p-6 space-y-4">
        <Heading level="h2">Published Blog &amp; F1 Encyclopedia ({posts.length})</Heading>
        {loading ? (
          <Text size="small" className="text-ui-fg-subtle">Loading content...</Text>
        ) : (
          <div className="divide-y divide-ui-border-base">
            {posts.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge color={p.type === "blog" ? "red" : "blue"} size="2xsmall">
                      {p.type === "blog" ? "F1 NEWS" : "F1 ENCYCLOPEDIA"}
                    </Badge>
                    <Badge color="grey" size="2xsmall">{p.category}</Badge>
                  </div>
                  <Text weight="plus" className="truncate">{p.title}</Text>
                  <Text size="xsmall" className="text-ui-fg-subtle truncate">{p.excerpt}</Text>
                </div>
                <Button
                  size="small"
                  variant="danger"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Blog & F1 Encyclopedia",
  icon: BookOpen,
})

export default ContentAdminPage

